import { useEffect, useState } from "react";
import { Link ,useLocation,useNavigate} from "react-router-dom";
import { toast } from "react-toastify";
import SignUpForm from "./SignUpForm";
const Header = () => {
  const useremail = localStorage.getItem('UserEmail');
  const isUserLoggedIn = !!useremail; // Check if the user is logged in

  const [isOpen, setisOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const handleOpen = (e) => {
    // console.log("opened")
    e.preventDefault();
    setisOpen(true);
  };
  const handleclose = () => {
    setisOpen(false);
  };
  useEffect(()=>{
    if(useremail)
    {
      setIsLoggedIn(true);
    }
  },[useremail])

  const handleSuccessfulSignUp = () => {
    setIsLoggedIn(true);
    handleclose(); // Close the signup modal
  };

  // Function to handle logout
  const handleLogout = () => {

    setIsLoggedIn(false);
    localStorage.removeItem('UserEmail');
    // Redirect to the main page
    navigate('/');
    // Display a toast notification
    toast.success("Logged out successfully");
  };

  
  // Redirect to the main page if the user is not logged in
  if (!isUserLoggedIn && location.pathname === "/dashboard") {
    navigate('/');
    toast.info(' You must be sign up or log in!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }

  return (
    <>
      <div className="Header">
        <div className="logo">
          <h1>ContentCraft</h1>
        </div>
        <div className="list">
          <ul>
            <li>
              <Link className="Links" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="Links" to="dashboard">
                Dashboard
              </Link>
            </li>
            <li>
              <Link className="Links" to="/blogs">Blogs</Link>
            </li>
            {(location.pathname === "/" || isUserLoggedIn) && <li>
              {isLoggedIn ? (
                // Render the "Logout" button when logged in
                <Link className="Links" onClick={handleLogout}>
                  Logout
                </Link>
              ) : (
                // Render the "Sign Up" link when not logged in
                <Link className="Links" to='/signup' onClick={handleOpen}>
                  Sign up
                </Link>
              )}
            </li>}
          </ul>
        </div>
      </div>
      <SignUpForm
        isOpen={isOpen}
        close={handleclose}
        onSignUpSuccess={handleSuccessfulSignUp}
      />
    </>
  );
};

export default Header;
