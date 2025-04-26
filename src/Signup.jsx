import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./stylesheets/Signup.module.css"; 

function Signup() {
  const [name, setName] = useState("");
  const [userEmail, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [res, setRes] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response = await axios.post(
        `${import.meta.env.VITE_SERVER}/app/signup`,
        { name, userEmail, password },
        { withCredentials: true }
      );
      setRes(response.data.message);
      if (response.data.message === "User created successfully") {
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (e) {
      console.log("Error block");
      setRes("Error");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.signupForm}>
        <h2 className={styles.formTitle}>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>UserName:</label>
            <input
              type="text"
              id="name"
              className={styles.input}
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email:</label>
            <input
              type="email"
              id="email"
              className={styles.input}
              onChange={(e) => setEmail(e.target.value)}
              value={userEmail}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password:</label>
            <input
              type="password"
              id="password"
              className={styles.input}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            
          <input type="submit" value="Submit Now" className={styles.submitBtn} />
          </div>
        </form>
        <p className="responseMessage">{res}</p>
        <a href="/login" className={styles.homeLink}>Already have an account? Login here</a>
      </div>
    </div>
  );
}

export default Signup;
