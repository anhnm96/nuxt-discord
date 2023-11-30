<template>
  <div class="flex h-screen text-white">
    <div class="space-y-2 overflow-y-scroll bg-gray-800 p-3">
      <div
        v-for="(_, i) in [...Array(40)]"
        :key="i"
        class="flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-800"
      >
        {{ i }}
      </div>
    </div>

    <div class="flex w-60 flex-col bg-gray-700">
      <div class="flex h-12 items-center px-3 shadow-md">Tailwind CSS</div>
      <div class="flex-1 space-y-2 overflow-y-scroll p-3">
        <p v-for="(_, i) in [...Array(40)]" :key="i">channel {i}</p>
      </div>
    </div>

    <div class="flex flex-1 flex-col bg-gray-600">
      <div class="flex h-12 items-center px-3 shadow-md">general</div>
      <div class="flex-1 space-y-4 overflow-y-scroll p-3">
        <p v-for="(_, i) in [...Array(40)]" :key="i">
          Message {i}. Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Vel saepe laudantium sed reprehenderit incidunt! Hic rem quos
          reiciendis, fugit quae ratione beatae veniam laborum voluptatem, iusto
          dolorum, voluptates suscipit quia.
        </p>
      </div>
    </div>
  </div>
</template>
