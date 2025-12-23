import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";

/**
 * Add a new note
 * @param {string} userId - current user UID
 * @param {string} bookId - ID of the book
 * @param {string} content - note text
 * @param {string} bookTitle - title of the book
 */
export const addNote = async (
  userId,
  bookId,
  content,
  bookTitle = "General"
) => {
  await addDoc(collection(db, "users", userId, "notes"), {
    bookId,
    bookTitle,
    content,
    important: false, // ⭐ NEW FIELD
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

/**
 * Get all notes for a user
 * Ordered by updatedAt (newest first)
 */
export const getNotes = async (userId) => {
  const q = query(
    collection(db, "users", userId, "notes"),
    orderBy("updatedAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    important: docSnap.data().important ?? false, // ✅ backward-safe
    ...docSnap.data(),
  }));
};

/**
 * Update note content
 */
export const updateNote = async (userId, noteId, content) => {
  const noteRef = doc(db, "users", userId, "notes", noteId);
  await updateDoc(noteRef, {
    content,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Toggle Important ⭐
 */
export const toggleImportant = async (userId, noteId, currentValue) => {
  const noteRef = doc(db, "users", userId, "notes", noteId);
  await updateDoc(noteRef, {
    important: !currentValue,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Delete a note
 */
export const deleteNote = async (userId, noteId) => {
  await deleteDoc(doc(db, "users", userId, "notes", noteId));
};