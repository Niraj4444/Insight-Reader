// src/components/NoteCard.jsx
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
    <div className="p-3 rounded-lg shadow mb-3 bg-white">
      {/* 🔹 Book Title */}
      <p className="font-semibold text-blue-700">{note.bookTitle}</p>

      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full border p-2 rounded"
        />
      ) : (
        <p className="mb-1">{note.content}</p>
      )}

      {/* 🔹 Timestamps */}
      <small className="text-gray-500 block">
        Added:{" "}
        {note.createdAt?.seconds
          ? new Date(note.createdAt.seconds * 1000).toLocaleString()
          : ""}
        {note.updatedAt?.seconds &&
          ` | Updated: ${new Date(note.updatedAt.seconds * 1000).toLocaleString()}`}
      </small>

      {/* 🔹 Actions */}
      <div className="flex gap-2 mt-2">
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