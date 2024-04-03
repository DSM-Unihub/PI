import resistLogo from './assets/resist-dark.png'
import home from './assets/icons/home.png'
import NavBar from './components/navBar'
import './App.css'
import { Outlet } from 'react-router-dom'
function App() {
  return (
    <>
      <div className='flex flex-row h-lvh'>
        <NavBar />
        <div>
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default App
