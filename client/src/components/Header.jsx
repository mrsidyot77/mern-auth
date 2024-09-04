import { Link,useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../redux/userSlice";

function Header() {
  
  const {currentUser} = useSelector((state) => state.user)
  const dispatch = useDispatch(); // Get the dispatch function from Redux
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await fetch("http://localhost:5000/api/v1/users/logout");
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div className="bg-slate-950">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-gray-500  text-3xl">AuthSys</h1>{" "}
        </Link>
        <ul className="flex gap-4">
          <Link to="/">
            {" "}
            <li className="font-bold mt-1 text-gray-500" >Home</li>{" "}
          </Link>
          <Link to="/about">
            {" "}
            <li className="font-bold mt-1 text-gray-500">About</li>{" "}
          </Link>
          {currentUser ? (
          <>
              <li
          onClick={handleSignOut}
          className="font-bold mt-1 text-gray-500 cursor-pointer"
        >
          SignOut
        </li>
          <Link to="/profile">
            {" "}
            
              
              <img className="w-8 h-8 object-cover rounded-full "  src={currentUser.data.user.avatar}/>
              </Link>
        </>
              ):(
                <Link to="/sign-in" >
                <li className="font-bold mt-1 text-gray-500">Sign In </li></Link>)}
           
            
          
         
        </ul>
      </div>
    </div>
  );
}

export default Header;
