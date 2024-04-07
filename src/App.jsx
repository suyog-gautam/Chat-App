import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import { Home } from "./pages/Home";
import { PasswordReset } from "./pages/PasswordReset";
import { VerifyEmail } from "./pages/VerifyEmail";
import { NotFound } from "./pages/NotFound";
import { UseAuth } from "./context/AuthContext.jsx";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import "./App.css";
import { sendEmailVerification } from "firebase/auth";
import { useEffect, useState } from "react";
import { Chat } from "./components/Chat";

function App() {
  const { currentUser } = UseAuth();
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 768px)").matches
  );
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // If user is authenticated but email is not verified, send verification email and redirect to email verification page
  useEffect(() => {
    if (currentUser && !currentUser.emailVerified) {
      const sendVerificationEmail = async () => {
        try {
          await sendEmailVerification(currentUser);
          console.log("Verification email sent");
        } catch (error) {}
      };

      sendVerificationEmail();
    }
  }, [currentUser]);

  // Render routes
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={currentUser ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={currentUser ? <Navigate to="/" /> : <Login />}
        />
        {/* Only redirect to chat page if user is on mobile */}
        {isMobile && (
          <Route
            path="/chat"
            element={currentUser ? <Chat /> : <Navigate to="/login" />}
          />
        )}
        <Route
          path="/signup"
          element={currentUser ? <Navigate to="/" /> : <SignUp />}
        />
        <Route
          path="/resetpassword"
          element={currentUser ? <Navigate to="/login" /> : <PasswordReset />}
        />
        <Route
          path="/email-verification"
          element={
            currentUser && !currentUser.emailVerified ? (
              <VerifyEmail />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
