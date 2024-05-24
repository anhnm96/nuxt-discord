import type {
  Category,
  Channel,
  ChannelType as ChannelTypeOrigin,
  Member,
  MemberRole as MemberRoleOrigin,
  Message,
  Profile,
  Server,
} from '@prisma/client'

// re-export enum types from prisma
// due to https://github.com/prisma/prisma/issues/12504
export const MemberRole: { [k in MemberRoleOrigin]: k } = {
  ADMIN: 'ADMIN',
  MODERATOR: 'MODERATOR',
  GUEST: 'GUEST',
}
export type MemberRoleEnum = (typeof MemberRole)[keyof typeof MemberRole]

export const ChannelType: { [k in ChannelTypeOrigin]: k } = {
  TEXT: 'TEXT',
  AUDIO: 'AUDIO',
  VIDEO: 'VIDEO',
}
export type ChannelTypeEnum = (typeof ChannelType)[keyof typeof ChannelType]

export interface ActiveUserData {
  /**
   * The "subject" of the token.
   * The value of this property is the user ID
   * that granted this token
   */
  sub: number

  /**
   * The subject's (user) email
   */
  email: string
}

export type CategoryWithChannels = Category & { channels: Channel[] }
export interface ServerWithDetails extends Server {
  categories: CategoryWithChannels[]
  members: MemberWithProfile[]
}

export type MemberWithProfile = Member & { profile: Profile }

export type MessageWithMember = Message & { member: MemberWithProfile }

export type ChannelWithDetails = Channel & {
  profile: Profile
  category: Category
}
