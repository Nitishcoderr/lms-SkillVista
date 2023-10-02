import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomeLayout from './Layouts/HomeLayout';
import HomePage from './Pages/HomePage';

function App() {
  return (
    <>
      <Routes>
        <Route exact path='/' element={<HomePage/>} />
      </Routes>
    </>
  );
}

export default App;
