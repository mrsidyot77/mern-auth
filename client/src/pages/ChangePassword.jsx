import React, { useState } from "react";
import { useSelector } from "react-redux";


function ChangePassword() {
    
  const { currentUser } = useSelector((state) => state.user);
  const [oldPassword,setOldPassword] = useState("")
  const [newPassword,setNewPassword] = useState("")
  const [conPassword,setConPassword] = useState("")
  const [successMessage,setSuccessMessage] = useState("")
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState("")
  
  const handleSubmit = async (e) => {
    
    e.preventDefault();
    if (newPassword !== conPassword) {
      setError("New Password and Confirm Password do not match.");
      return;
    }
    try {
        setLoading(true)
        setError("")
        setSuccessMessage("");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/change-password`,
        {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.data.accessToken}`,
          },
          body: JSON.stringify({ oldPassword, newPassword, conPassword }),
        }
      );
     
      
   
      if (!res.ok) {
        const errorMessage = data.message || "Failed to change password.";
      setError(errorMessage);
      return;
      }
      setLoading(false)
      setError("")
      setSuccessMessage("Password has been changed successfully.")
    } catch (error) {
        setLoading(false)
        setError("Your current password is incorrect.")
      console.log( "Something went wrong while changing password",error);
    }
  };

  const clearMessages = () => {
    setError("");
    setSuccessMessage("");
  };

  
  return (
    <div className="mx-auto max-w-lg p-3">
      <h1 className="text-center font-semibold text-3xl my-7">
        Change Password
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Old Password"
          className="bg-slate-300 rounded-lg p-2 placeholder-gray-500"
          id="oldpassword"
          onChange={(e)=>setOldPassword(e.target.value)}
          onFocus={clearMessages}

        />
        <input
          type="password"
          placeholder="New Password"
          className="bg-slate-300 rounded-lg p-2 placeholder-gray-500"
          id="newpassword"
          onChange={(e)=>setNewPassword(e.target.value)}
          onFocus={clearMessages}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="bg-slate-300 rounded-lg p-2 placeholder-gray-500"
          id="cpassword"
          onChange={(e)=>setConPassword(e.target.value)}
          onFocus={clearMessages}
        />
        <button disabled={loading} className="bg-slate-700  uppercase rounded-lg text-white p-2 hover:opacity-80 disabled:opacity-60">
        {loading ? "Loading..." : "change password"}
        </button>
        {successMessage && (
          <p className="text-green-500 text-center">{successMessage}</p>
          
        )}
        {error && (
        <p className="text-red-400 text-center">{error}</p>)
}
      </form>
    </div>
  );
}

export default ChangePassword;
