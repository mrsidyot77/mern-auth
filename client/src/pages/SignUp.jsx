import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "./OAuth";

function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  // Handle the change event for form inputs
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/v1/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      setLoading(false);

      if (!data.success) {
        setError(data.message);
      } else {
        setSuccessMessage("You are registered successfully, Now you can Sign in.");
        setFormData({
          fullName: "",
          username: "",
          email: "",
          password: ""
        });
        navigate("/sign-in");
      }
    } catch (err) {
      setLoading(false);
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-4xl my-3 font-semibold text-center">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4 bg-gray-800 p-6 rounded-lg">
        <input
          type="text"
          id="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          className="rounded-xl p-3 bg-slate-200 placeholder-gray-500"
          onChange={handleChange}
        />
        <input
          type="text"
          id="username"
          placeholder="Username"
          value={formData.username}
          className="rounded-xl p-3 bg-slate-200 placeholder-gray-500"
          onChange={handleChange}
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          value={formData.email}
          className="rounded-xl p-3 bg-slate-200 placeholder-gray-500"
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={formData.password}
          className="rounded-xl p-3 bg-slate-200 placeholder-gray-500"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="rounded-lg bg-slate-600 py-3 uppercase hover:opacity-60 text-white disabled:opacity-60"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 my-3">
        <p>Have an Account?</p>
        <Link to="/sign-in">
          <span className="text-blue-300">Sign In</span>
        </Link>
      </div>
      {successMessage && <p className="text-green-400">{successMessage}</p>}
      {error && <p className="text-red-400">{error}</p>}
    </div>
  );
}

export default SignUp;
