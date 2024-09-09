
import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { signInStart,signInSuccess,signInFailure} from "../redux/userSlice.js";
import {useDispatch, useSelector} from "react-redux"
import OAuth from "./OAuth.jsx";

function SignIn() {
  
  const [formData, setFormData] = useState({});
  const {loading, error } = useSelector((state)=> state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()



  // Handle the change event for form inputs
  const handleChange = (e) => {
    // Update the formData state with the new value from the input field
    // `e.target.id` is the ID of the input field that triggered the change
    // `e.target.value` is the value entered in that input field
    
    setFormData({
      ...formData, // Spread the existing form data (keep previous entries)
      [e.target.id]: e.target.value, // Update the key that matches the input field's ID with the new value   
    });
    if (error) {
      dispatch(signInFailure(null));
    }
  };



  const handleSubmit = async(e)=>{
    e.preventDefault()
    try {
      dispatch(signInStart())
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/users/login`,{
        method: "POST",
        headers: {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      
      
      
      if (!res.ok || !data.success) {
       dispatch(signInFailure(data.message || "Login failed. Please try again."))
      
        return
      }
      dispatch(signInSuccess(data))
      navigate('/')
    } catch (err) {
      dispatch(signInFailure(err.message || "Something went wrong. Please try again."))
      
    }
   
   
    
  }
  
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-4xl my-3 font-semibold text-center">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4 bg-gray-800 p-6 rounded-lg">
        
        <input
          type="text"
          id="email"
          placeholder="Email"
          className="rounded-xl p-3 bg-slate-200 placeholder-gray-500"
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="rounded-xl p-3 bg-slate-200 placeholder-gray-500"
          onChange={handleChange}
        />
        <button disabled={loading} className="rounded-lg bg-slate-600  py-3 uppercase hover:opacity-90 text-white disabled:opacity-90">
         {loading ? "Loading..." : "Sign In" }
        </button>
        <OAuth/>
      </form>
      <div className="flex gap-2 my-3">
        <p >Don't have an Account?</p>
        <Link to="/sign-up">
          <span className="text-cyan-300">Sign Up</span>
        </Link>
      </div>
      
       <p className="text-red-400">{error ? error  || "Somthing went wrong!": ""}</p>
     
    </div>
  );
}

export default SignIn;
