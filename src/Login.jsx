import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./stylesheets/Login.module.css";

function Login() {
  const [userEmail, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [res, setRes] = useState("");
  const [isLog, setLog] = useState(false);
  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response = await axios.post("http://localhost:3001/app/login", {
        userEmail,
        password,
      });
      setRes(response.data.message);
      if(response.data.isLogged){
        setLog(true);
      }
    } catch (e) {
      setLog(false);
      setRes("Error");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h2 className={styles.formTitle}>Login</h2>
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className={styles.input}
            onChange={() => setEmail(document.getElementById('email').value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className={styles.input}
            onChange={() => setPassword(document.getElementById('password').value)}
          />
        </div>
        <button type="submit" className={styles.submitBtn}>
          Submit
        </button>
        <p className={styles.responseMessage}>{res}</p>
        <p>Do not have an account?</p> <Link to="/signup">Register Now</Link>
        {isLog && <Link to="/" className={styles.homeLink}>Go to Home Page</Link>}
      </form>
    </div>
  );
}

export default Login;
