import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Home from './pages/Home';
import Leaderboard from './pages/Leaderboard';
import LBarchive from './pages/LBarchive';
import Projects from './pages/Projects';
import { UserProvider } from './context/UserProvider';
import { OBProvider } from './context/OBProvider';
import { ProjectsProvider } from './context/ProjectsProvider';
import NewUser from './pages/NewUser';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OBarchive from './pages/OBarchive';
import ProjArchive from './pages/ProjArchive';
import CalendarPage from './pages/Calendar';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <UserProvider>
          <OBProvider>
            <ProjectsProvider>
              <Routes>

                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="leaderboard" element={<Leaderboard />} />
                <Route path="projects" element={<Projects />} />
                <Route path="newuser" element={<NewUser />} />
                <Route path="leaderboard/archive" element={<LBarchive />} />
                <Route path="/archive" element={<OBarchive />} />
                <Route path="/projects/archive" element={<ProjArchive />} />
                <Route path="/calendar" element={<CalendarPage />} />

              </Routes>
            </ProjectsProvider>
          </OBProvider>
        </UserProvider>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover={false}
        theme="light"
        transition:Slide
      />

    </>
  )
}

export default App
