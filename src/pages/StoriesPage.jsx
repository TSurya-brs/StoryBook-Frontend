import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "./NavBar";
import { HeartIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";

const StoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get(
          "https://storybook-backend-b3ji.onrender.com/api/stories/list"
        );
        setStories(response.data);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };

    fetchStories();

    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
  }, []);

  const handleLike = async (storyId) => {
    try {
      const response = await axios.post(
        `https://storybook-backend-b3ji.onrender.com/api/stories/${storyId}/like`,
        {
          userId,
        }
      );

      const updatedStories = stories.map((story) =>
        story._id === storyId ? { ...story, likes: response.data.likes } : story
      );

      setStories(updatedStories);
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const handleComment = (story) => {
    setSelectedStory(story);
    setShowComments(true);
  };

  const handleAddComment = async (storyId) => {
    if (newComment.trim()) {
      try {
        await axios.post(
          `https://storybook-backend-b3ji.onrender.com/api/stories/${storyId}/comment`,
          {
            comment: newComment,
          }
        );
        const updatedStories = stories.map((story) =>
          story._id === storyId
            ? { ...story, comments: [...(story.comments || []), newComment] }
            : story
        );
        setStories(updatedStories);
        if (selectedStory && selectedStory._id === storyId) {
          setSelectedStory({
            ...selectedStory,
            comments: [...(selectedStory.comments || []), newComment],
          });
        }
        setNewComment("");
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  return (
    <>
      <div>{<NavBar />}</div>
      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-center mb-8">
          {stories.length === 0 ? "No stories available" : "All Stories"}
        </h1>

        {stories.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            No stories available.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <div
                key={story._id}
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <h2 className="text-3xl font-semibold">Title: {story.title}</h2>
                <p className="text-lg text-gray-1000 mt-2">
                  Story: {story.content}
                </p>
                <p className="text-sm text-gray-800 mt-2">
                  Author: {story.author}
                </p>

                <div className="mt-4 flex items-center space-x-4">
                  <button
                    onClick={() => handleLike(story._id)}
                    className="flex items-center text-blue-500 hover:text-blue-700"
                  >
                    <HeartIcon className="w-6 h-6 mr-2" />
                    <span>{story.likes}</span>
                  </button>

                  <button
                    onClick={() => handleComment(story)}
                    className="flex items-center text-green-500 hover:text-green-700"
                  >
                    <ChatBubbleLeftIcon className="w-6 h-6 mr-2" />
                    <span>{story.comments.length || 0} Comments</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showComments && selectedStory && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
              <h2 className="text-2xl font-semibold mb-4">Comments</h2>

              <div className="space-y-4">
                <ul>
                  {selectedStory.comments &&
                  selectedStory.comments.length > 0 ? (
                    (selectedStory.comments || []).map((comment, index) => (
                      <li key={index} className="text-gray-700">
                        {comment}
                      </li>
                    ))
                  ) : (
                    <li>No comments yet.</li>
                  )}
                </ul>

                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Add a comment"
                ></textarea>
                <button
                  onClick={() => handleAddComment(selectedStory._id)}
                  className="w-full bg-blue-500 text-white p-3 rounded-lg mt-4 hover:bg-blue-600"
                >
                  Add Comment
                </button>
              </div>

              <button
                onClick={() => setShowComments(false)}
                className="mt-4 w-full text-center text-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StoriesPage;
