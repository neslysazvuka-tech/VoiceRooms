import WebSocket from 'ws'
import { Room } from '../models/Room'

const rooms = new Map<string, Room>()

export const setupWebSocket = (server: any) => {
  const wss = new WebSocket.Server({ server })

  wss.on('connection', (ws, req) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`)
    const roomName = url.searchParams.get('room') || ''
    const userId = `user-${Date.now()}`

    if (!roomName) {
      ws.close()
      return
    }

    // Получаем или создаем комнату
    let room = rooms.get(roomName)
    if (!room) {
      room = new Room(roomName)
      rooms.set(roomName, room)
    }

    // Проверяем количество пользователей
    if (room.users.size >= 2) {
      ws.send(JSON.stringify({ type: 'room_full' }))
      ws.close()
      return
    }

    // Добавляем пользователя
    room.addUser(userId, ws)
    ws.userId = userId
    ws.roomName = roomName

    // Отправляем историю сообщений
    ws.send(JSON.stringify({
      type: 'init',
      messages: room.messages
    }))

    // Обработка сообщений
    ws.on('message', (data) => {
      const message = JSON.parse(data.toString())
      handleMessage(room!, userId, message)
    })

    // Очистка при отключении
    ws.on('close', () => {
      room?.removeUser(userId)
      if (room?.users.size === 0) {
        rooms.delete(roomName)
      }
    })
  })
}

const handleMessage = (room: Room, userId: string, message: any) => {
  switch (message.type) {
    case 'new_message':
      const newMessage = {
        ...message,
        timestamp: new Date(),
        userId
      }
      room.addMessage(newMessage)
      broadcast(room, {
        type: 'new_message',
        message: newMessage
      })
      break

    case 'clear_messages':
      room.clearMessages()
      broadcast(room, {
        type: 'messages_cleared'
      })
      break
  }
}

const broadcast = (room: Room, message: any) => {
  room.users.forEach(userWs => {
    if (userWs.readyState === WebSocket.OPEN) {
      userWs.send(JSON.stringify(message))
    }
  })
}
