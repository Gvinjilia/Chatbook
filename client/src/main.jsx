import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { PostProvider } from './context/PostsContext.jsx'
import { UsersProvider } from './context/UserContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <PostProvider>
        <UsersProvider>
          <App />
        </UsersProvider>
      </PostProvider>
    </AuthProvider>
  </BrowserRouter>
)
