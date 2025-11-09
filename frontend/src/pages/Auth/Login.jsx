import React, { useContext, useState } from 'react'
import { Await, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../Utils/helper';
import axiosInstance from "../../Utils/axiosInstance"
import { API_PATHS } from '../../Utils/apiPaths';
import {UserContext} from "../../Context/UserContext"

const Login = ({setCurrentPage}) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const {updateUser} = useContext(UserContext)

  const handleLogin = async (e) => {
  e.preventDefault();

  const emailError = validateEmail(email);
  if (emailError) {
    setError(emailError);
    return;
  }

  if (!password) {
    setError("Please enter the password");
    return;
  }

  setError("");

  try {
    const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
      email,
      password,
    });

    const { token } = response.data;

    if (token) {
      localStorage.setItem("token", token);
      updateUser(response.data)
      navigate("/dashboard");
    }
  } catch (error) {
    if (error.response && error.response.data.message) {
      setError(error.response.data.message);
    } else {
      setError("Something went wrong, please try again");
    }
  }
};


  return (
    <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center'>
      <h3 className='text-lg font-semibold text-black'>Welcome back</h3>
      <p className='text-xs text-slate-700 mt-[5px] mb-6'>
        Please enter your details to log in
      </p>

      <form onSubmit={handleLogin}>
        <Input
        value = {email}
        onChange = {({target}) => setEmail(target.value)}
        label = "Email Adresss"
        placeholder = "za@gmail.com"
        type = "text"
        />

        <Input
        value = {password}
        onChange = {({target}) => setPassword(target.value)}
        label = "password"
        placeholder = "Min 8 Charcters"
        type = "text"
        />

        
        {error && (
  <p className="text-orange-600 text-sm font-medium mb-3 bg-orange-50 border border-orange-200 rounded-lg py-2 px-3">
    {error}
  </p>
)}

<button
  type="submit"
  className="w-full bg-black text-white font-semibold py-2.5 rounded-lg hover:bg-orange-600 transition-all duration-200"
>
  LOGIN
</button>

<p className="text-sm text-slate-700 mt-5 text-center">
  Don’t have an account?{" "}
  <button
    type="button"
    className="font-semibold text-orange-500 hover:text-orange-600 hover:underline transition-all"
    onClick={() => setCurrentPage("signup")}
  >
    Sign up
  </button>
</p>

      </form>
    </div>
  )
}

export default Login