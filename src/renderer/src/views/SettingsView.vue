<template>
  <div class="h-full w-full p-8 text-white overflow-y-auto no-scrollbar">
    <h1 class="text-3xl font-bold mb-8">Paramètres</h1>

    <div class="grid grid-cols-1 gap-8 max-w-3xl">
      <!-- Section Général -->
      <section class="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700/50">
        <h2 class="text-xl font-semibold mb-4 text-primary-400 flex items-center gap-2">
          <i class="pi pi-info-circle"></i>
          Général
        </h2>

        <div class="space-y-4">
          <div class="flex justify-between items-center py-2 border-b border-slate-700/50">
            <span class="text-slate-300">Version</span>
            <span class="font-mono bg-slate-700 px-2 py-1 rounded text-sm">v1.0.0</span>
          </div>

          <div class="flex justify-between items-center py-2 border-b border-slate-700/50">
            <span class="text-slate-300">Développeur</span>
            <span class="text-slate-200">SUP DE VINCI</span>
          </div>

          <div class="flex justify-between items-center py-2">
            <span class="text-slate-300">Licence</span>
            <span class="text-slate-200">MIT</span>
          </div>
        </div>
      </section>

      <!-- Section Apparence -->
      <section class="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700/50">
        <h2 class="text-xl font-semibold mb-4 text-primary-400 flex items-center gap-2">
          <i class="pi pi-palette"></i>
          Apparence
        </h2>

        <div class="space-y-4">
          <div class="flex justify-between items-center py-2">
            <span class="text-slate-300">Thème</span>
            <div
              class="flex items-center gap-2 text-slate-400 bg-slate-900/50 px-3 py-1.5 rounded-full"
            >
              <i class="pi pi-moon"></i>
              <span>Sombre (Défaut)</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Section Données (Actions) -->
      <section class="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700/50">
        <h2 class="text-xl font-semibold mb-4 text-red-400 flex items-center gap-2">
          <i class="pi pi-database"></i>
          Zone de Danger
        </h2>

        <div class="space-y-4">
          <div
            class="flex items-center justify-between p-4 bg-red-900/10 border border-red-900/20 rounded-lg"
          >
            <div>
              <h3 class="font-medium text-red-200">Vider le cache</h3>
              <p class="text-sm text-red-300/60 mt-1">
                Efface les images temporaires et le cache de l'application
              </p>
            </div>
            <Button
              label="Vider"
              severity="danger"
              size="small"
              text
              icon="pi pi-trash"
              @click="clearCache"
              :loading="isClearingCache"
            />
          </div>

          <div
            class="flex items-center justify-between p-4 bg-red-900/10 border border-red-900/20 rounded-lg"
          >
            <div>
              <h3 class="font-medium text-red-200">Réinitialiser l'application</h3>
              <p class="text-sm text-red-300/60 mt-1">
                Supprime toutes les données locales (playlists, historiques...)
              </p>
            </div>
            <Button
              label="Réinitialiser"
              severity="danger"
              size="small"
              outlined
              icon="pi pi-exclamation-triangle"
              @click="resetApp"
              :loading="isResetting"
            />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
// On pourrait importer un Toast pour les feedback mais restons simple pour l'instant

const isClearingCache = ref(false)
const isResetting = ref(false)

const clearCache = async () => {
  isClearingCache.value = true
  // Simulation d'action
  await new Promise((resolve) => setTimeout(resolve, 1000))
  isClearingCache.value = false
  alert('Cache vidé avec succès (Simulation)')
}

const resetApp = async () => {
  if (!confirm('Êtes-vous sûr de vouloir tout effacer ? Cette action est irréversible.')) return

  isResetting.value = true
  // Simulation d'action
  await new Promise((resolve) => setTimeout(resolve, 1500))
  isResetting.value = false
  alert('Application réinitialisée (Simulation)')
  // Ici on pourrait recharger la page
  window.location.reload()
}
</script>

<style scoped>
/* Cache la scrollbar tout en permettant le défilement */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
