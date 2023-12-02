import { createContext, useState, useEffect } from "react";
import { BASE_URL } from "../links";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {


    const navigate = useNavigate()
  let [authTokens, setAuthTokens] = useState(()=>localStorage.getItem('authTokens')? JSON.parse(localStorage.getItem('authTokens')):null);
  let [authenticated,setAuthenticated]=useState(false);
  let[loading,setLoading] = useState(true)
  let [user, setUser] = useState(()=>localStorage.getItem('authTokens')? jwtDecode(JSON.parse(localStorage.getItem('authTokens')).access):null);
    let [loginError,setLoginError]=useState(null);
    let logoutUser=()=>{
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        navigate("/api/login")
    }
  let loginUser = (usernameText,passwordText) => {
    
    let res = null;
    axios
      .post(`${BASE_URL}/api/login/`, {
       username:usernameText,
       password:passwordText,
      })
      .then((res) => {
        if(res.data.message){
            setLoginError(res.data.message)
            // alert(res.data.message)
        }else{
        // console.log(res.data)
        setAuthTokens(res.data)
        setUser(jwtDecode(res.data.access))
        localStorage.setItem('authTokens',JSON.stringify(res.data))
    navigate("/api/calendar")
        }
      }).catch((error)=>{
       setLoginError("User Does not Exist")
      });
  };
  let updateToken = ()=>{
    // console.log("update token called")
    axios
      .post(`${BASE_URL}/api/token/refresh/`, {
       refresh:authTokens?.refresh
      })
      .then((res) => {
        if(res.status==200){
        setAuthTokens(res.data)
        setUser(jwtDecode(res.data.access))
        localStorage.setItem('authTokens',JSON.stringify(res.data))
        }
        else{
            logoutUser()
        }
      }).catch((error)=>{
        logoutUser()
       });
       if(loading){
        setLoading(false)
       }
  }
  let ContextData = {
    logoutUser:logoutUser,
    user:user,
    setUser:setUser,
    loginUser:loginUser,
    setLoginError:setLoginError,
    loginError:loginError
  };
  useEffect(()=>{
    if(loading){
        updateToken()
    }
    let interval= setInterval(()=>{
        if(authTokens){
            updateToken()
        }
    },540000)
    return ()=>clearInterval(interval)
  },[authTokens,loading])
  return (
    <AuthContext.Provider value={ContextData}>
      {loading? null:children}
    </AuthContext.Provider>
  );
};
