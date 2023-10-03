import React, { useState } from 'react';
import HomeLayout from '../Layouts/HomeLayout';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { login } from '../Redux/Slices/AuthSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  function handleUserInput(e) {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  }


  async function onLogin(event) {
    event.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error('All details required');
      return;
    }

    // Dispatch create account action
    const response = await dispatch(login(loginData));
    if (response.payload.success) navigate('/');
    setLoginData({
      email: '',
      password: '',
    });
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-[100vh]">
        <form
          onSubmit={onLogin}
          noValidate
          className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black]">
          <h1 className="text-center text-2xl font-bold">Login Page</h1>
         
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="font-semibold">
              Email
            </label>
            <input
              type="email"
              required
              name="email"
              id="email"
              placeholder="Enter your email..."
              className="bg-transparent px-2 my-1 border outline-none"
              onChange={handleUserInput}
              value={loginData.email}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="font-semibold">
              Password
            </label>
            <input
              type="password"
              required
              name="password"
              id="password"
              placeholder="Enter your Password..."
              className="bg-transparent px-2 my-1 border outline-none"
              onChange={handleUserInput}
              value={loginData.password}
            />
          </div>
          <button
            type="submit"
            className=" bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded py-2 font-semibold text-lg cursor-pointer mt-2">
            Login
          </button>
          <p className="text-center">
            Do not have an account ?{' '}
            <Link
              to="/signup"
              className="link text-accent cursor-pointer">
              Sign up
            </Link>{' '}
          </p>
        </form>
      </div>
    </HomeLayout>
  );
};

export default Login;
