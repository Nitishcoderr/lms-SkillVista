import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './Pages/HomePage';
import AboutUs from './Pages/AboutUs';
import NotFound from './Pages/NotFound';
import SignUp from './Pages/SignUp';

function App() {
  return (
    <>
      <Routes>
        <Route exact path='/' element={<HomePage/>} />
        <Route exact path='/about' element={<AboutUs/>} />
        <Route exact path='/signup' element={<SignUp/>} />
        <Route  path='*' element={<NotFound/>} />
      </Routes>
    </>
  );
}

export default App;
