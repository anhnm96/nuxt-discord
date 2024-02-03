<template>
  <div class="flex h-screen bg-gray-700 text-gray-100">
    <NavSidebar />
    <slot />
    <CreateChannelModal />
    <Dialog />
  </div>
</template>
