import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";

const AccountPage = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const name = localStorage.getItem("userName");

    setUserEmail(email);
    setUserName(name);

    // Logging the values to check
    // console.log("Email from localStorage: ", email);
    // console.log("Name from localStorage: ", name);
  }, []);

  return (
    <>
      <NavBar />
      <div className="p-8 bg-blue rounded-lg shadow-lg max-w-md mx-auto mt-8">
        <h2 className="text-2xl font-semibold text-blue-1000 mb-6">
          Account Details
        </h2>
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Username:
            </label>
            <p className="text-lg text-gray-800">
              {userName || "No username available"}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Email:
            </label>
            <p className="text-lg text-gray-800">
              {userEmail || "No email available"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountPage;
