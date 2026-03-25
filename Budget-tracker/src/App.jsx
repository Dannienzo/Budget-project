import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { BudgetProvider } from './Components/Context/Context';
import { ToastContainer } from 'react-toastify';
import Navbar from './Components/Navbarfiles/Navbar';
import Footer from './Components/Footerfiles/Footer';
import Home from './Components/Pages/Home';
import About from './Components/Pages/About';
import Blog from './Components/Pages/Blog';
import Dashboard from './Components/Pages/Dashboard/Dashboard'
import Login from './Components/Login and Register/Login';
import Signup from './Components/Login and Register/Signup';
import Pricing from './Components/Pages/Pricing';
import PrivateRoute from './Components/privateroute';
import { AuthProvider } from './Components/Context/AuthContext';


// ✅ Layout for normal pages
function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <BudgetProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/pricing" element={<Pricing />} />
            </Route>

          
             <Route
              path="/dashboard"
              element={ <PrivateRoute>
              <Dashboard/>
              </PrivateRoute>
            } />

          </Routes>

          <ToastContainer position="top-right" autoClose={3000} />
        </BudgetProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
