import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../.idx/gc/firebase';
import { UseAuth } from '../context/AuthContext';
import "../login.css";

function Login() {
  const { setCurrentUser } = UseAuth();
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setCurrentUser(user); 
        navigate("/");
      })
      .catch((error) => {
        setErr(error.code);
        setTimeout(() => {
          setErr(null);
        }, 2000);
      });
  };

  return (
    <div className="login">
      <div className="form-container">
        <p className="title">Login</p>
        <form className="form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" placeholder="" />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder=""
            />
            <div className="forgot" >
              <Link to="/resetpassword">Forgot Password ?</Link>
            </div>
          </div>
          {err && <span className="error-message">{err}</span>}
          <button className="sign">Sign in</button>
        </form>
        <div className="social-message">
          <div className="line"></div>
          {/* <p className="message">Login with social accounts</p> */}
          <div className="line"></div>
        </div>
        <div className="social-icons">{/* Social icons */}</div>
        <p className="signup">
          Don't have an account?
          <Link to="/signup"> Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
