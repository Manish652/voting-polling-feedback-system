import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CreatePost from "../components/CreatePost";

export default function NewPost() {
  const navigate = useNavigate();

  const handleCreated = useCallback(() => {
    navigate("/posts");
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Start a new thread</h1>
        <p className="opacity-70">Share updates, ask questions, or start a discussion.</p>
      </div>

      <CreatePost onCreated={handleCreated} />
    </div>
  );
}
