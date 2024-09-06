
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "./OAuth";

function SignUp() {
  
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dataReg, setDatareg] = useState(false)

  const navigate = useNavigate()


  // Handle the change event for form inputs
  const handleChange = (e) => {
    // Update the formData state with the new value from the input field
    // `e.target.id` is the ID of the input field that triggered the change
    // `e.target.value` is the value entered in that input field
    
    setFormData({
      ...formData, // Spread the existing form data (keep previous entries)
      [e.target.id]: e.target.value, // Update the key that matches the input field's ID with the new value   
    });
  };



  const handleSubmit = async(e)=>{
    e.preventDefault()
    try {
      setLoading(true)
      dataReg(false)
      setError(false)
      const res = await fetch("http://localhost:5000/api/v1/users/register",{
        method: "POST",
        headers: {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      setDatareg(true)
      console.log(data);

      setLoading(false)
      if (data.success == false) {
        setError(true)
        return
      }
      navigate("/sign-in")
    } catch (error) {
      setLoading(false)
      setError(true)
    }
   
    
  }

  const clearStates = ()=>{
    setError(false)
    setDatareg(false)
    
  }
  
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-4xl my-3 font-semibold text-center">Sign Up</h1>
      <form  onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4 bg-gray-800 p-6 rounded-lg">
        <input
          type="text"
          id="fullName"
          placeholder="Full Name"
          className="rounded-xl p-3 bg-slate-200 placeholder-gray-500"
          onChange={handleChange}
          onFocus={clearStates}
        />
        <input
          type="text"
          id="username"
          placeholder="Username"
          className="rounded-xl p-3 bg-slate-200 placeholder-gray-500"
          onChange={handleChange}
          onFocus={clearStates}
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          className="rounded-xl p-3 bg-slate-200 placeholder-gray-500"
          onChange={handleChange}
          onFocus={clearStates}
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="rounded-xl p-3 bg-slate-200 placeholder-gray-500"
          onChange={handleChange}
          onFocus={clearStates}
        />
        <button disabled={loading} className="rounded-lg  bg-slate-600  py-3 uppercase hover:opacity-60 text-white disabled:opacity-60">
         {loading ? "Loading..." : "Sign Up" }
        </button>
        <OAuth/>
      </form>
      <div className="flex gap-2 my-3">
        <p >Have an Account?</p>
        <Link to="/sign-in">
          <span className="text-blue-300">Sign In</span>
        </Link>
      </div>
      <p className="text-green-400">{dataReg && "You are registered successfully, Now you can Sign in."}</p>
        <p className="text-red-400">{error && "Something went wrong."}</p>
     
    </div>
  );
}

export default SignUp;
