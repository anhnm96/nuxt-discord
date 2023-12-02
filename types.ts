export interface Server {
  id: string
  label: string
  img: string
  categories: Category[]
}

export interface Category {
  id: string
  label: string
  channels: Channel[]
}

export interface Channel {
  id: string
  label: string
  icon?: string
  unread?: boolean
  description?: string
  messages: Message[]
}

export interface Message {
  id: string
  user: string
  avatarUrl: string
  date: string
  text: string
}
