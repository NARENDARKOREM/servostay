import React, { useState } from 'react';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import api from '../utils/api';

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordType, setPasswordType] = useState('password');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
    setPasswordType(passwordVisible ? 'password' : 'text');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        "/admin/login",
        formData,
      );
      console.log(response.data)
      NotificationManager.success("Admin logged in successfully!");
      
      setTimeout(() => {

        navigate("/dashboard");
      }, 2000);

    } catch (err) {
      NotificationManager.error(err.response?.data?.error || "Something went wrong!");
    }
  };

  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Side */}
      <div
        className="h-full flex flex-col items-center justify-center"
        style={{ background: 'linear-gradient(141.69deg, #25064C 0%, rgba(32, 40, 59, 0.6) 100%)' }}
      >
        <div>
          <img src="/image/logo frame.svg" alt="" className="w-[337px] h-[291px]" />
        </div>
        <div className="text-center gap-5">
          <span className="dentify-logoName" style={{ letterSpacing: '0.1rem' }}>
            RENTAL
          </span>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center justify-center bg-white p-6">
        <div
          className="w-full max-w-md bg-white rounded-xl p-8"
          style={{
            boxShadow: `0px 2px 5px 0px #0000001A, 0px 10px 10px 0px #00000017, 0px 22px 13px 0px #0000000D, 0px 39px 15px 0px #00000003, 0px 60px 17px 0px #00000000`,
          }}
        >
          <h2 className="auth-head">Welcome Back</h2>
          <p className="text-[#439BFF] float-left mb-[38px] ml-[5px] mt-[10px] leading-[26px]">
            Please Login to your Account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                onChange={handleChange}
                type="text"
                id="username"
                name="username"
                value={formData.username}
                className="w-full px-3 py-2 border border-[#B0B0B0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#439BFF] placeholder:font-[poppins] placeholder:text-[14px] placeholder:text-[#25064C]"
                placeholder="UserName"
              />
            </div>

            <div className="flex relative">
              <input
                type={passwordType}
                onChange={handleChange}
                id="password"
                name="password"
                value={formData.password}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#439BFF] placeholder:font-[poppins] placeholder:text-[14px] placeholder:text-[#25064C]"
                placeholder="Password"
              />
              <span
                className="mt-2 cursor-pointer absolute right-4 visibilityIcon"
                onClick={handlePasswordVisibility}
              >
                {passwordVisible ? (
                  <VisibilityOutlinedIcon fontSize="30px" />
                ) : (
                  <VisibilityOffOutlinedIcon fontSize="30px" />
                )}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center"></div>
              <div>
                <a href="/forgotpassword" className="text-sm text-[#131313] font-[poppins] fg">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#439BFF] mt-14 font-[poppins]"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
      <NotificationContainer />
    </div>
  );
};

export default Login;
