import React from "react";
import PostCreator from "./components/PostCreator";

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 ">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Welcome to Post Manager! 🎉</h1>
    
      <PostCreator/>
    </div>
  );
}

export default App;