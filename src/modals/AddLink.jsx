import { useState } from "react";

export default function AddLink({ onAdd, onCancel }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !url) {
      setError("Both fields are required.");
      return;
    }
    setError("");
    const newLink = {
      id: Date.now(),
      title,
      url,
      isActive: false,
      status: "Inactive",
    };
    onAdd(newLink);
    setTitle("");
    setUrl("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800/60 z-50">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md bg-white rounded-lg shadow-md p-6 space-y-5"
      >
        {/* Close Button (X) */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* Heading */}
        <h1 className="text-lg font-semibold text-gray-900 mb-4">
          Add New Link
        </h1>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-2 text-sm">
            {error}
          </div>
        )}

        {/* Title Input */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">
            Title
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-black"
            placeholder="My Website"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
        </div>

        {/* URL Input */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">
            URL
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-black"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            type="url"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            type="submit"
            className="px-5 py-2 bg-black w-full text-white text-sm font-medium rounded hover:bg-gray-900 transition"
          >
            Add Link
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-black border-gray-500 border rounded hover:underline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
