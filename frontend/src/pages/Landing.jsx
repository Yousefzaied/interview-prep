

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LuSparkles } from "react-icons/lu";

import HERO_IMG from "../assets/hero.png";
import { APP_FEATURES } from "../Utils/data";

import Loging from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import Modal from "../components/Modal";

import { UserContext } from "../Context/UserContext";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);


  console.log("user =>", user)

  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  const handleCTA = () => {
    if (user?.token) {
      navigate("/dashboard");
    } else {
      setOpenAuthModal(true);
      setCurrentPage("login");
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div className="w-full min-h-screen bg-[#fffcef] relative overflow-hidden">
        <div className="w-[500px] h-[500px] bg-amber-200/30 blur-[65px] absolute top-0 left-0 rounded-full" />

        <div className="container mx-auto px-4 pt-6 pb-[200px] relative z-10">
          {/* Header */}
          <header className="flex justify-between items-center mb-16">
            <div className="text-2xl text-black font-bold tracking-wide">
              Interview Prep AI
            </div>

            {/* Conditional rendering based on user */}
            {user?.token ? (
              <div className="flex items-center gap-3 cursor-pointer">
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-black font-medium">{user.name}</span>
              </div>
            ) : (
              <button
                className="bg-gradient-to-r from-[#ff9324] to-[#e99a4b] text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:from-[#e99a4b] hover:to-[#ff9324] border border-transparent transition-all duration-300 cursor-pointer"
                onClick={() => setOpenAuthModal(true)}
              >
                Login / Sign Up
              </button>
            )}
          </header>

          {/* Hero Content */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-10">
            {/* Left Side */}
            <div className="w-full md:w-1/2">
              <div className="flex items-center justify-start mb-3">
                <div className="flex items-center gap-2 text-[13px] text-amber-700 font-semibold bg-amber-100 px-4 py-1 rounded-full border border-amber-300 shadow-sm">
                  <LuSparkles /> AI Powered
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl text-black font-bold mb-6 leading-tight">
                Ace Interviews with <br />
                <span className="text-transparent bg-clip-text bg-[radial-gradient(circle,_#ff9324_0%,_#fcd760_100%)]">
                  AI-Powered
                </span>{" "}
                Learning
              </h1>
            </div>

            {/* Right Side */}
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <p className="text-gray-700 text-base leading-relaxed mb-8">
                Get role-specific questions, expand answers when you need them,
                dive deeper into concepts, and organize everything your way. From
                preparation to mastery — your ultimate interview toolkit is here.
              </p>

              <button
                className="bg-black text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-[#ff9324] hover:text-white transition-all duration-300 w-fit"
                onClick={handleCTA}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="w-full min-h-full relative z-10">
        <section className="flex items-center justify-center -mt-36">
          <img
            src={HERO_IMG}
            alt="Hero Image"
            className="w-[80vw] rounded-lg"
          />
        </section>
      </div>

      {/* Features Section */}
      <div className="w-full min-h-full bg-[#fffcef] mt-10">
        <div className="container mx-auto px-4 pt-10 pb-20">
          <section className="mt-5">
            <h2 className="text-2xl font-medium text-center mb-12">
              Features That Make You Shine
            </h2>

            <div className="flex flex-col items-center gap-8">
              {/* First 3 cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                {APP_FEATURES.slice(0, 3).map((feature) => (
                  <div
                    key={feature.id}
                    className="bg-[#fffef8] p-6 rounded-2xl shadow-x5 hover:shadow-lg shadow-amber-100 transition border border-amber-100"
                  >
                    <h3 className="text-base font-semibold mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>

              {/* Remaining 2 cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {APP_FEATURES.slice(0, 2).map((feature) => (
                  <div
                    key={feature.id}
                    className="bg-[#fffef8] p-6 rounded-xl shadow-xs hover:shadow-lg shadow-amber-100 transition border border-amber-100"
                  >
                    <h3 className="text-base font-semibold mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Auth Modal */}
      <Modal
        isOpen={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        <div>
          {currentPage === "login" && <Loging setCurrentPage={setCurrentPage} />}
          {currentPage === "signup" && <SignUp setCurrentPage={setCurrentPage} />}
        </div>
      </Modal>
      <footer className="bg-black text-white py-6 mt-16">
  <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
    <p className="text-sm text-gray-300">
      © {new Date().getFullYear()} Interview Prep AI. All rights reserved.
    </p>
    <p className="text-sm text-gray-400">
      Made with by <span className="text-[#ff9324] font-semibold">Zaied</span>
    </p>
  </div>
</footer>

    </>
  );
};

export default Landing;
