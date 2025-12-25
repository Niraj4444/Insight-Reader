// src/pages/ReadingHistoryPage.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, orderBy, query, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function ReadingHistoryPage() {
  const { currentUser } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

  useEffect(() => {
    if (!currentUser) return;

    const fetchProgressWithBookData = async () => {
      try {
        const progressRef = collection(db, 'users', currentUser.uid, 'readingProgress');
        const q = query(progressRef, orderBy('lastUpdated', 'desc'));
        const snapshot = await getDocs(q);

        const data = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const progressData = docSnap.data();
            const bookRef = doc(db, 'books', progressData.bookId);
            const bookSnap = await getDoc(bookRef);
            const bookData = bookSnap.exists() ? bookSnap.data() : {};

            return {
              id: docSnap.id,
              ...progressData,
              bookTitle: bookData.title || progressData.bookTitle,
              bookImage: bookData.coverImageURL || '/images/placeholder.jpg',
            };
          })
        );

        setHistory(data);
      } catch (err) {
        console.error('Error fetching reading progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressWithBookData();
  }, [currentUser]);

  if (!currentUser) return <div>Please login to view your reading history.</div>;
  if (loading) return <div>Loading history...</div>;
  if (history.length === 0) return <div>No reading history yet.</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#b91c1c' }}>
        📚 My Reading History
      </h2>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {history.map((item) => (
          <li
            key={item.id}
            style={{
              background: '#f5f5f5',
              color: '#111',
              marginBottom: '12px',
              padding: '12px',
              borderRadius: '8px',
              display: 'flex',
              gap: '12px',
              alignItems: 'center'
            }}
          >
            <img
              src={item.bookImage}
              alt={item.bookTitle}
              style={{
                width: '50px',
                height: '70px',
                objectFit: 'cover',
                borderRadius: '4px'
              }}
            />

            <div style={{ lineHeight: '1.4' }}>
              <Link
                to={`/read/${item.bookId}`}
                style={{
                  fontWeight: 'bold',
                  fontSize: '16px',
                  color: '#b91c1c',
                  textDecoration: 'none'
                }}
              >
                {item.bookTitle}
              </Link>

              <p style={{ margin: '4px 0' }}>
                Progress: {item.currentPage}/{item.totalPages} pages ({item.progress || 0}%)
              </p>

              <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
                Status: {item.status} | Last Updated:{' '}
                {item.lastUpdated?.toDate().toLocaleString() || 'N/A'}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}