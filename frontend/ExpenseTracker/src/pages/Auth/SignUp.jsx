import React, { useState, useContext } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input/Input";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/Input/ProfilePhotoSelector";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { UserContext } from "../../context/userContext";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Clear any existing errors
    setError("");

    // Validate email
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Validate required fields
    if (!fullName || !email || !password) {
      setError("Please fill in all the fields");
      return;
    }

    // Validate password length
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      // Prepare the payload
      const payload = {
        fullName,
        email,
        password,
        profileImageUrl: profilePic || "", // Send the base64 image or empty string
      };

      const response = await axiosInstance.post(
        API_PATHS.AUTH.REGISTER,
        payload
      );

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Sign up error:", error);

      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePicChange = (imageData) => {
    setProfilePic(imageData);
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">
          Keep up to date with your finances
        </h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today and take control of your finances.
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector
            image={profilePic}
            setImage={handleProfilePicChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={fullName} // Fixed typo: was "vlaue"
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              type="text"
              placeholder="Enter Your Full Name"
              required
            />

            <Input
              value={email} // Fixed typo: was "vlaue"
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              type="email"
              placeholder="johnathan.doe@example.com"
              required
            />

            <div className="col-span-2">
              <Input
                value={password} // Fixed typo: was "vlaue"
                onChange={({ target }) => setPassword(target.value)}
                label="Password" // Fixed typo: was "Pasword"
                type="password"
                placeholder="••••••••••••"
                required
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button
            type="submit"
            className={`${!isLoading ? "btn-primary" : "bg-gray-400"}`}
            disabled={isLoading}
          >
            {isLoading ? "SIGNING UP..." : "SIGNUP"}
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Already have an account?{" "}
            <Link className="font-medium text-primary underline" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
