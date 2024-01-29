import { format } from 'date-fns'

export function getTime(date: any) {
  return format(new Date(date), 'd MMM yyyy, HH:mm')
}

export function getShortenedTime(date: any) {
  return format(new Date(date), 'HH:mm')
}
