<script setup lang="ts">
const authStore = useAuthStore()
</script>

<template>
  <section class="bg-secondary-alt">
    <div class="flex h-[52px] items-center space-x-2 px-2">
      <BaseAvatar :img="authStore.user?.imageUrl || ''" :is-online="true" />
      <div class="flex-grow overflow-hidden">
        <p class="truncate text-sm font-bold text-white">
          {{ authStore.user?.username }}
        </p>
      </div>
      <div class="flex flex-shrink-0">
        <button
          class="grid h-8 w-8 place-items-center rounded text-gray-400 hover:bg-modifier-selected hover:text-gray-300"
        >
          <Icon size="20px" name="mdi:microphone" />
        </button>
        <button
          class="grid h-8 w-8 place-items-center rounded text-gray-400 hover:bg-modifier-selected hover:text-gray-300"
        >
          <Icon size="20px" name="mdi:volume-high" />
        </button>
        <DropdownMenuRoot>
          <DropdownMenuTrigger
            class="grid h-8 w-8 place-items-center rounded text-gray-400 hover:bg-modifier-selected hover:text-gray-300"
            aria-label="settings"
          >
            <Icon size="20px" name="mdi:cog" />
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent
              class="min-w-[220px] rounded bg-black px-2 py-1.5 text-gray-100"
            >
              <DropdownMenuItem
                class="flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 hover:bg-brand-560 hover:text-white"
                @click="authStore.logout"
              >
                <span>Logout</span>
                <Icon name="mdi:exit-run" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenuRoot>
      </div>
    </div>
  </section>
</template>
