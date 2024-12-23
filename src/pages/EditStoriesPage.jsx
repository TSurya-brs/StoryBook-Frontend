import React, { useState, useEffect } from "react";
import axios from "axios";

const EditStoriesPage = ({ storyId, onClose, onStoryUpdated }) => {
  const [storyData, setStoryData] = useState({
    title: "",
    content: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch the current story data to pre-fill the form
  useEffect(() => {
    const fetchStoryData = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          setErrorMessage("You are not logged in.");
          return;
        }

        const response = await axios.get(
          `https://storybook-backend-b3ji.onrender.com/api/stories/${storyId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStoryData({
          title: response.data.title,
          content: response.data.content,
        });
      } catch (error) {
        setErrorMessage("Error fetching story data.");
        console.error("Error fetching story:", error);
      }
    };

    fetchStoryData();
  }, [storyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStoryData({
      ...storyData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setErrorMessage("You are not logged in.");
      return;
    }

    try {
      const response = await axios.put(
        `https://storybook-backend-b3ji.onrender.com/api/stories/${storyId}/editstory`,
        storyData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage(response.data.message);
      setErrorMessage("");

      // Call the onStoryUpdated callback to update the story in the list
      onStoryUpdated({
        _id: storyId,
        title: storyData.title,
        content: storyData.content,
      });

      setTimeout(() => onClose(), 1000); // Close the modal after success
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to update the story."
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">Edit Story</h2>

        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="text-green-500 text-center mb-4">{successMessage}</p>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Story Title
            </label>
            <input
              type="text"
              name="title"
              value={storyData.title}
              onChange={handleChange}
              placeholder="Enter your story title"
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Story Content
            </label>
            <textarea
              name="content"
              value={storyData.content}
              onChange={handleChange}
              rows="6"
              placeholder="Write your story here..."
              className="w-full p-3 border rounded-lg"
            ></textarea>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStoriesPage;
