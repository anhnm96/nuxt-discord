import type { MemberRoleEnum } from '@/types'

export function changeRole(
  memberId: string,
  serverId: string,
  role: MemberRoleEnum,
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
