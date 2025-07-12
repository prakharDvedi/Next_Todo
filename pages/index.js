import { Inter } from 'next/font/google'
import { useState, useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [todo, setTodo] = useState({title: "", desc: ""})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [todos, setTodos] = useState([])
  const [fetching, setFetching] = useState(true)

  // Fetch todos on mount and after add
  const fetchTodos = async () => {
    setFetching(true)
    try {
      const response = await fetch('/api/todos')
      const data = await response.json()
      if (response.ok) {
        setTodos(data)
      }
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const addTodo = async () => { 
    if (!todo.title.trim() || !todo.desc.trim()) {
      setMessage("Please fill in both title and description")
      return
    }
    setLoading(true)
    setMessage("")
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo),
      })
      const data = await response.json()
      if (response.ok) {
        setMessage("Todo has been added successfully!")
        setTodo({title: "", desc: ""})
        fetchTodos()
      } else {
        setMessage(data.error || "Failed to add todo")
      }
    } catch (error) {
      setMessage("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const onChange = (e) => { 
    setTodo({...todo, [e.target.name]: e.target.value})
  }

  const handleDelete = async (id) => {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    // Refresh the todos list after deletion
    fetchTodos(); // or however you reload the list
  };

  const handleEdit = (todo) => {
    // You can open a modal, or navigate to an edit page
    // Example: router.push(`/edit/${todo.title}`)
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex flex-col justify-center">
      <main className="flex flex-1 flex-col md:flex-row gap-8 px-4 py-12 max-w-6xl mx-auto w-full">
        {/* Left: Form */}
        <section className="md:w-1/2 w-full flex flex-col justify-center">
          <div className="card p-8 flex flex-col w-full max-w-md mx-auto md:mx-0">
            <h2 className="text-gray-900 dark:text-white text-lg font-medium title-font mb-5">Add a Todo</h2>
            {message && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                message.includes('successfully') 
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                  : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
              }`}>
                {message}
              </div>
            )}
            <div className="relative mb-4">
              <label htmlFor="title" className="leading-7 text-sm text-gray-600 dark:text-gray-400">Todo Title</label>
              <input 
                onChange={onChange} 
                value={todo.title} 
                type="text" 
                id="title" 
                name="title" 
                className="input-field"
                placeholder="Enter todo title"
              />
            </div>
            <div className="relative mb-4">
              <label htmlFor="desc" className="leading-7 text-sm text-gray-600 dark:text-gray-400">Todo Description</label>
              <textarea 
                onChange={onChange} 
                value={todo.desc} 
                id="desc" 
                name="desc" 
                className="input-field min-h-[100px] resize-none"
                placeholder="Enter todo description"
              />
            </div>
            <button 
              onClick={addTodo} 
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Todo'}
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
              Organize your tasks efficiently with our todo app
            </p>
          </div>
        </section>
        {/* Right: Todos */}
        <section className="md:w-1/2 w-full flex flex-col">
          <h2 className="text-gray-900 dark:text-white text-lg font-medium title-font mb-5">Your Todos</h2>
          {fetching ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
            </div>
          ) : todos.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-400">No todos yet. Add one!</div>
          ) : (
            <div className="grid gap-4">
              {todos.map(item => (
                <div key={item._id} className="card p-4 flex flex-col">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-lg text-gray-900 dark:text-white">{item.title}</div>
                      <div className="text-gray-600 dark:text-gray-300">{item.desc}</div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        className="bg-purple-600 text-white px-3 py-1 rounded"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
