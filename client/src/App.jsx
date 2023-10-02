import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './Pages/HomePage';
import AboutUs from './Pages/AboutUs';

function App() {
  return (
    <>
      <Routes>
        <Route exact path='/' element={<HomePage/>} />
        <Route exact path='/about' element={<AboutUs/>} />
      </Routes>
    </>
  );
}

export default App;
