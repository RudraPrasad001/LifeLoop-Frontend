import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import styles from "./stylesheets/Login.module.css";
function Login() {
  const [userEmail, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [res, setRes] = useState("");
  const [otpRes,setOtpRes] = useState("");
  const [isLog, setLog] = useState(false);
  const [otp,setOTP] = useState();
  const [isConsidered,setConsidered] = useState(false);
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  const handleOtpReq = async()=>{
    try{
      const response =await axios.post(`${import.meta.env.VITE_SERVER}/app/verifyOtp`,{
        userEmail,
        otp,
      });
      if(response.data.isLogged){
        setLog(true);
        Cookies.set('token', response.data.token, {
          expires: 1,         // 1 day
          sameSite: 'None',    // or 'None' if needed for cross-origin
          secure: true,       // required in production over HTTPS
        });
        setTimeout(2000,navigate("/"));
      }
      else{
      setOtpRes(response.data.message);
      }
    }catch(e){
      setLog(false);
      setOtpRes("Error");
      console.log(e);
    }
  }

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    try {
      let response = await axios.post(`${import.meta.env.VITE_SERVER}/app/login`, {
        userEmail,
        password,
      });
      setRes(response.data.message);
      if(response.data.isConsidered){
        setConsidered(true);
      }
    } catch (e) {
      setLog(false);
      setRes("Error");
      console.log(e);
    }
  };

  return (
    <div className={styles.container}>
      {isConsidered && <div className={styles.otpGradient}>
       <div className={styles.otpForm}>
       <p className={styles.otpMessage}>
        An OTP has been sent to <strong>{userEmail}</strong>, kindly enter it:
       </p>

      <input
        type="text"
        name="otp"
        id="otp"
        maxLength="6"
        placeholder="Enter OTP"
        onChange={() => setOTP(document.getElementById("otp").value)}
        className={styles.otpField}
      />

      <p className={styles.otpResponseMessage}>{otpRes}</p>

      <button className={styles.submitBtn} onClick={handleOtpReq}>
        Verify
      </button>
</div></div>
}
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h2 className={styles.formTitle}>Login</h2>
        <div className={styles.inputGroup}>
          <div className={styles.floating}>
          
          <input
            type="email"
            name="email"
            id="email"
            className={styles.input}
            placeholder=""
            onChange={() => setEmail(document.getElementById('email').value)}
          />
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          </div>
        </div>
        <div className={styles.inputGroup}>
        <div className={styles.floating}>
          
          <i className="pass"></i>
          <input
            type="password"
            name="password"
            id="password"
            placeholder=""
            className={styles.input}
            onChange={() => setPassword(document.getElementById('password').value)}
          />
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          </div>
        </div>
        <button type="submit" className={styles.submitBtn}>
          Submit
        </button>
        <p className={styles.responseMessage}>{res}</p>
        <a href="/signup" className={styles.homeLink}>Do not have an account? Signup here</a>
      </form>
    </div>
  );
}

export default Login;
