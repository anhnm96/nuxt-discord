<script setup lang="ts">
const { state, cancel, confirm } = useDialog()
</script>

<template>
  <Transition v-if="state.show">
    <div class="fixed inset-0 grid place-items-center">
      <Transition name="fade" appear>
        <div
          v-if="state.show"
          class="absolute inset-0 bg-black/70"
          @click="cancel"
        ></div>
      </Transition>
      <Transition name="modal2" appear>
        <div
          v-if="state.show"
          class="z-50 w-4/5 max-w-sm overflow-hidden rounded-lg bg-gray-800"
        >
          <div class="space-y-4 pt-4">
            <header v-if="state.title" class="px-4">
              <h2 class="font-bold uppercase">{{ state.title }}</h2>
            </header>
            <main class="px-4">
              <p>{{ state.content }}</p>
            </main>
            <footer class="bg-secondary flex justify-end space-x-2 px-4 py-4">
              <button
                class="bg-transparent px-4 py-2 text-white hover:underline"
                @click="cancel"
              >
                {{ state.cancelText }}
              </button>
              <button
                class="rounded-md bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                @click="confirm"
              >
                {{ state.okText }}
              </button>
            </footer>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
