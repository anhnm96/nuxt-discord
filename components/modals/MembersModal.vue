<script setup lang="tsx">
import type { MemberRole } from '@prisma/client'
import { Icon } from '#components'

const { $api } = useNuxtApp()
const route = useRoute()
const { data: server } = useNuxtData(`server-${route.params.sid}`)
const loadingId = ref('')

async function changeRole(memberId: string, role: MemberRole) {
  try {
    loadingId.value = memberId
    await $api(`/members/${memberId}?serverId=${server.value.id}`, {
      method: 'PATCH',
      body: { role },
    })
    refreshNuxtData(`server-${route.params.sid}`)
  } catch (err) {
    console.error(err)
  } finally {
    loadingId.value = ''
  }
}

async function kick(memberId: string) {
  try {
    loadingId.value = memberId
    await $api(`/members/${memberId}?serverId=${server.value.id}`, {
      method: 'DELETE',
    })
    refreshNuxtData(`server-${route.params.sid}`)
  } catch (err) {
    console.error(err)
  } finally {
    loadingId.value = ''
  }
}

const roleIconMap = {
  GUEST: null,
  MODERATOR: (
    <Icon class="ml-2 h-4 w-4 text-indigo-500" name="lucide:shield-check" />
  ),
  ADMIN: <Icon class="h-4 w-4 text-rose-500" name="lucide:shield-alert" />,
}
</script>

<template>
  <DialogRoot id="members-modal">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 bg-black/80" />
      <DialogContent
        class="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2"
      >
        <div
          class="mx-auto w-screen max-w-md overflow-hidden rounded bg-gray-700 text-gray-200"
        >
          <section class="relative border-b border-black p-4">
            <DialogClose
              class="absolute right-4 top-4 grid h-8 w-8 place-items-center text-gray-300 transition-colors hover:text-gray-200"
              aria-label="close"
            >
              <Icon name="lucide:x" size="20px" />
            </DialogClose>
            <DialogTitle class="text-center text-xl font-bold text-gray-200"
              >Manage Members</DialogTitle
            >
            <DialogDescription class="text-center text-zinc-500">
              {{ server?.members?.length }} Members
            </DialogDescription>
          </section>
          <ScrollAreaRoot class="max-h-[420px]">
            <ScrollAreaViewport>
              <div class="space-y-2 p-4">
                <div
                  v-for="member in server.members"
                  :key="member.id"
                  class="flex items-center gap-x-2"
                >
                  <AvatarRoot
                    class="grid h-8 w-8 select-none place-items-center rounded-full bg-brand text-gray-100"
                  >
                    <AvatarImage
                      :src="member.profile.imageUrl"
                      :alt="member.profile.username"
                    />
                    <AvatarFallback>{{
                      member.profile.username.slice(0, 2)
                    }}</AvatarFallback>
                  </AvatarRoot>
                  <div class="flex flex-col">
                    <div
                      class="flex items-center gap-x-1 text-xs font-semibold"
                    >
                      {{ member.profile.username }}
                      <component
                        :is="roleIconMap[member.role as keyof typeof roleIconMap]"
                      />
                    </div>
                    <p class="text-xs text-zinc-500">
                      {{ member.profile.email }}
                    </p>
                  </div>
                  <div
                    v-if="
                      server.profileId !== member.profileId &&
                      loadingId !== member.id
                    "
                    class="ml-auto"
                  >
                    <DropdownMenuRoot>
                      <DropdownMenuTrigger class="inline-flex">
                        <Icon size="16px" name="lucide:more-vertical" />
                      </DropdownMenuTrigger>
                      <DropdownMenuPortal to="[role='dialog']">
                        <DropdownMenuContent
                          side="left"
                          class="min-w-[220px] rounded bg-black px-2 py-1.5 text-gray-100"
                        >
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger
                              class="flex cursor-pointer items-center rounded-sm px-2 py-1.5 hover:bg-brand-560 hover:text-white"
                            >
                              <Icon
                                class="mr-2 h-4 w-4"
                                name="lucide:shield-question"
                              />
                              <span>Role</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal to="[role='dialog']">
                              <DropdownMenuSubContent
                                class="min-w-[220px] rounded bg-black px-2 py-1.5 text-gray-100"
                              >
                                <DropdownMenuItem
                                  class="flex cursor-pointer items-center rounded-sm px-2 py-1.5 hover:bg-brand-560 hover:text-white"
                                  @click="changeRole(member.id, 'GUEST')"
                                >
                                  <Icon class="mr-2" name="lucide:shield" />
                                  Guest
                                  <Icon
                                    v-if="member.role === 'GUEST'"
                                    class="ml-auto"
                                    name="lucide:check"
                                  />
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  class="flex cursor-pointer items-center rounded-sm px-2 py-1.5 hover:bg-brand-560 hover:text-white"
                                  @click="changeRole(member.id, 'MODERATOR')"
                                >
                                  <Icon
                                    class="mr-2"
                                    name="lucide:shield-check"
                                  />
                                  Moderator
                                  <Icon
                                    v-if="member.role === 'MODERATOR'"
                                    class="ml-auto"
                                    name="lucide:check"
                                  />
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator
                            class="my-1 h-px bg-gray-800"
                          />
                          <DropdownMenuItem
                            class="flex cursor-pointer items-center rounded-sm px-2 py-1.5 hover:bg-brand-560 hover:text-white"
                            @click="kick(member.id)"
                          >
                            <Icon class="mr-2" name="lucide:gavel" />
                            <span>Kick</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenuPortal>
                    </DropdownMenuRoot>
                  </div>
                  <Icon
                    v-if="loadingId === member.id"
                    class="ml-auto h-4 w-4 animate-spin"
                    name="lucide:loader-2"
                  />
                </div>
              </div>
            </ScrollAreaViewport>
          </ScrollAreaRoot>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
