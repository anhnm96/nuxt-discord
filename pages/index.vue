<template>
  <div class="flex h-screen text-gray-100">
    <div class="space-y-2 overflow-y-scroll bg-gray-900 p-3">
      <div
        v-for="(_, i) in [...Array(40)]"
        :key="i"
        class="flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-800"
      >
        {{ i }}
      </div>
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
