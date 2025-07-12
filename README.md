# TodoList App

A modern, full-stack todo application built with Next.js, MongoDB, and Tailwind CSS featuring a beautiful dark theme with purple accents.

## ✨ Features

- **Full CRUD Operations**: Create, Read, Update, and Delete todos
- **MongoDB Integration**: Persistent data storage with MongoDB Atlas
- **Dark Theme**: Beautiful dark mode with purple color scheme
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Real-time Updates**: Instant feedback for all operations
- **Modern UI**: Clean and intuitive user interface
- **No Authentication Required**: Simple and straightforward usage

## 🚀 Tech Stack

- **Frontend**: Next.js 13, React 18, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas
- **Styling**: Tailwind CSS with custom dark theme

## 🎨 Design Features

- **Dark/Light Mode Toggle**: Switch between themes with a single click
- **Purple Color Scheme**: Beautiful purple gradients and accents
- **Smooth Transitions**: Elegant animations and hover effects
- **Modern Cards**: Clean card-based layout for todos
- **Responsive Grid**: Adaptive layout for different screen sizes

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ToDo
```

2. Install dependencies:
```bash
npm install
```

3. Set up MongoDB:
   - The app is configured to use MongoDB Atlas
   - Connection string is already set up in `lib/mongodb.js`

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🗄️ Database Schema

The todos collection in MongoDB has the following structure:

```javascript
{
  _id: ObjectId,
  title: String,
  desc: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 API Endpoints

- `GET /api/todos` - Fetch all todos
- `POST /api/todos` - Create a new todo
- `GET /api/todos/[id]` - Fetch a specific todo
- `PUT /api/todos/[id]` - Update a todo
- `DELETE /api/todos/[id]` - Delete a todo

## 🎯 Usage

1. **Adding Todos**: Navigate to the home page and fill in the title and description
2. **Viewing Todos**: Click "My Todos" in the navigation to see all your todos
3. **Editing Todos**: Click the edit icon on any todo card
4. **Deleting Todos**: Click the delete icon on any todo card
5. **Toggle Theme**: Use the sun/moon icon in the header to switch themes

## 🌟 Key Improvements

- **MongoDB Integration**: Replaced localStorage with MongoDB for persistent data storage
- **Dark Theme**: Added comprehensive dark mode support with purple accents
- **Better UX**: Improved loading states, error handling, and user feedback
- **Modern Styling**: Updated all components with modern Tailwind CSS classes
- **Responsive Design**: Enhanced mobile responsiveness
- **API Routes**: Implemented proper REST API endpoints
- **Error Handling**: Added comprehensive error handling and user feedback

## 📱 Screenshots

The app features:
- Clean, modern interface
- Dark/light theme toggle
- Purple gradient accents
- Responsive card layout
- Smooth animations

## 🔮 Future Enhancements

- Todo categories/tags
- Due dates and reminders
- Search functionality
- Todo completion status
- Bulk operations
- Export/import functionality

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using Next.js, MongoDB, and Tailwind CSS
