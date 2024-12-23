import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const DeletePage = () => {
  const { storyId } = useParams(); // Get storyId from the route
  const navigate = useNavigate();

  useEffect(() => {
    const handleDelete = async () => {
      const token = localStorage.getItem("authToken");
      try {
        await axios.delete(
          `https://storybook-backend-b3ji.onrender.com/api/stories/${storyId}/deletestory`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // alert("Story deleted successfully!");
        navigate("/stories/create"); // Navigate back to the Author Stories page
      } catch (error) {
        console.error("Error deleting story:", error);
        alert("Failed to delete the story. Try again later.");
      }
    };

    handleDelete(); // Call the delete function as soon as the page loads
  }, [storyId, navigate]);

  return <></>;
};

export default DeletePage;
