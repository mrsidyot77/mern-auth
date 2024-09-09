import React from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

function OAuth() {

    const dispatch = useDispatch()
    const naviagte = useNavigate()
    const handleGoogleClick = async () => {
    try {
      //fireBase
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          avatar: result.user.photoURL,
        }),
      });
      const data = await res.json();
      dispatch(signInSuccess(data))
      naviagte("/")
    } catch (error) {
      console.log("Could not connect with Google. ", error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 rounded-lg p-3 text-white uppercase hover:opacity-80"
    >
      Continue with Google
    </button>
  );
}

export default OAuth;
