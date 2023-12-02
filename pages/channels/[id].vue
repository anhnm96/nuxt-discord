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
    <!-- channel list -->
    <div class="mt-[17px] flex-1 overflow-y-scroll font-medium text-gray-300">
      <div class="space-y-0.5">
        <a
          href="#"
          class="hover:bg-gray-550/[0.16] group mx-2 flex items-center rounded px-2 py-1 text-gray-300 hover:text-gray-100"
        >
          <Icon
            class="mr-1.5 text-gray-400"
            size="20px"
            name="ic:baseline-library-books"
          />
          welcome
          <Icon
            class="ml-auto text-gray-200 opacity-0 hover:text-gray-100 group-hover:opacity-100"
            size="16px"
            name="material-symbols:person-add"
          />
        </a>
        <a
          href="#"
          class="hover:bg-gray-550/[0.16] group mx-2 flex items-center rounded px-2 py-1 text-gray-300 hover:text-gray-100"
        >
          <Icon
            class="mr-1.5 text-gray-400"
            size="20px"
            name="heroicons-solid:speakerphone"
          />
          announcements
          <Icon
            class="ml-auto text-gray-200 opacity-0 hover:text-gray-100 group-hover:opacity-100"
            size="16px"
            name="material-symbols:person-add"
          />
        </a>
      </div>
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
