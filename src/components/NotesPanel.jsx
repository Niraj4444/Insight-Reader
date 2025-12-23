// src/components/NotesPanel.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  addNote,
  getNotes,
  updateNote,
  deleteNote,
  toggleImportant, // ⭐ NEW
} from "../services/noteService";

function NotesPanel({ bookId, bookTitle }) {
  const { currentUser } = useAuth();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [search, setSearch] = useState("");

  // Load notes
  useEffect(() => {
    if (currentUser) {
      getNotes(currentUser.uid).then((allNotes) => {
        setNotes(allNotes.filter((n) => n.bookId === bookId));
      });
    }
  }, [bookId, currentUser]);

  const refreshNotes = async () => {
    const allNotes = await getNotes(currentUser.uid);
    setNotes(allNotes.filter((n) => n.bookId === bookId));
  };

  const handleAdd = async () => {
    if (!newNote.trim()) return;
    await addNote(currentUser.uid, bookId, newNote, bookTitle);
    setNewNote("");
    await refreshNotes();
  };

  const handleUpdate = async (id, content) => {
    await updateNote(currentUser.uid, id, content);
    await refreshNotes();
  };

  const handleDelete = async (id) => {
    await deleteNote(currentUser.uid, id);
    await refreshNotes();
  };

  const handleToggleImportant = async (id, current) => {
    await toggleImportant(currentUser.uid, id, current); // ⭐ NEW
    await refreshNotes();
  };

  const filteredNotes = notes.filter((note) =>
    note.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white shadow-lg rounded-xl p-4 flex flex-col h-full max-w-full">
      <h3 className="text-xl font-semibold mb-3 break-words">
        📝 My Notes for {bookTitle}
      </h3>

      {/* Search */}
      <div className="insight-input-group mb-3">
        <input
          type="text"
          placeholder="Search notes..."
          className="insight-search w-full p-2 border rounded-lg break-words"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Add note */}
      <div className="insight-input-group mb-3">
        <textarea
          placeholder={`Write your insight about "${bookTitle}"...`}
          className="insight-textarea w-full p-3 border rounded-lg resize-y overflow-auto break-words"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          style={{ minHeight: "80px" }}
        />
        <button
          onClick={handleAdd}
          className="insight-btn mt-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          ➕ Add Note
        </button>
      </div>

      {/* Notes list */}
      <div className="mt-4 flex-1 overflow-y-auto space-y-3">
        {filteredNotes.length === 0 ? (
          <p className="text-gray-500">No notes yet for this book.</p>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              className={`p-3 border rounded break-words ${
                note.important
                  ? "bg-yellow-50 border-yellow-300"
                  : "bg-gray-50"
              }`}
              style={{ wordWrap: "break-word", overflowWrap: "anywhere" }}
            >
              <div className="flex justify-between items-start gap-2">
                <span className="whitespace-pre-wrap break-words flex-1">
                  {note.content}
                </span>

                {/* ⭐ Important (kept minimal, non-intrusive) */}
                <button
                  onClick={() =>
                    handleToggleImportant(note.id, note.important)
                  }
                  className="text-xl shrink-0"
                  title="Mark as important"
                  style={{ color: note.important ? "gold" : "#ccc" }}
                >
                  ⭐
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-3 text-sm mt-2">
                <button
                  onClick={() => {
                    const newContent = prompt(
                      "Edit your note:",
                      note.content
                    );
                    if (newContent) handleUpdate(note.id, newContent);
                  }}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>

              <div className="text-xs text-gray-500 mt-1">
                Added: {note.createdAt?.toDate?.().toLocaleString?.() || "N/A"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NotesPanel;