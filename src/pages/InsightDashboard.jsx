import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  addNote,
  getNotes,
  updateNote,
  deleteNote,
} from "../services/noteService";
import NoteCard from "../components/NoteCard"; // ✅ reusable note component

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
      // bookId = "general" if not tied to a specific book
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
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📖 Insight Dashboard</h1>

      {/* Add new insight */}
      <textarea
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        placeholder="Write your insight..."
        className="w-full border p-3 rounded mb-3"
      />
      <button
        onClick={handleAdd}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        ➕ Add Insight
      </button>

      {/* Search bar */}
      <div className="mt-6">
        <input
          type="text"
          placeholder="Search by book title or insight text..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border p-3 rounded"
        />
      </div>

      {/* Insights list */}
      <div className="mt-6">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <div key={note.id} className="mb-4">
              {/* ✅ Show book title */}
              <div className="text-sm text-gray-500 mb-1">
                📖 {note.bookTitle || "Unknown Book"}
              </div>

              <NoteCard
                note={note}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />

              {/* ✅ Timestamp */}
              <div className="text-xs text-gray-400 mt-1">
                Added:{" "}
                {note.createdAt?.toDate?.().toLocaleString?.() || "N/A"}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No insights yet.</p>
        )}
      </div>
    </div>
  );
}