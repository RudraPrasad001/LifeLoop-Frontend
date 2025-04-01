import React, { useState,useEffect} from 'react';
import Cookies from 'js-cookie';
import {useNavigate} from 'react-router-dom';
function Home() {
  const[isAuth,setAuth] = useState(true);
  const[decoded,setDecoded]=useState({});
  const navigate = useNavigate();
  const decodeTokenManually = (token) => {
    try {
      const parts = token.split('.');
  
      if (parts.length !== 3) {
        throw new Error('Invalid Token Format!');
      }
  
      // Decode Header
      const header = JSON.parse(atob(parts[0]));
  
      // Decode Payload
      const payload = JSON.parse(atob(parts[1]));
  
      // Signature
      const signature = parts[2];
      return { header, payload, signature };
    } catch (error) {
      console.log('Error decoding token:', error.message);
      return null;
    }
  };
  
  // Usage
  
  
  
  useEffect(() => {
    const token = Cookies.get('token');
    if(!token){
      setAuth(false)
      navigate("/login");
    }else{
    const decoded = decodeTokenManually(token);
    setDecoded(decoded.payload);}
    
  },[]
  );
    
  if(isAuth){
    return(<div><p>welcome {decoded.name}</p></div>)
  }
  else{
    return(<div><p>You are not authorized</p></div>)
  }
}
export default Home;