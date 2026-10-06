import { Route, Routes } from 'react-router-dom'
import './App.css'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import { ProtectedRoute } from './components/ProtectedRoute'
import CreatePost from './pages/CreatePost'
import { Toaster } from 'react-hot-toast'
import GlobalFeed from './pages/GlobalFeed'
import UpdatePost from './pages/UpdatePost'
import SinglePage from './pages/SinglePost'
import SingleUpdatePost from './pages/SingleUpdatePost'
import Profile from './pages/Profile'
import EditProfile from './pages/UpdateProfile'
import VerifyEmail from './pages/VerifyEmail'
import ResendToken from './pages/ResendToken'

function App() {

  return (
    <>
    <Toaster />
    <Navbar />
    <Routes>
      <Route path='/register' element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path='/post' element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
      <Route path='/global/feed' element={<ProtectedRoute><GlobalFeed /></ProtectedRoute>} />
      <Route path='/single/page/:id' element={<ProtectedRoute><SinglePage /></ProtectedRoute>} />
      <Route path='/single/post/:id' element={<ProtectedRoute><SingleUpdatePost /></ProtectedRoute>} />
      <Route path='/profile/:id' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path='/profile' element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
      <Route path='/verify-email/:token' element={<VerifyEmail />} />
      <Route path='/resend-verification-token' element={<ResendToken />} />
      <Route path='/post/update/:id' element={<UpdatePost />} />
    </Routes>
    </>
  )
}

export default App
