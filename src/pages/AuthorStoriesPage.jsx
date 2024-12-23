import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EditStoriesPage from "./EditStoriesPage";

const AuthorStoriesPage = () => {
  const [myStories, setMyStories] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [commentsVisible, setCommentsVisible] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStoryId, setSelectedStoryId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyStories = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setErrorMessage("You are not logged in. Please log in first.");
        return;
      }

      try {
        const response = await axios.get(
          "https://storybook-backend-b3ji.onrender.com/api/stories/authorstories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMyStories(response.data);
      } catch (error) {
        console.error("Error fetching stories:", error);
        setErrorMessage(
          error.response?.data?.message || "Failed to fetch your stories."
        );
      }
    };

    fetchMyStories();
  }, []);

  const handleDeleteNavigation = (storyId) => {
    navigate(`/delete/${storyId}`);
  };

  const toggleComments = (storyId) => {
    setCommentsVisible((prev) => ({
      ...prev,
      [storyId]: !prev[storyId],
    }));
  };

  const updateStoryInList = (updatedStory) => {
    setMyStories((prevStories) =>
      prevStories.map((story) =>
        story._id === updatedStory._id ? updatedStory : story
      )
    );
  };

  const handleEditClick = (storyId) => {
    setSelectedStoryId(storyId);
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setIsEditModalOpen(false);
    setSelectedStoryId(null);
  };

  return (
    <>
      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-center mb-8">My Stories</h1>
        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}

        {myStories.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            No stories available.
          </div>
        ) : (
          <div className="space-y-6">
            {myStories.map((story) => (
              <div
                key={story._id}
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <h2 className="text-xl font-semibold">{story.title}</h2>
                <p className="text-gray-600 mt-2">{story.content}</p>
                <p className="text-gray-800 mt-2">
                  <strong>Author:</strong> {story.author}
                </p>
                <p className="text-gray-600 mt-2">
                  <strong>Likes:</strong> {story.likes || 0}
                </p>
                <p className="text-gray-600 mt-2">
                  <strong>Comments:</strong>{" "}
                  {(story.comments && story.comments.length) || 0}
                </p>

                <div className="mt-4">
                  <button
                    onClick={() => toggleComments(story._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  >
                    {commentsVisible[story._id]
                      ? "Hide Comments"
                      : "View Comments"}
                  </button>
                  {commentsVisible[story._id] && (
                    <div className="mt-4 bg-gray-100 p-4 rounded-lg border">
                      {story.comments && story.comments.length > 0 ? (
                        <ul className="space-y-2">
                          {story.comments.map((comment, index) => (
                            <li key={index} className="text-gray-700">
                              {comment}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">No comments yet.</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center space-x-4">
                  <button
                    onClick={() => handleEditClick(story._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteNavigation(story._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isEditModalOpen && (
        <EditStoriesPage
          storyId={selectedStoryId}
          onClose={closeModal}
          onStoryUpdated={updateStoryInList}
        />
      )}
    </>
  );
};

export default AuthorStoriesPage;
