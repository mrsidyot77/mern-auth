import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  updateAvatarStart,
  updateAvatarSuccess,
  updateAvatarFailure,
  signOut,
  updateAccountStart,
  updateAccountSuccess,
  updateAccountFailure,
} from "../redux/userSlice.js";
import { Link } from "react-router-dom";
import { useEffect } from "react";

function Profile() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const [successMessage, setSuccessMessage] = useState("");
  const [succDataMsg, setSuccDataMsg] = useState("");

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.data.user.fullName);
      setUsername(currentUser.data.user.username);
      setEmail(currentUser.data.user.email);
    }
  }, [currentUser]);

  const clearMessages = () => {
    setSuccessMessage("");
    setSuccDataMsg("");
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      const formData = new FormData();
      formData.append("avatar", file);

      try {
        dispatch(updateAvatarStart());
        const res = await axios.patch(
          `${import.meta.env.VITE_API_URL}/api/v1/users/update-avatar`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${currentUser.data.accessToken}`, // Assuming you store the token here
            },
          }
        );

        dispatch(updateAvatarSuccess({ avatar: res.data.data.avatar }));
        setSuccessMessage("Avatar updated Successfully.");
      } catch (error) {
        console.log("Error while updating avatar.", error);
        dispatch(updateAvatarFailure(error.message));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateAccountStart());
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/update-account-details`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.data.accessToken}`,
          },

          body: JSON.stringify({ fullName, username, email }), // Pass the data correctly
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update account details.");
      }

      const data = await res.json();

      dispatch(updateAccountSuccess());
      setSuccDataMsg(data.message);
    } catch (error) {
      dispatch(updateAccountFailure(error));
    }
  };

  return (
    <div className="mx-auto max-w-lg p-3">
      <h1 className="text-center font-semibold text-3xl my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={handleImageChange}
        />
        <div className="relative w-24 h-24 text-center self-center">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-300 bg-opacity-50 rounded-full">
              <div className="w-6 h-6 border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
            </div>
          )}
          <img
            className=" w-24 h-24 text-center self-center cursor-pointer rounded-full object-cover"
            src={currentUser.data.user.avatar}
            onClick={() => fileRef.current.click()} //current triggers fileRef
          />
        </div>

        {successMessage && (
          <p className="text-green-500 text-center">{successMessage}</p>
        )}
        <input
          type="text"
          placeholder="Full Name"
          defaultValue={currentUser.data.user.fullName}
          className="bg-slate-300 rounded-lg p-2"
          id="fullname"
          onChange={(e) => setFullName(e.target.value)}
          onFocus={clearMessages}
        />
        <input
          type="text"
          placeholder="Username"
          defaultValue={currentUser.data.user.username}
          className="bg-slate-300 rounded-lg p-2"
          id="username"
          onChange={(e) => setUsername(e.target.value)}
          onFocus={clearMessages}
          disabled
        />
        <input
        disabled
          type="email"
          placeholder="Email"
          defaultValue={currentUser.data.user.email}
          className="bg-slate-300 rounded-lg p-2"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          onFocus={clearMessages}
        />

        <button className="bg-slate-700 uppercase rounded-lg text-white p-2 hover:opacity-80 disabled:opacity-60">
          {loading ? "Updating..." : "Update"}
        </button>
        {error && (
          <p className="text-red-500 text-center">
            {error && "Something went wrong."}
          </p>
        )}
        {succDataMsg && (
          <p className="text-green-500 text-center">{succDataMsg}</p>
        )}
        <button type="button" className="bg-slate-700 uppercase rounded-lg text-white p-2 hover:opacity-80 disabled:opacity-60">
          <Link to="/change-password"> Change Password</Link>
        </button>
      </form>

      <div className="flex justify-between  m-4">
        {/* <span className="text-red-400  cursor-pointer bg-slate-700 p-2 rounded-lg ">
          Delete Account
        </span> */}

        
      </div>
    </div>
  );
}

export default Profile;
