import Cookies from "js-cookie";
import { toast } from "react-toastify";

export const logout = (setUser, setLoggedin, message) => {
    setUser({});
    setLoggedin(false);
    window.localStorage.clear();
    window.sessionStorage.clear();
    Cookies.remove("yearbook-token", { path: "/" });
    window.location.href = "/login";
    toast.error(message || 'Unexpected Error!', {
        position: "top-right",
        autoClose: 10000, // 10 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          border: '1px solid #fca5a5'
        }
      });
};
