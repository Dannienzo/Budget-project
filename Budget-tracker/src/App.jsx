import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { BudgetProvider } from './Components/Context/Context';
import {ToastContainer} from 'react-toastify'
import Navbar from './Components/Navbarfiles/Navbar';
import Footer from './Components/Footerfiles/Footer';
import Home from './Components/Pages/Home'
import About from './Components/Pages/About'
import Contact from './Components/Pages/Contact'
import Blog from './Components/Pages/Blog'
import Budgeting from './Components/Pages/Budgeting'
import Dashboard from './Components/Pages/Dashboard'
import Expenses from './Components/Pages/Expenses'
import Login from './Components/Pages/Login'
import Signup from './Components/Pages/Signup'
import Settings from './Components/Pages/Settings'


function App() {
  return(
    <> 

  <BudgetProvider>
    <Router>
      <Navbar/>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/blog' element={<Blog />} />
          <Route path='/budgeting' element={<Budgeting />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/expenses' element={<Expenses />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/settings' element={<Settings />} />

        </Routes>  
          <ToastContainer position='top-right' autoClose={3000} />
        <Footer/>
    </Router>
  </BudgetProvider>
    
    </>
  );
}

export default App
