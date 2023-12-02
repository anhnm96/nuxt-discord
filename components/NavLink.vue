<template>
  <NuxtLink v-slot="{ route }" class="group relative block">
    <div class="absolute -left-3 flex h-full items-center">
      <div
        :class="[
          route.params.sid === $route.params.sid
            ? 'h-10'
            : 'h-5 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100',
        ]"
        class="w-1 origin-left rounded-r bg-white transition-all duration-200"
      ></div>
    </div>

    <div class="group-active:translate-y-px">
      <div
        :class="[
          route.params.sid === $route.params.sid
            ? 'rounded-2xl bg-brand text-white'
            : 'rounded-3xl bg-gray-700 text-gray-100 group-hover:rounded-2xl group-hover:bg-brand group-hover:text-white',
        ]"
        class="flex h-12 w-12 items-center justify-center overflow-hidden transition-all duration-200"
      >
        <slot />
      </div>
    </div>
  </NuxtLink>
</template>
