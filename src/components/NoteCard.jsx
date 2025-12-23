import React, { useState } from "react";

export default function NoteCard({
  note,
  onUpdate,
  onDelete,
  onToggleImportant, // ⭐ added (logic only)
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(note.content);

  const handleSave = () => {
    if (editedContent.trim()) {
      onUpdate(note.id, editedContent);
      setIsEditing(false);
    }
  };

  return (
    <div className="p-4 rounded-lg shadow bg-white mb-4 relative">
      {/* ⭐ Important (NO layout change) */}
      <button
        onClick={() => onToggleImportant(note.id, note.important)}
        title="Mark Important"
        className="absolute top-2 right-2 text-lg"
        style={{
          color: note.important ? "gold" : "#ccc",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        ⭐
      </button>

      {/* Book Title (UNCHANGED) */}
      <p className="font-semibold text-blue-700 mb-1 pr-6">
        📖 {note.bookTitle || "📝 General Note"}
      </p>

      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full border p-2 rounded mb-2"
        />
      ) : (
        <p className="mb-2 whitespace-pre-wrap break-words">
          {note.content}
        </p>
      )}

      {/* Timestamps (UNCHANGED) */}
      <small className="text-gray-500 block mb-2">
        Added:{" "}
        {note.createdAt?.seconds
          ? new Date(note.createdAt.seconds * 1000).toLocaleString()
          : ""}
        {note.updatedAt?.seconds &&
          ` | Updated: ${new Date(
            note.updatedAt.seconds * 1000
          ).toLocaleString()}`}
      </small>

      {/* Actions (UNCHANGED) */}
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