import { useContext, useDebugValue } from "react";
import Cookies from 'js-cookie';
import AuthContext from "../context/AuthProvider";

const useAuth = () => {
    const { auth } = useContext(AuthContext);
    if (auth.accessToken != null) {
        Cookies.set('token', auth.accessToken, { expires: 7, secure: true });
        Cookies.set('user', auth.user, { expires: 7, secure: true });
        Cookies.set('roles', auth.roles, { expires: 7, secure: true });
        Cookies.set('pwd', auth.pws, { expires: 7, secure: true });
    } else {
        auth.accessToken = Cookies.get("token");
        auth.user = Cookies.get("user");
        auth.roles = Cookies.get("roles");
        auth.pwd = Cookies.get("pwd");
    }
    useDebugValue(auth, auth => auth?.user ? "Logged In" : "Logged Out")
    return useContext(AuthContext);
}

export default useAuth;