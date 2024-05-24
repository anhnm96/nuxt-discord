import type { MemberRole } from '@prisma/client'

export function changeRole(
  memberId: string,
  serverId: string,
  role: MemberRole,
) {
  return useNuxtApp().$api(`/members/${memberId}?serverId=${serverId}`, {
    method: 'PATCH',
    body: { role },
  })
}

export function kick(memberId: string, serverId: string) {
  return useNuxtApp().$api(`/members/${memberId}?serverId=${serverId}`, {
    method: 'DELETE',
  })
}
