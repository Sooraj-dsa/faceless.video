import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/router';

export default function Upload() {
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleUpload = async () => {
    if (!video) return;
    setUploading(true);
    
    try {
      // Upload to Firebase Storage
      const storageRef = ref(storage, `videos/${Date.now()}.mp4`);
      await uploadBytes(storageRef, video);
      const url = await getDownloadURL(storageRef);

      // Save to Firestore
      await addDoc(collection(db, "videos"), {
        url,
        likes: 0,
        timestamp: serverTimestamp()
      });

      router.push('/');
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
      <input 
        type="file" 
        accept="video/*" 
        onChange={(e) => setVideo(e.target.files[0])} 
        className="mb-4"
      />
      <button 
        onClick={handleUpload} 
        disabled={uploading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}
