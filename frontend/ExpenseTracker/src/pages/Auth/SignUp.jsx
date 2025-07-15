import React, { useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input/Input";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/Input/ProfilePhotoSelector";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import uploadImage from "../../utils/uploadImage";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!fullName || !email || !password) {
      setError("Please fill in all the fields");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setError("");

    try {
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl,
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
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
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              vlaue={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              type="text"
              placeholder="Enter Your Full Name"
            />

            <Input
              vlaue={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              type="email"
              placeholder="johnathan.doe@example.com"
            />

            <div className="col-span-2">
              <Input
                vlaue={password}
                onChange={({ target }) => setPassword(target.value)}
                label="Pasword"
                type="password"
                placeholder="••••••••••••"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
          <button type="submit" className="btn-primary">
            SIGNUP
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
