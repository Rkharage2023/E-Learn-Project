import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import { toast } from "react-toastify";
import { getAllVideoss } from "../services/adminService";

function getYouTubeEmbedUrl(url) {
  if (!url) return "";

  // Already an embed URL
  if (url.includes("/embed/")) return url;

  let videoId = "";

  // Short URL: https://youtu.be/abc123
  if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1].split("?")[0];
  }
  // Standard URL: https://www.youtube.com/watch?v=abc123
  else if (url.includes("watch?v=")) {
    videoId = url.split("watch?v=")[1].split("&")[0];
  }

  return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
}

function PlayVideo() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    loadVideo();
  }, []);

  const loadVideo = async () => {
    const token = sessionStorage.getItem("token");
    const result = await getAllVideoss(token);

    if (result.status === "Success") {
      const found = result.data.find((v) => v.video_id === Number(videoId));
      setVideo(found);
    } else {
      toast.error("Video not found");
    }
  };

  if (!video) {
    return <h4 className="text-center mt-5">Loading...</h4>;
  }

  // ✅ Use the helper instead of the broken split
  const embedUrl = getYouTubeEmbedUrl(video.youtube_url);

  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        <h3 className="text-center mb-3">{video.title}</h3>
        <div className="ratio ratio-16x9">
          <iframe src={embedUrl} title="Video Player" allowFullScreen />
        </div>
        <p className="mt-3 text-center text-muted">{video.description}</p>
      </div>
    </>
  );
}

export default PlayVideo;
