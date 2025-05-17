import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Home() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "videos"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setVideos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  return (
    <div className="max-w-md mx-auto">
      {videos.map(video => (
        <div key={video.id} className="my-4">
          <video controls src={video.url} className="w-full rounded-lg" />
          <div className="flex gap-4 mt-2">
            <button>👍 {video.likes || 0}</button>
            <button>💬</button>
          </div>
        </div>
      ))}
    </div>
  );
}
