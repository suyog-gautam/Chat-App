import React, { useState } from "react";
import { Link } from "react-router-dom";

export const VerifyEmail = () => {
  return (
    <div className="login reset">
      <div className="form-container">
        <p className="title">Please Verify Your Email </p>

        <div className="social-message">
          <div className="line"></div>
          <div className="line"></div>
        </div>

        <p className="signup">
          Already Verified? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};
