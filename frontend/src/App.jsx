import React from "react"
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import {Toaster} from "react-hot-toast"

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Home/Dashboard";
import InterViewPrep from "./pages/InterViewPrep/InterViewPrep";
import UserProvider from "./Context/UserContext";

function App() {

  return (
    <UserProvider>
    <div>
      <Router>
        <Routes>
          {/* Deafult Route */}
          <Route path="/" element= {<Landing/>} />

          <Route path="/login" element = {<Login/>}/>
          <Route path="/signup" element = {<SignUp/>}/>
          <Route path="/dashboard" element = {<Dashboard/>}/>
          <Route path="/interview-prep/:sessionId" element = {<InterViewPrep/>}/>
        </Routes>
      </Router>

      <Toaster
      toastOptions={{
        className: "",
        style: {
          fontSize: "13px",
        },
      }}
      />
    </div>
    </UserProvider>
  )
}

export default App
