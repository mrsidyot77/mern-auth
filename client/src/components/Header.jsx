import { NavLink,Link,useNavigate } from "react-router-dom";

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
    <div className="bg-gray-950">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-gray-500  text-3xl">MERN-AuthSys</h1>{" "}
        </Link>
        <ul className="flex gap-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `font-bold mt-1 ${isActive ? 'text-sky-300 underline' : 'text-gray-500'}
          hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-sky-300 lg:p-0`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `font-bold mt-1 ${isActive ? 'text-sky-300 underline' : 'text-gray-500'}
          hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-sky-300 lg:p-0`
          }
        >
          About
        </NavLink>
        {currentUser ? (
          <>
            <Link
          to="/"
          onClick={handleSignOut}
          className={
            `font-bold mt-1   text-gray-500
          hover:bg-gray-50 lg:hover:bg-transparent  lg:border-0 hover:text-sky-300 lg:p-0`
          }
        >
              Sign Out
           
           </Link>
            <Link to="/profile">
              <img
                className="w-8 h-8 object-cover rounded-full"
                src={currentUser.data.user.avatar}
                alt="User Avatar"
              />
            </Link>
          </>
        ) : (
          <NavLink
            to="/sign-in"
            className={({ isActive }) =>
              `font-bold mt-1 ${isActive ? 'text-sky-300 underline ' : 'text-gray-500'}
            hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-sky-300 lg:p-0`
            }
          >
            Sign In
          </NavLink>
        )}
         
        </ul>
      </div>
    </div>
  );
}

export default Header;
