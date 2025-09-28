import React, { useState } from "react";

export default function NoteCard({ note, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(note.content);

  const handleSave = () => {
    if (editedContent.trim()) {
      onUpdate(note.id, editedContent);
      setIsEditing(false);
    }
  };

  return (
    <div className="p-4 rounded-lg shadow bg-white mb-4">
      {/* Book Title (with fallback for general notes) */}
      <p className="font-semibold text-blue-700 mb-1">
        📖 {note.bookTitle || "📝 General Note"}
      </p>

      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full border p-2 rounded mb-2"
        />
      ) : (
        <p className="mb-2">{note.content}</p>
      )}

      {/* Timestamps */}
      <small className="text-gray-500 block mb-2">
        Added:{" "}
        {note.createdAt?.seconds
          ? new Date(note.createdAt.seconds * 1000).toLocaleString()
          : ""}
        {note.updatedAt?.seconds &&
          ` | Updated: ${new Date(note.updatedAt.seconds * 1000).toLocaleString()}`}
      </small>

      {/* Actions */}
      <div className="flex gap-2">
        {isEditing ? (
          <button
            className="bg-green-500 text-white px-3 py-1 rounded"
            onClick={handleSave}
          >
            Save
          </button>
        ) : (
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        )}
        <button
          className="bg-red-500 text-white px-3 py-1 rounded"
          onClick={() => onDelete(note.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}