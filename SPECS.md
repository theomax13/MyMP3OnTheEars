# Spécifications Projet : Lecteur de Musique (Clone Spotify)

**Version:** 1.0
**Stack Technique:** Electron, Vue 3 (Vite), Pinia, Tailwind CSS, YouTube IFrame API

## 1. Description Générale

Ce projet vise à créer une application de bureau multiplateforme qui émule l'expérience utilisateur de Spotify, en utilisant YouTube comme source de données et de lecture audio. L'approche technique se base sur l'intégration "propre" de l'API YouTube IFrame Player pour garantir la stabilité et le respect des conditions d'utilisation de base de YouTube [web:1][web:4].

---

## 2. Architecture & Spécifications Techniques

### Processus & Communication (IPC)

- **Main Process (Node.js) :**
  - Gestion de la fenêtre principale (`BrowserWindow`).
  - Intégration OS : Raccourcis clavier globaux (`globalShortcut` pour les touches Média) [web:6].
  - Accès sécurisé au système de fichiers (via `electron-store`).
- **Renderer Process (Vue 3) :**
  - Toute l'interface utilisateur.
  - Logique applicative (gestion de l'état avec Pinia).
  - Communication avec le Main Process via le Preload Script (`contextBridge`).
- **Sécurité :**
  - `contextIsolation` doit rester activée (`true`) [web:19].
  - Pas d'API Node.js exposée directement au Renderer.

### Moteur de Lecture (Player Engine)

- **Source :** `YouTube IFrame Player API`.
- **Intégration :** Un seul composant Vue `<YouTubePlayer>` contiendra l'iFrame.
- **Visibilité :** Le lecteur iFrame sera caché visuellement (ex: `position: absolute; left: -9999px;`) mais jamais mis en `display: none` pour ne pas interrompre la lecture [web:5][web:8].
- **Contrôle :** L'UI Vue (ex: `<PlayerControls>`) communiquera avec l'iFrame via un Store Pinia qui sert de "bus d'événements".

### Gestion des Données

- **Recherche :** Utilisation de l'API **YouTube Data v3** (endpoint `search`) ou d'un scraper léger comme `ytsr` pour économiser les quotas API [web:17].
- **Playlists & Favoris :** Stockage local dans un fichier JSON via `electron-store`.

---

## 3. Répartition des Tâches (Epics & User Stories)

### Epic 1 : Noyau & Lecteur Audio (Backend)

- **[Tâche]** Mettre en place la structure du projet avec `electron-vite` et le template Vue 3.
- **[Tâche]** Créer le store Pinia `usePlayerStore` avec les états : `isPlaying`, `volume`, `currentTime`, `currentTrack`.
- **[Tâche]** Créer le composant `<YouTubePlayer.vue>` qui charge l'API IFrame.
- **[Tâche]** Implémenter la logique de contrôle : `play()`, `pause()`, `setVolume()` dans le store, qui déclenche les commandes sur l'instance de l'iFrame.
- **[Tâche]** Gérer les événements de l'iFrame (`onStateChange`, `onError`) pour mettre à jour le store (ex: passer à la chanson suivante à la fin d'une vidéo).

### Epic 2 : Interface Utilisateur (Frontend)

- **[Tâche]** Installer et configurer Tailwind CSS avec un thème sombre (type Spotify).
- **[Tâche]** Créer le layout principal de l'application (Composants : `Sidebar.vue`, `PlayerControls.vue`, `MainView.vue`).
- **[Tâche]** Intégrer `vue-router` pour la navigation (Accueil, Recherche, Bibliothèque).
- **[Tâche]** Lier les composants UI au `usePlayerStore` :
  - Le bouton Play/Pause doit refléter l'état `isPlaying`.
  - Le slider de volume doit lire et écrire la valeur `volume`.
  - La barre de progression doit se mettre à jour.
- **[Tâche]** Utiliser `vue-virtual-scroller` pour afficher les longues listes de résultats de recherche ou de playlists.

### Epic 3 : Données & Contenu

- **[Tâche]** Créer un service `youtube.service.js` pour encapsuler les appels à l'API de recherche.
- **[Tâche]** Développer la page de recherche avec un champ de saisie qui affiche les résultats.
- **[Tâche]** Au clic sur un résultat, mettre à jour le `currentTrack` dans le store Pinia pour démarrer la lecture.
- **[Tâche]** Implémenter la logique de playlist : ajouter à la file d'attente, sauvegarder une playlist.
- **[Tâche]** Utiliser `electron-store` pour rendre les playlists persistantes entre les sessions.

### Epic 4 : Intégration & Finalisation

- **[Tâche]** Dans le Main Process, implémenter les `globalShortcut` pour `MediaPlayPause`, `MediaNextTrack`, `MediaPreviousTrack`.
- **[Tâche]** Faire communiquer ces raccourcis avec le Renderer Process via `ipcMain` et `ipcRenderer`.
- **[Tâche]** Gérer les erreurs de l'API YouTube (ex: "Vidéo non disponible pour l'intégration").
- **[Tâche]** Ajouter des transitions visuelles (`<Transition>`) pour fluidifier la navigation entre les pages.
- **[Tâche]** **[Bonus]** Intégrer l'API `navigator.mediaSession` pour afficher les métadonnées sur l'OS.
