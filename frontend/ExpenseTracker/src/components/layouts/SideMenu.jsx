import React, { useContext, useRef, useState } from "react";
import { SIDE_MENU_DATA } from "../../utils/data";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import CharAvatar from "../Cards/CharAvatar";
import { FaCamera, FaEdit } from "react-icons/fa"; // Import icons
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const [selectedImg, setSelectedImg] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "/logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Please select a valid image file (JPEG, PNG, or WebP)");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      alert("File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      // Here you can also update the user context or send to backend
      try {
        const response = await axiosInstance.put(
          API_PATHS.AUTH.UPDATE_PROFILE,
          {
            profileImageUrl: base64Image,
          }
        );

        if (response.data) {
          toast.success("Profile image updated successfully");
        }
      } catch (error) {
        console.error("Something went wrong while updating image.", error);
        toast.error("Something went wrong. Failed to update image.");
      }
    };

    reader.onerror = () => {
      alert("Error reading file. Please try again.");
    };
  };

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20">
      <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
        <div
          className="relative cursor-pointer"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={handleImageClick}
        >
          {user?.profileImageUrl || selectedImg ? (
            <img
              src={selectedImg || user?.profileImageUrl || ""}
              alt="Profile Image"
              className="w-20 h-20 bg-slate-400 rounded-full object-cover"
            />
          ) : (
            <CharAvatar
              fullName={user?.fullName}
              width="w-20"
              height="h-20"
              style="text-xl"
            />
          )}

          {/* Hover overlay with update icon */}
          {isHovering && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full transition-opacity duration-200">
              <FaCamera className="text-white text-xl" />
            </div>
          )}

          {/* Small edit icon that's always visible */}
          <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-1.5 shadow-lg">
            <FaEdit className="text-xs" />
          </div>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
        />

        <h5 className="text-gray-950 font-medium leading-6 text-center">
          {user?.fullName || "Guest User"}
        </h5>
      </div>

      {SIDE_MENU_DATA.map((item, index) => (
        <button
          key={`menu_${index}`}
          className={`w-full flex items-center gap-4 text-[15px] transition-colors duration-200 ${
            activeMenu === item.label
              ? "text-white bg-primary"
              : "text-gray-700 hover:bg-gray-100"
          } py-3 px-6 rounded-lg mb-3`}
          onClick={() => handleClick(item.path)}
        >
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default SideMenu;
