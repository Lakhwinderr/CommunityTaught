import React, { useState } from "react";
import { sendPost } from "../services/api";
import { sendTweet, uploadMedia } from "../services/twitter"; // Import the Twitter API function
function PostCreator() {
  const [postText, setPostText] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [posts, setPosts] = useState([]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile)); // Generate preview
  };

  const handlePostSubmit = async () => {
    if (!postText && !file) return alert("Please add text or media before posting.");

    const newPost = { text: postText, file: preview };
    setPosts([...posts, newPost]); // Add new post to the list
    sendPost(newPost) // Send post to the server
      .then((response) => {
        console.log("Post sent successfully:", response);
      })
      .catch((error) => {
        console.error("Error sending post:", error);
      });
    // Reset fields after submission
    setPostText("");
    setFile(null);
    setPreview(null);
  };

  const handleTwitterPostSubmit = async () => {
    if (!postText && !file) return alert("Please add text or media before posting.");
    let mediaId = null;
    if (file) {
      const uploadResponse = await uploadMedia(file);
      mediaId = uploadResponse.mediaId;
    }

    try {
      const response = await sendTweet(postText, mediaId);
            // Send post to Twitter);
      console.log("Post sent to Twitter successfully:", response);
    } catch (error) {
      console.error("Error sending post to Twitter:", error);
    }
    setPostText("");
    setFile(null);
    setPreview(null);
  }

return (
    <div className="max-w-lg min-w-[500px] p-6 bg-white shadow-md rounded-md ">
        <h2 className="text-xl font-bold mb-4">Create a Post</h2>
        <textarea
            className="w-full p-3 border rounded-md mt-2"
            placeholder="Write your post here..."
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
        />
        <label className="mt-3 block">
            <span className="text-gray-700">Attach a file:</span>
            <input
                type="file"
                accept="image/*, video/*"
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                onChange={handleFileChange}
            />
        </label>
        
        
        {(preview || postText) && (
            <div className="mt-3 border border-black p-2 rounded-md">
                <h3 className="text-lg font-semibold text-gray-900">Preview:</h3>
                <p className="mt-2 text-gray-800">{postText}</p>
                {preview && <img src={preview} alt="preview" className="w-full rounded-md" />}
            </div>
        )}
        <button
            className="mt-3 mr-3 px-4 py-2 bg-red-600 text-white rounded-md"
            onClick={() => {
                setFile(null);
                setPreview(null);
                document.querySelector('input[type="file"]').value = "";
            }}
        >
            Delete File
        </button>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md" onClick={handleTwitterPostSubmit}>
            Post to Twitter
        </button>
        <div className="mt-6">
        <h3 className="text-lg font-semibold">Previous Posts:</h3>
        {posts.map((post, index) => (
          <div key={index} className="mt-3 p-3 border rounded-md">
            <p>{post.text}</p>
            {post.file && <img src={post.file} alt="posted media" className="w-full rounded-md mt-2" />}
          </div>
        ))}
      </div>

    </div>
);
}

export default PostCreator;
