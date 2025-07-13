import React from 'react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const Edit = () => {
  const router = useRouter()
  const { title: todoId } = router.query

  const [todo, setTodo] = useState({title: "", desc: ""})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    if (router.isReady && todoId) {
      fetchTodo()
    }
  }, [router.isReady, todoId])

  const fetchTodo = async () => {
    try {
      const response = await fetch(`/api/todos/${todoId}`)
      if (response.ok) {
        const data = await response.json()
        setTodo(data)
      } else {
        setMessage('Todo not found')
      }
    } catch (error) {
      setMessage('Failed to fetch todo')
    } finally {
      setInitialLoading(false)
    }
  }

  const updateTodo = async () => { 
    if (!todo.title.trim() || !todo.desc.trim()) {
      setMessage("Please fill in both title and description")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const response = await fetch(`/api/todos/${todoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("Todo has been updated successfully!")
        setTimeout(() => {
          router.push('/')
        }, 1500)
      } else {
        setMessage(data.error || "Failed to update todo")
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

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
        <div className="container mx-auto px-5 py-24">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (message === 'Todo not found' || message === 'Failed to fetch todo') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
        <div className="container mx-auto px-5 py-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Todo Not Found</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{message}</p>
            <button 
              onClick={() => router.push('/')}
              className="btn-primary"
            >
              Back to Todos
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <main className="my-2 text-3xl">
        <section className="text-gray-600 dark:text-gray-300 body-font">
          <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
            <div className="card p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 max-w-md mx-auto">
              <h2 className="text-gray-900 dark:text-white text-lg font-medium title-font mb-5">Update a Todo</h2>
              
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
              <div className="flex space-x-4">
                <button 
                  onClick={updateTodo} 
                  disabled={loading}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : 'Update Todo'}
                </button>
                <button 
                  onClick={() => router.push('/')}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                Update your todo details and save changes
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Edit