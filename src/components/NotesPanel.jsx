import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

function NotesPanel({ bookId }) {
  const { currentUser } = useAuth();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [search, setSearch] = useState("");

  // 🔹 Load notes from Firestore
  useEffect(() => {
    if (!currentUser || !bookId) return;

    const q = query(
      collection(db, "notes"),
      where("userId", "==", currentUser.uid),
      where("bookId", "==", bookId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, [bookId, currentUser]);

  // 🔹 Add new note
  const addNote = async () => {
    if (!newNote.trim()) return;
    await addDoc(collection(db, "notes"), {
      content: newNote,
      userId: currentUser.uid,
      bookId,
      createdAt: serverTimestamp(),
    });
    setNewNote("");
  };

  // 🔹 Delete note
  const deleteNote = async (id) => {
    await deleteDoc(doc(db, "notes", id));
  };

  // 🔹 Edit note
  const editNote = async (id, newContent) => {
    await updateDoc(doc(db, "notes", id), { content: newContent });
  };

  // 🔹 Filter notes by search
  const filteredNotes = notes.filter((note) =>
    note.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white shadow-lg rounded-xl p-4 flex flex-col h-full">
      <h3 className="text-xl font-semibold mb-3">📝 My Notes</h3>

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
        placeholder="Write your insight..."
        className="w-full border p-2 rounded mb-2"
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
      />
      <button
        onClick={addNote}
        className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
      >
        ➕ Add Note
      </button>

      {/* Notes list */}
      <div className="mt-4 flex-1 overflow-y-auto">
        {filteredNotes.length === 0 ? (
          <p className="text-gray-500">No notes yet.</p>
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
                    if (newContent) editNote(note.id, newContent);
                  }}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteNote(note.id)}
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