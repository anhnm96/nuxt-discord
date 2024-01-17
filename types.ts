import type { Category, Channel, Member, Server } from '@prisma/client'

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
  members: Member[]
}
