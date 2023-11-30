<template>
  <div class="flex h-screen text-gray-100">
    <div class="space-y-2 overflow-y-scroll bg-gray-900 p-3">
      <a
        :class="[
          $route.path === '/'
            ? 'bg-brand rounded-2xl text-white'
            : 'hover:bg-brand rounded-3xl bg-gray-700 text-gray-100 hover:rounded-2xl hover:text-white',
        ]"
        class="flex h-12 w-12 items-center justify-center transition-all duration-200"
      >
        <svg class="h-5 w-7" aria-hidden="false" viewBox="0 0 28 20">
          <path
            fill="currentColor"
            d="M23.021 1.677A21.227 21.227 0 0017.658 0c-.252.462-.483.935-.687 1.418a19.931 19.931 0 00-5.943 0C10.82.935 10.59.462 10.337.005c-1.856.32-3.659.88-5.37 1.677C1.567 6.78.65 11.754 1.111 16.652A21.504 21.504 0 007.691 20c.532-.726 1.004-1.5 1.407-2.309a13.582 13.582 0 01-2.221-1.078c.188-.137.37-.274.547-.428a15.232 15.232 0 0013.152 0c.177.148.36.291.541.428-.707.424-1.453.787-2.22 1.078.408.808.875 1.578 1.405 2.303a21.5 21.5 0 006.58-3.347h.007c.541-5.674-.922-10.6-3.868-14.97zM9.681 13.638c-1.283 0-2.34-1.193-2.34-2.644S8.37 8.35 9.68 8.35c1.308 0 2.359 1.193 2.338 2.644 0 1.451-1.036 2.644-2.339 2.644zm8.635 0c-1.283 0-2.34-1.193-2.34-2.644s1.036-2.644 2.34-2.644c1.302 0 2.36 1.193 2.338 2.644 0 1.451-1.036 2.644-2.338 2.644z"
          />
        </svg>
      </a>
      <a
        class="hover:bg-brand flex h-12 w-12 items-center justify-center rounded-3xl bg-gray-700 text-gray-100 transition-all duration-200 hover:rounded-2xl hover:text-white"
      >
        S1
      </a>
    </div>

    <div class="flex w-60 flex-col bg-gray-800">
      <div
        class="font-title flex h-12 items-center px-3 font-semibold text-white shadow-md"
      >
        Tailwind CSS
      </div>
      <div
        class="flex-1 space-y-2 overflow-y-scroll p-3 font-medium text-gray-300"
      >
        <p class="text-white">general</p>
        <p v-for="(_, i) in [...Array(40)]" :key="i">channel {{ i }}</p>
      </div>
    </div>

    <div class="flex flex-1 flex-col bg-gray-700">
      <div class="flex h-12 items-center px-3 shadow-md">general</div>
      <div class="flex-1 space-y-4 overflow-y-scroll p-3">
        <p v-for="(_, i) in [...Array(40)]" :key="i">
          Message {{ i }}. Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Vel saepe laudantium sed reprehenderit incidunt! Hic rem quos
          reiciendis, fugit quae ratione beatae veniam laborum voluptatem, iusto
          dolorum, voluptates suscipit quia.
        </p>
      </div>
    </div>
  </div>
</template>
