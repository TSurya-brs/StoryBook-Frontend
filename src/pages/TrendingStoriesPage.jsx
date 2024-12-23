import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "./NavBar";

const TrendingPage = () => {
  const [trendingStories, setTrendingStories] = useState([]);
  const [commentsVisible, setCommentsVisible] = useState({});
  const [newComment, setNewComment] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch trending stories
  useEffect(() => {
    const fetchTrendingStories = async () => {
      try {
        const response = await axios.get(
          "https://storybook-backend-b3ji.onrender.com/api/stories/trending"
        );
        setTrendingStories(response.data);
      } catch (error) {
        console.error("Error fetching trending stories:", error);
        setErrorMessage("Failed to fetch trending stories.");
      }
    };

    fetchTrendingStories();
  }, []);

  // Toggle visibility of comments for a story
  const toggleComments = (storyId) => {
    setCommentsVisible((prev) => ({
      ...prev,
      [storyId]: !prev[storyId],
    }));
  };

  // Handle change in the new comment input field
  const handleCommentChange = (storyId, event) => {
    setNewComment((prev) => ({
      ...prev,
      [storyId]: event.target.value,
    }));
  };

  // Handle comment submission for a story
  const handleCommentSubmit = async (storyId) => {
    const comment = newComment[storyId];

    if (!comment || comment.trim() === "") {
      setErrorMessage("Please enter a comment before submitting.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setErrorMessage("You are not logged in. Please log in first.");
        return;
      }

      const response = await axios.post(
        `https://storybook-backend-b3ji.onrender.com/api/stories/${storyId}/comment`,
        { comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the story with new comment
      setTrendingStories((prevStories) =>
        prevStories.map((story) =>
          story._id === storyId
            ? { ...story, comments: [...story.comments, comment] }
            : story
        )
      );

      // Clear the new comment field
      setNewComment((prev) => ({
        ...prev,
        [storyId]: "",
      }));
    } catch (error) {
      console.error("Error submitting comment:", error);
      setErrorMessage("Failed to submit your comment.");
    }
  };

  return (
    <>
      <NavBar />
      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-center mb-8">
          Trending Stories
        </h1>

        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}

        {trendingStories.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            No stories available.
          </div>
        ) : (
          <div className="space-y-6">
            {trendingStories.map((story) => (
              <div
                key={story._id}
                className="bg-white p-6 rounded-lg shadow-lg border border-gray-300"
              >
                <h2 className="text-3xl font-semibold mb-2">{story.title}</h2>
                <p className="text-lg text-gray-1000 mb-4">{story.content}</p>
                <p className="text-sm text-gray-800 mb-2">
                  Author: {story.author}
                </p>
                {/* <div className="flex items-center justify-between mt-4">
                  <span className="text-lg text-gray-800">
                    Likes: {story.likes}
                  </span>
                </div> */}

                {/* Comment Box */}
                <div className="mt-4">
                  <button
                    onClick={() => toggleComments(story._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  >
                    {commentsVisible[story._id]
                      ? "Hide Comments"
                      : "View Comments"}
                  </button>
                  <div className="flex items-center justify-between mt-4">
                    <span></span>
                    <span className="text-lg text-gray-800">
                      Likes: {story.likes}
                    </span>
                  </div>

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

                      {/* Comment Input */}
                      <div className="mt-4 flex">
                        <input
                          type="text"
                          value={newComment[story._id] || ""}
                          onChange={(e) => handleCommentChange(story._id, e)}
                          placeholder="Add a comment"
                          className="p-2 border border-gray-300 rounded-lg w-full"
                        />
                        <button
                          onClick={() => handleCommentSubmit(story._id)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default TrendingPage;
