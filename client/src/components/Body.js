import cm2 from "../assests/cms2.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Body = () => {
    const navigate = useNavigate();
    const useremail = localStorage.getItem('UserEmail');
    const isUserLoggedIn = !!useremail; // Check if the user is logged in
    const onHandleClick = ()=>{
        if(isUserLoggedIn)
        {
          navigate("/dashboard/posts/create");
        }
        else{
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
          navigate("/")
        }
      }
    return (
        <div className="Body">
            <div className="LoginSignup">
                <div className="heading">
                    Platform for Creating Stunning Blogs
                </div>
                <div className="matter">
                    Craft a unique and beautiful Blogs effortlessly.
                </div>
                <button onClick={onHandleClick}>GET STARTED</button>
            </div>
            <div className="img">
                <img src={cm2} alt="cms_image" />
            </div>
        </div>
    );
};

export default Body;
