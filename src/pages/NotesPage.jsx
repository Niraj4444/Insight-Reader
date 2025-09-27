import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { addNote, getNotes, updateNote, deleteNote } from "../services/noteService";
import NoteCard from "../components/NoteCard"; // new component

export default function NotesPage() {
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

  const filteredNotes = notes.filter((n) =>
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Notes</h1>

      {/* Add new note */}
      <textarea
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        placeholder="Write your insight..."
        className="w-full border p-2 rounded mb-2"
      />
      <button
        onClick={handleAdd}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Note
      </button>

      {/* Search bar */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      {/* Notes list */}
      <div className="mt-4">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p className="text-gray-500">No notes found.</p>
        )}
      </div>
    </div>
  );
}