import { Route, Routes } from "react-router"
import Home from "./pages/Home"
import Login from "./pages/login"
import Signup from "./pages/Signup"
import Nav from "./components/Nav"
import Profile from "./pages/Profile"
import Posts from "./pages/Posts"
import { useAuth } from "./context/AuthContext"
import Users from "./pages/users"

function App() {
  const { user } = useAuth();

  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={user ? <Profile /> : <Login />} />
        <Route path="/posts" element={user ? <Posts /> : <Login />} />
        <Route path="/users" element={user ? <Users /> : <Login />} />
      </Routes>
    </>
  )
}

export default App
