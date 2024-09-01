import React from "react";
import { useSelector } from "react-redux";

function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="mx-auto max-w-lg p-3">
      <h1 className="text-center font-semibold text-3xl my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <img
          className=" w-24 h-24 text-center self-center cursor-pointer rounded-full object-cover"
          src={currentUser.data.user.avatar}
        />
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
        <button className="bg-slate-700 uppercase rounded-lg text-white p-2 hover:opacity-80 disabled:opacity-60" >update</button>
      </form>
      <div className="flex justify-between  m-5" >
        <span className="text-red-400  cursor-pointer bg-slate-700 p-2 rounded-lg " >Delete Account</span>
        <span className="text-red-400  cursor-pointer bg-slate-700 p-2 rounded-lg" >Sign Out</span>
      </div>
    </div>
  );
}

export default Profile;
