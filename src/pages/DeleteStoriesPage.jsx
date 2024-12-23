import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const DeletePage = () => {
  const { storyId } = useParams();
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
        navigate("/stories/create");
      } catch (error) {
        console.error("Error deleting story:", error);
        alert("Failed to delete the story. Try again later.");
      }
    };

    handleDelete();
  }, [storyId, navigate]);

  return <></>;
};

export default DeletePage;
