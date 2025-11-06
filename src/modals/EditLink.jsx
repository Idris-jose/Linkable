import { useState } from "react";
import { useEffect } from "react";

export default function EditLink({link, onEdit, onCancel }) {
 const [title, setTitle] = useState("");
const [url, setUrl] = useState("");
const [error, setError] = useState("");




useEffect(() => {
    if (link) {
      setTitle(link.title || "");
      setUrl(link.url || "");
    }
  }, [link]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !url) {
      setError("Both fields are required");
      return;
    }
    onEdit(link.id, { title, url });
    onCancel();
  };

const handleCancel = () => {
  setIsEditOpen(false);
  setError("");
};


  return (
   <div className="fixed inset-0 flex items-center justify-center bg-gray-800/60 z-50">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md bg-white rounded-lg shadow-md p-6 space-y-5"
      >
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h1 className="text-lg font-semibold text-gray-900 mb-4">
          Edit your link
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-2 text-sm">
            {error}
          </div>
        )}

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

        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            type="submit"
            className="px-5 py-2 bg-black w-full text-white text-sm font-medium rounded hover:bg-gray-900 transition"
          >
            Save Changes
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
