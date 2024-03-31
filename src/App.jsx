import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import { Home } from "./pages/Home";
import { PasswordReset } from "./pages/PasswordReset";
import { VerifyEmail } from "./pages/VerifyEmail";
import { UseAuth } from "./context/AuthContext.jsx";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import "./App.css";
import { sendEmailVerification } from "firebase/auth";

function App() {
  const ProtectedRoute = ({ children }) => {
    const { currentUser } = UseAuth();

    // If user is not authenticated, redirect to login page
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    // If user is authenticated but email is not verified, send verification email and redirect to email verification page
    if (currentUser.emailVerifie) {
      const sendVerificationEmail = async () => {
        try {
          await sendEmailVerification(currentUser);
          console.log("Verification email sent");
        } catch (error) {
          console.error("Error sending verification email:", error);
        }
      };

      sendVerificationEmail();

      return <Navigate to="/email-verification" />;
    }

    // If user is authenticated and email is verified, render the children
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route
            index
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="resetpassword" element={<PasswordReset />} />
          <Route path="email-verification" element={<VerifyEmail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
