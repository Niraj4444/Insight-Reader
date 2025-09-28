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
} from "firebase/firestore";

/**
 * Add a new note
 * @param {string} userId - current user UID
 * @param {string} bookId - ID of the book
 * @param {string} content - note text
 * @param {string} bookTitle - title of the book
 */
export const addNote = async (userId, bookId, content, bookTitle = "General") => {
  await addDoc(collection(db, "users", userId, "notes"), {
    bookId,
    bookTitle,
    content,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

/**
 * Get all notes for a user
 * @param {string} userId - current user UID
 */
export const getNotes = async (userId) => {
  const q = query(collection(db, "users", userId, "notes"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
};

/**
 * Update a note
 * @param {string} userId - current user UID
 * @param {string} noteId - ID of the note
 * @param {string} content - new note text
 */
export const updateNote = async (userId, noteId, content) => {
  const noteRef = doc(db, "users", userId, "notes", noteId);
  await updateDoc(noteRef, {
    content,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Delete a note
 * @param {string} userId - current user UID
 * @param {string} noteId - ID of the note
 */
export const deleteNote = async (userId, noteId) => {
  await deleteDoc(doc(db, "users", userId, "notes", noteId));
};