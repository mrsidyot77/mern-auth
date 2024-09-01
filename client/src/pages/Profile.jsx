import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  updateAvatarStart,
  updateAvatarSuccess,
  updateAvatarFailure,
  
} from "../redux/userSlice.js";

function Profile() {
  const [image, setImage] = useState(null);
  const { currentUser, loading } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const [successMessage, setSuccessMessage]= useState("")

  console.log(image);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      const formData = new FormData();
      formData.append("avatar", file);

      try {
        dispatch(updateAvatarStart());
        const res = await axios.patch(
          "http://localhost:5000/api/v1/users/update-avatar",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${currentUser.data.accessToken}`, // Assuming you store the token here
            },
          }
        );
        
         dispatch(updateAvatarSuccess({ avatar: res.data.data.avatar }));
         setSuccessMessage("Avatar updated Successfully.")
      } catch (error) {
        console.log("Error while updating avatar.", error);
        dispatch(updateAvatarFailure(error.message));
      }
    }
  };

  return (
    <div className="mx-auto max-w-lg p-3">
      <h1 className="text-center font-semibold text-3xl my-7">Profile</h1>
      <form className="flex flex-col gap-4">
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
        <p className="text-green-500 text-center">
          {successMessage}
        </p>
       )}
        <input
          type="text"
          placeholder="Full Name"
          defaultValue={currentUser.data.user.fullName}
          className="bg-slate-300 rounded-lg p-2"
          id="fullname"
        />
        <input
          type="text"
          placeholder="Username"
          defaultValue={currentUser.data.user.username}
          className="bg-slate-300 rounded-lg p-2"
          id="username"
        />
        <input
          type="email"
          placeholder="Email"
          defaultValue={currentUser.data.user.email}
          className="bg-slate-300 rounded-lg p-2"
          id="email"
        />
        <input
          type="password"
          placeholder="Password"
          className="bg-slate-300 rounded-lg p-2"
          id="password"
        />
        <button className="bg-slate-700 uppercase rounded-lg text-white p-2 hover:opacity-80 disabled:opacity-60">
          update
        </button>
      </form>
      <div className="flex justify-between  m-5">
        <span className="text-red-400  cursor-pointer bg-slate-700 p-2 rounded-lg ">
          Delete Account
        </span>
        <span className="text-red-400  cursor-pointer bg-slate-700 p-2 rounded-lg">
          Sign Out
        </span>
      </div>
    </div>
  );
}

export default Profile;
