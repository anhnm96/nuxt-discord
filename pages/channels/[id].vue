<template>
  <div class="flex w-60 flex-col bg-gray-800">
    <button
      class="hover:bg-gray-550/[0.16] flex h-12 items-center px-4 font-title text-[15px] font-semibold text-white shadow-sm transition"
    >
      <div class="mr-2 flex items-center">
        <Icon size="16px" name="material-symbols:verified-rounded" />
      </div>
      Tailwind CSS
      <Icon class="ml-auto" size="18px" name="carbon:chevron-down" />
    </button>
    <div
      class="flex-1 space-y-2 overflow-y-scroll p-3 font-medium text-gray-300"
    >
      <p class="text-white">general</p>
      <p v-for="(_, i) in [...Array(40)]" :key="i">channel {{ i }}</p>
    </div>
  </div>

  <div class="flex flex-1 flex-col bg-gray-700">
    <div class="flex h-12 items-center px-3 shadow-sm">general</div>
    <div class="flex-1 space-y-4 overflow-y-scroll p-3">
      <p v-for="(_, i) in [...Array(40)]" :key="i">
        Message {{ i }}. Lorem ipsum dolor sit amet consectetur adipisicing
        elit. Vel saepe laudantium sed reprehenderit incidunt! Hic rem quos
        reiciendis, fugit quae ratione beatae veniam laborum voluptatem, iusto
        dolorum, voluptates suscipit quia.
      </p>
    </div>
  </div>
</template>
