import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: null,
        token: ""
    })

    //default axios
    axios.defaults.headers.common['Authorization'] = auth?.token;

    useEffect(() => {
        const data = Cookies.get('auth')
        if (data) {
            const parseData = JSON.parse(data)
            setAuth({
                ...auth,
                user: parseData.user,
                token: parseData.token,
            })
        }
        //eslint-disable-next line
    }, [])
    return (
        <AuthContext.Provider value={[auth, setAuth]}>
            {children}
        </AuthContext.Provider>
    )
}

//custom Hooks
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider }