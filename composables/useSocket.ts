import type { Socket } from 'socket.io-client'
import type { InjectionKey } from 'vue'

interface SocketContext {
  socket: Socket
  isConnected: Ref<boolean>
}

export const socketKey = Symbol('socket') as InjectionKey<SocketContext>

export const useSocket = () => inject(socketKey) as SocketContext
