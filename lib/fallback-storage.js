// Fallback in-memory storage for when MongoDB is not available
class FallbackStorage {
  constructor() {
    this.todos = [];
    this.nextId = 1;
  }

  async getAllTodos() {
    return this.todos;
  }

  async createTodo(todo) {
    const newTodo = {
      _id: this.nextId.toString(),
      ...todo,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.todos.push(newTodo);
    this.nextId++;
    return newTodo;
  }

  async getTodoById(id) {
    return this.todos.find(todo => todo._id === id) || null;
  }

  async updateTodo(id, updates) {
    const index = this.todos.findIndex(todo => todo._id === id);
    if (index === -1) return null;
    
    this.todos[index] = {
      ...this.todos[index],
      ...updates,
      updatedAt: new Date()
    };
    return this.todos[index];
  }

  async deleteTodo(id) {
    const index = this.todos.findIndex(todo => todo._id === id);
    if (index === -1) return false;
    
    this.todos.splice(index, 1);
    return true;
  }

  async findTodoByTitle(title) {
    return this.todos.find(todo => todo.title === title) || null;
  }
}

export default FallbackStorage; 