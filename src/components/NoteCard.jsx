import React, { useState } from "react";

export default function NoteCard({ note, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(note.content);

  const handleSave = () => {
    onUpdate(note.id, editedContent);
    setIsEditing(false);
  };

  return (
    <div className="p-3 rounded-lg shadow mb-3 bg-white">
      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full border p-2 rounded"
        />
      ) : (
        <p>{note.content}</p>
      )}

      <div className="flex gap-2 mt-2">
        {isEditing ? (
          <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={handleSave}>
            Save
          </button>
        ) : (
          <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        )}
        <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => onDelete(note.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}