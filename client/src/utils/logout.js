import Cookies from "js-cookie";

export const logout = (setUser, setLoggedin) => {
    setUser({});
    setLoggedin(false);
    window.localStorage.clear();
    window.sessionStorage.clear();
    Cookies.remove("yearbook-token");
    window.location.href = "/login";
};
