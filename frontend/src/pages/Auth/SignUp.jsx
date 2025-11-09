

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import { validateEmail } from "../../Utils/helper";
import axiosInstance from "../../Utils/axiosInstance";
import { API_PATHS } from "../../Utils/apiPaths";
import { UserContext } from "../../Context/UserContext";
import toast from "react-hot-toast"; 

const SignUp = ({ setCurrentPage }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  // handle signup form
  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!fullName) {
      setError("Please enter full name");
      return;
    }

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
      const formData = new FormData();
      formData.append("name", fullName);
      formData.append("email", email);
      formData.append("password", password);
      if (profilePic) {
        formData.append("profileImage", profilePic);
      }

    
      const loadingToast = toast.loading("Creating your account...");

      const response = await axiosInstance.post(
        API_PATHS.AUTH.REGISTER,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

     
      updateUser(response.data);

     
      toast.success("Account created successfully!", { id: loadingToast });

     
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Something went wrong, please try again"
      );
    }
  };

  return (
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-black">Create an Account</h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-6">
        Join us today by entering your details below.
      </p>

      <form onSubmit={handleSignUp}>
        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

        <Input
          value={fullName}
          onChange={({ target }) => setFullName(target.value)}
          label="Full Name"
          placeholder="zaied"
          type="text"
        />

        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label="Email Address"
          placeholder="za@gmail.com"
          type="text"
        />

        <Input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          label="Password"
          placeholder="Min 8 characters"
          type="password"
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
          SIGN UP
        </button>

        <p className="text-sm text-slate-700 mt-5 text-center">
          Already have an account?{" "}
          <button
            type="button"
            className="font-semibold text-orange-500 hover:text-orange-600 hover:underline transition-all"
            onClick={() => setCurrentPage("login")}
          >
            Log in
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
