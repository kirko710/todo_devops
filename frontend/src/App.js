import { useState, useEffect } from 'react'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/todos'

function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      if (Array.isArray(data)) {
        setTodos(data)
      } else {
        setTodos([])
        setError('Failed to load todos')
      }
    } catch (err) {
      setError(err.message)
      setTodos([])
    }
  }

  const addTodo = async () => {
    if (!title.trim()) return
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })
    setTitle('')
    fetchTodos()
  }

  const toggleTodo = async (todo) => {
    await fetch(`${API_URL}/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: todo.title, completed: !todo.completed }),
    })
    fetchTodos()
  }

  const deleteTodo = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    fetchTodos()
  }

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', fontFamily: 'Arial' }}>
      <h1>📝 Todo App</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Tambah todo baru..."
          style={{ flex: 1, padding: '8px', fontSize: '16px' }}
        />
        <button onClick={addTodo} style={{ padding: '8px 16px' }}>
          Tambah
        </button>
      </div>

      {todos.length === 0 ? (
        <p style={{ color: 'gray' }}>Belum ada todo. Tambah sekarang!</p>
      ) : (
        todos.map((todo) => (
          <div
            key={todo.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px',
              marginBottom: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo)}
            />
            <span
              style={{
                flex: 1,
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? 'gray' : 'black',
              }}
            >
              {todo.title}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              style={{ color: 'red', border: 'none', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
        ))
      )}
    </div>
  )
}

export default App
