<template>
  <div
    class="flex min-h-screen items-center justify-center bg-gray-700 text-white"
  >
    <div class="max-w-lg">
      <div class="flex px-4 py-1 hover:bg-gray-800 hover:bg-opacity-30">
        <img
          class="mr-4 h-10 w-10 rounded-full"
          src="/adamwathan.jpeg"
          alt=""
        />
        <div>
          <p class="flex items-baseline">
            <span class="mr-2 text-sm font-medium text-green-500">
              adamwathan
            </span>
            <span class="text-xs text-gray-500">01/15/2021</span>
          </p>
          <p class="text-gray-300">
            You should never use something like leading relaxed with a big font
            size, it goes against all typography best practices. Line height
            should decrease as font size gets bigger
          </p>
        </div>
      </div>
      <div class="mt-1 px-4 py-1 hover:bg-gray-800 hover:bg-opacity-30">
        <p class="pl-14 text-gray-300">
          You can override it in your config if you want but ultimately we chose
          the defaults they did because they let you get results closest to what
          a professional designer would do more easily
        </p>
      </div>
      <div class="mt-1 px-4 py-1 hover:bg-gray-800 hover:bg-opacity-30">
        <p class="pl-14 text-gray-300">
          Since we changed this in tailwind 2 I’ve almost never used a leading
          class at all
        </p>
      </div>
    </div>
  </div>
</template>
