import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { addNote, getNotes, updateNote, deleteNote } from "../services/noteService";

function NotesPanel({ bookId, bookTitle }) {
  const { currentUser } = useAuth();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [search, setSearch] = useState("");

  // Load notes for this book
  useEffect(() => {
    if (currentUser) {
      getNotes(currentUser.uid).then((allNotes) => {
        const bookNotes = allNotes.filter((n) => n.bookId === bookId);
        setNotes(bookNotes);
      });
    }
  }, [bookId, currentUser]);

  const refreshNotes = async () => {
    const allNotes = await getNotes(currentUser.uid);
    setNotes(allNotes.filter((n) => n.bookId === bookId));
  };

  const handleAdd = async () => {
    if (!newNote.trim()) return;
    // ✅ Pass bookTitle so Firestore saves it
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

  const filteredNotes = notes.filter((note) =>
    note.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white shadow-lg rounded-xl p-4 flex flex-col h-full">
      <h3 className="text-xl font-semibold mb-3">📝 My Notes for {bookTitle}</h3>

      {/* Search */}
      <input
        type="text"
        placeholder="Search notes..."
        className="w-full border p-2 rounded mb-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Add new note */}
      <textarea
        placeholder={`Write your insight about "${bookTitle}"...`}
        className="w-full border p-2 rounded mb-2"
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
      />
      <button
        onClick={handleAdd}
        className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
      >
        ➕ Add Note
      </button>

      {/* Notes list */}
      <div className="mt-4 flex-1 overflow-y-auto">
        {filteredNotes.length === 0 ? (
          <p className="text-gray-500">No notes yet for this book.</p>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              className="p-2 mb-2 border rounded bg-gray-50 flex justify-between"
            >
              <span>{note.content}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const newContent = prompt("Edit your note:", note.content);
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NotesPanel;