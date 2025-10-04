// UploadDropzone.js
import React, { useRef, useState } from 'react';

export default function UploadDropzone({ onFile }) {
  const fileRef = useRef();
  const [dragOver, setDragOver] = useState(false);

  function handleFiles(files) {
    if (!files || !files.length) return;
    onFile(files[0]);
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        style={{
          border: '2px dashed #888',
          padding: 20,
          borderRadius: 8,
          textAlign: 'center',
          background: dragOver ? '#fafafa' : '#fff',
          cursor: 'pointer'
        }}
        onClick={() => fileRef.current && fileRef.current.click()}
      >
        <p style={{ margin: 0 }}>Drag & Drop image or video here, or click to select</p>
        <small>Supported: .jpg .png .jpeg .mp4 .mov .avi</small>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*,video/*"
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
