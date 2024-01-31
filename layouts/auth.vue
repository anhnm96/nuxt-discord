<template>
  <div class="relative h-screen w-screen">
    <img
      draggable="false"
      class="h-full w-full"
      src="~/assets/bg-auth.svg"
      aria-hidden
    />
    <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <Transition name="bounce" appear mode="out-in">
        <div :key="$route.path" class="w-[480px] rounded-md bg-gray-700 p-8">
          <slot />
        </div>
      </Transition>
    </div>
  </div>
</template>

<style>
.bounce-enter-from,
.bounce-leave-to {
  opacity: 0;
  transform: scale(1.05) translateY(-70px) translateZ(0px);
}

.bounce-enter-to,
.bounce-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0px) translateZ(0px);
}

.bounce-enter-active {
  transition: all 0.25s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.bounce-leave-active {
  transition: all 0.2s ease-in;
}
</style>
