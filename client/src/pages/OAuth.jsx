import React from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/userSlice";

function OAuth() {

    const dispatch = useDispatch()
  const handleGoogleClick = async () => {
    try {
      //fireBase
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const res = await fetch("http://localhost:5000/api/v1/users/google", {
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
    } catch (error) {
      console.log("Could not connect with Google. ", error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 rounded-lg p-3 text-white uppercase hover:opacity-90"
    >
      Continue with Google
    </button>
  );
}

export default OAuth;
