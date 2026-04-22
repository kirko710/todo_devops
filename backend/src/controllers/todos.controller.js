const pool = require('../db')

// GET semua todos
const getAllTodos = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM todos ORDER BY created_at DESC'
    )
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// POST buat todo baru
const createTodo = async (req, res) => {
  try {
    const { title } = req.body
    if (!title) {
      return res.status(400).json({ error: 'Title is required' })
    }
    const result = await pool.query(
      'INSERT INTO todos (title, completed) VALUES ($1, $2) RETURNING *',
      [title, false]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// PUT update todo
const updateTodo = async (req, res) => {
  try {
    const { id } = req.params
    const { title, completed } = req.body
    const result = await pool.query(
      'UPDATE todos SET title = $1, completed = $2 WHERE id = $3 RETURNING *',
      [title, completed, id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' })
    }
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// DELETE todo
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      'DELETE FROM todos WHERE id = $1 RETURNING *',
      [id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' })
    }
    res.json({ message: 'Todo deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getAllTodos, createTodo, updateTodo, deleteTodo }
