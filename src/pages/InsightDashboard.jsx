// src/pages/InsightDashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  addNote,
  getNotes,
  updateNote,
  deleteNote,
} from "../services/noteService";
import NoteCard from "../components/NoteCard";

export default function InsightDashboard() {
  const { currentUser } = useAuth();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (currentUser) {
      getNotes(currentUser.uid).then(setNotes);
    }
  }, [currentUser]);

  const refreshNotes = async () => {
    const allNotes = await getNotes(currentUser.uid);
    setNotes(allNotes);
  };

  const handleAdd = async () => {
    if (newNote.trim()) {
      await addNote(currentUser.uid, "general", newNote);
      setNewNote("");
      await refreshNotes();
    }
  };

  const handleUpdate = async (id, content) => {
    await updateNote(currentUser.uid, id, content);
    await refreshNotes();
  };

  const handleDelete = async (id) => {
    await deleteNote(currentUser.uid, id);
    await refreshNotes();
  };

  // ✅ Search by content OR book title
  const filteredNotes = notes.filter(
    (n) =>
      n.content.toLowerCase().includes(search.toLowerCase()) ||
      (n.bookTitle && n.bookTitle.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📖 Insight Dashboard</h1>

      {/* Add new insight */}
      <div className="insight-input-group mb-4">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write your insight..."
          className="insight-textarea w-full p-3 border rounded-lg resize-y overflow-auto break-words"
          style={{ minHeight: "100px" }}
        />
        <button
          onClick={handleAdd}
          className="insight-btn mt-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          ➕ Add Insight
        </button>
      </div>

      {/* Search bar */}
      <div className="insight-input-group mb-6">
        <input
          type="text"
          placeholder="Search by book title or insight text..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="insight-search w-full p-3 border rounded-lg break-words"
        />
      </div>

      {/* Insights list */}
      <div className="mt-6 space-y-4">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              className="p-4 bg-white shadow rounded-lg border break-words overflow-hidden"
              style={{ wordWrap: "break-word", overflowWrap: "anywhere" }}
            >
              <NoteCard
                note={note}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500">No insights yet.</p>
        )}
      </div>
    </div>
  );
}