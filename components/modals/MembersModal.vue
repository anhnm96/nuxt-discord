<script setup lang="tsx">
import type { MemberRole } from '@prisma/client'
import { useQueryClient } from '@tanstack/vue-query'
import { Icon } from '#components'
import type { ServerWithDetails } from '~/types'
import { changeRole, kick } from '~/handlers/members'

const route = useRoute()
const serverId = route.params.sid as string
const queryClient = useQueryClient()
const server = queryClient.getQueryData<ServerWithDetails>([
  serversKey,
  serverId,
])
if (!server)
  throw createError({ statusCode: 404, statusMessage: 'Server Not Found' })
const loadingId = ref('')

async function handleChangeRole(memberId: string, role: MemberRole) {
  try {
    loadingId.value = memberId
    await changeRole(memberId, serverId, role)
    queryClient.invalidateQueries({ queryKey: [serversKey, serverId] })
  } catch (err) {
    console.error(err)
  } finally {
    loadingId.value = ''
  }
}

async function handleKick(memberId: string) {
  try {
    loadingId.value = memberId
    await kick(memberId, serverId)
    queryClient.invalidateQueries({ queryKey: [serversKey, serverId] })
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
  <DialogRoot>
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogPortal>
      <Transition :duration="200">
        <div>
          <Transition name="fade">
            <DialogOverlay class="fixed inset-0 bg-black/70" />
          </Transition>
          <Transition name="modal">
            <DialogContent
              class="fixed left-1/2 top-1/2 z-50 origin-top-left -translate-x-1/2 -translate-y-1/2"
            >
              <div
                class="mx-auto w-screen max-w-md overflow-hidden rounded bg-gray-700 text-header-secondary"
              >
                <section class="relative border-b border-black p-4">
                  <DialogClose
                    class="absolute right-4 top-4 grid h-8 w-8 place-items-center text-gray-300 transition-colors hover:text-gray-200"
                    aria-label="close"
                  >
                    <Icon name="lucide:x" size="20px" />
                  </DialogClose>
                  <DialogTitle
                    class="text-center text-xl font-bold text-header-primary"
                    >Manage Members</DialogTitle
                  >
                  <DialogDescription class="text-center text-header-secondary">
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
                          class="grid h-8 w-8 select-none place-items-center rounded-full bg-brand"
                        >
                          <AvatarImage
                            :src="member.profile.imageUrl || ''"
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
                                class="min-w-[220px] rounded bg-black px-2 py-1.5 text-header-secondary"
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
                                      class="min-w-[220px] rounded bg-black px-2 py-1.5 text-header-secondary"
                                    >
                                      <DropdownMenuItem
                                        class="flex cursor-pointer items-center rounded-sm px-2 py-1.5 hover:bg-brand-560 hover:text-white"
                                        @click="
                                          handleChangeRole(member.id, 'GUEST')
                                        "
                                      >
                                        <Icon
                                          class="mr-2"
                                          name="lucide:shield"
                                        />
                                        Guest
                                        <Icon
                                          v-if="member.role === 'GUEST'"
                                          class="ml-auto"
                                          name="lucide:check"
                                        />
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        class="flex cursor-pointer items-center rounded-sm px-2 py-1.5 hover:bg-brand-560 hover:text-white"
                                        @click="
                                          handleChangeRole(
                                            member.id,
                                            'MODERATOR',
                                          )
                                        "
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
                                  @click="handleKick(member.id)"
                                >
                                  <Icon class="mr-2" name="lucide:gavel" />
                                  <span>handleKick</span>
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
          </Transition>
        </div>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>
