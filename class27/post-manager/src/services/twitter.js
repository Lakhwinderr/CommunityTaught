export async function uploadMedia(file) {
  const formData = new FormData();// Create a new FormData object
  formData.append("media", file);

  const response = await fetch("http://localhost:5000/upload", {
    method: "POST",
    body: formData,
  });

  return await response.json();
}

export async function sendTweet(postText, mediaId) {
  const response = await fetch("http://localhost:5000/tweet", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: postText, mediaId }),
  });

  return await response.json();
}