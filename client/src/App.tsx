import { useState } from 'react'
import JoinForm from './components/JoinForm/JoinForm'
import Room from './components/Room/Room'
import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'
import './App.css'

function App() {
  const [currentRoom, setCurrentRoom] = useState<string | null>(null)

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        {!currentRoom ? (
          <JoinForm onJoin={setCurrentRoom} />
        ) : (
          <Room roomName={currentRoom} onLeave={() => setCurrentRoom(null)} />
        )}
      </main>
      <Footer />
    </div>
  )
}

export default App
