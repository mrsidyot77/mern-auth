import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement logout functionality here
    // For example, you might clear tokens and navigate to the login page
    // navigate("/login");
    // dispatch(logoutUser());
  };

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-4xl font-bold text-center mb-10">Welcome to the Auth System</h1>

      {currentUser ? (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Hello, {currentUser.data.user.fullName}!</h2>
          <p className="mb-4">Email: {currentUser.data.user.email}</p>
          <img
            src={currentUser.data.user.avatar}
            alt="User Avatar"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">You are not logged in.</h2>
          <Link
            to="/sign-in"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-4"
          >
            Login
          </Link>
          <Link
            to="/sign-up"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
}

export default Home;
