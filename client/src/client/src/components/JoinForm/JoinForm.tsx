import { useState } from 'react'
import './JoinForm.css'

interface JoinFormProps {
  onJoin: (roomName: string) => void
}

export default function JoinForm({ onJoin }: JoinFormProps) {
  const [roomName, setRoomName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!roomName.trim()) {
      setError('Введите название комнаты')
      return
    }
    onJoin(roomName.trim())
  }

  return (
    <form className="join-form" onSubmit={handleSubmit}>
      <h2>Присоединиться к комнате</h2>
      <div className="form-group">
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Название комнаты"
          aria-label="Название комнаты"
        />
        {error && <p className="error-message">{error}</p>}
      </div>
      <button type="submit" className="primary-button">
        Войти
      </button>
    </form>
  )
                    }
