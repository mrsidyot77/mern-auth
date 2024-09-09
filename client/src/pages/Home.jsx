import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "../redux/userSlice";

function Home() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/logout`);
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-4xl font-bold text-center mb-10">
        Welcome to the Auth System
      </h1>

      {currentUser ? (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Hello, {currentUser.data.user.fullName}!
          </h2>
          <p className="mb-4">Email: {currentUser.data.user.email}</p>
          <Link to="/profile">
            <img
              src={currentUser.data.user.avatar}
              alt="User Avatar"
              className="w-24 h-24 rounded-full mx-auto mb-4 cursor-pointer"
            />
          </Link>
          <button
            onClick={handleSignOut}
            className=" bg-sky-950  uppercase rounded-lg text-white p-2 hover:opacity-80 disabled:opacity-60"
          >
            Signout
          </button>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">
            You are not logged in.
          </h2>
          <Link
            to="/sign-in"
            className="mx-2 bg-sky-950 uppercase rounded-lg text-white p-2 hover:opacity-80 disabled:opacity-60"
          >
            sign in
          </Link>
          <Link
            to="/sign-up"
            className=" bg-sky-950  uppercase rounded-lg text-white p-2 hover:opacity-80 disabled:opacity-60"
          >
            signup
          </Link>
        </div>
      )}
    </div>
  );
}

export default Home;
