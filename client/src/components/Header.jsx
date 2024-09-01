import { Link } from "react-router-dom";
import {useSelector} from "react-redux"

function Header() {
  const {currentUser} = useSelector((state) => state.user)
  
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
          <Link to="/profile">
            {" "}
            {currentUser ? (<img className="w-8 h-8 object-cover rounded-full "  src={currentUser.data.user.avatar}/>):(<li className="font-bold mt-1 text-gray-500">Sign In </li>)}
           
            
          </Link>
          
        </ul>
      </div>
    </div>
  );
}

export default Header;
