import React, { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../.idx/gc/firebase";
export const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(true);
  const handleSubmit = (e) => {
    e.preventDefault();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setMessage("Reset email sent. Check your inbox.");
        setTimeout(() => {
          setMessage(null);
        }, 5000);
        setError(null);
      })
      .catch((error) => {
        setError(error.message);
        setTimeout(() => {
          setError(null);
        }, 3000);
        setMessage(null);
      });
  };
  return (
    <div className="login reset">
      <div className="form-container">
        <p className="title">Password Reset</p>
        <form className="form" onSubmit={handleSubmit}>
          <div className="input-group reset">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              id="email"
              placeholder=""
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && <span className="error-message ">{error}</span>}
          {message && <span className="error-message succ">{message}</span>}
          <button className="sign">Reset Password</button>
        </form>
        <div className="social-message">
          <div className="line"></div>

          <div className="line"></div>
        </div>

        <p className="signup">
          Already Reset Password
          <Link to="/login"> Login</Link>
        </p>
      </div>
    </div>
  );
};
