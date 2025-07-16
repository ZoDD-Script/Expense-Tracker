import React, { useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Clear previous errors

    // Validation
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError("Please enter your password");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      if (!response.data || !response.data.token || !response.data.user) {
        setError("Invalid response from server. Please try again.");
        setIsLoading(false);
        return;
      }

      console.log("Login response:", response.data);

      const { token, user } = response.data;

      if (!token || !user) {
        setError("Invalid response from server. Please try again.");
        setIsLoading(false);
        return;
      }

      // More robust validation
      if (token && user) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      } else {
        setError("Invalid response from server. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);

      // More specific error handling
      if (error.response) {
        const { status, data } = error.response;

        switch (status) {
          case 401:
            setError(
              "Invalid email or password. Please check your credentials."
            );
            break;
          case 404:
            setError("Account not found. Please check your email or sign up.");
            break;
          case 400:
            setError(
              data.message || "Invalid request. Please check your input."
            );
            break;
          case 500:
            setError("Server error. Please try again later.");
            break;
          default:
            setError(data.message || "Something went wrong. Please try again.");
        }
      } else if (error.request) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please enter your details to log in.
        </p>

        <form onSubmit={handleLogin}>
          <Input
            value={email} // Fixed typo: vlaue -> value
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            type="email"
            placeholder="johnathan.doe@example.com"
            disabled={isLoading}
          />

          <Input
            value={password} // Fixed typo: vlaue -> value
            onChange={({ target }) => setPassword(target.value)}
            label="Password" // Fixed typo: Pasword -> Password
            type="password"
            placeholder="••••••••••••"
            disabled={isLoading}
          />

          {error && (
            <div className="text-red-500 text-xs pb-2.5 bg-red-50 p-2 rounded mb-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            className={`${!isLoading ? "btn-primary" : "btn-loading"}`}
            disabled={isLoading}
          >
            {isLoading ? "LOGGING IN..." : "LOGIN"}
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account?{" "}
            <Link className="font-medium text-primary underline" to="/signup">
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
