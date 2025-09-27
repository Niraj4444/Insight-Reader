import { db } from "../firebase";
import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc } from "firebase/firestore";

export const addNote = async (userId, bookId, content) => {
  await addDoc(collection(db, "users", userId, "notes"), {
    bookId,
    content,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

export const getNotes = async (userId) => {
  const q = query(collection(db, "users", userId, "notes"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateNote = async (userId, noteId, content) => {
  const noteRef = doc(db, "users", userId, "notes", noteId);
  await updateDoc(noteRef, { content, updatedAt: new Date() });
};

export const deleteNote = async (userId, noteId) => {
  await deleteDoc(doc(db, "users", userId, "notes", noteId));
};