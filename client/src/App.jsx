import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './Pages/HomePage';
import AboutUs from './Pages/AboutUs';
import NotFound from './Pages/NotFound';
import SignUp from './Pages/SignUp';
import Login from './Pages/Login';
import CourseList from './Pages/Course/CourseList';
import Contact from './Pages/Contact';
import Denied from './Pages/Denied';
import CourseDescription from './Pages/Course/CourseDescription';
import RequireAuth from './Component/Auth/RequireAuth';
import CreateCourse from './Pages/Course/CreateCourse';
import Profile from './Pages/User/Profile';
import EditProfile from './Pages/User/EditProfile';
import Checkout from './Pages/Payment/Checkout';

function App() {
  return (
    <>
      <Routes>
        <Route exact path='/' element={<HomePage/>} />
        <Route exact path='/about' element={<AboutUs/>} />
        <Route exact path='/signup' element={<SignUp/>} />
        <Route exact path='/login' element={<Login/>} />
        <Route exact path='/courses' element={<CourseList/>} />
        <Route exact path='/contact' element={<Contact/>} />
        <Route exact path='/denied' element={<Denied/>} />
        <Route exact path='/course/description' element={<CourseDescription/>} />


        {/* Admin */}
        <Route element={<RequireAuth allowedRoles={["ADMIN"]}/>} >
        <Route exact path='/course/create' element={<CreateCourse/>} />
        </Route>
        {/* Admin User */}
        <Route element={<RequireAuth allowedRoles={["ADMIN","USER"]}/>} >
        <Route exact path='/user/profile' element={<Profile/>} />
        <Route exact path='/user/editprofile' element={<EditProfile/>} />
        <Route exact path='/checkout' element={<Checkout/>} />
        </Route>


        <Route  path='*' element={<NotFound/>} />
      </Routes>
    </>
  );
}

export default App;
