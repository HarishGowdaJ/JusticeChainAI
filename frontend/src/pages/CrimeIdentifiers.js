<<<<<<< HEAD
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';

// Keyframes for animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled components
const Container = styled.div`
  min-height: 100vh;
  background: url('/images/citizen-bg.jpg') no-repeat center center;
  background-size: cover;
  position: relative;
  overflow: hidden;
  padding: 120px 20px 80px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    pointer-events: none;
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  animation: ${fadeIn} 0.8s ease-out;
`;

const MainHeading = styled.h1`
  font-size: 2.5rem;
  font-weight: 900;
  color: #ffffff;
  text-align: center;
  margin-bottom: 20px;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5), 0 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 1px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
  margin-bottom: 40px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const UploadGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const UploadBlock = styled.div`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(25px);
  border-radius: 24px;
  padding: 40px;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;

  @media (max-width: 768px) {
    padding: 30px 20px;
  }
`;

const BlockTitle = styled.h3`
  font-size: 1.5rem;
  color: #ffffff;
  margin-bottom: 20px;
  font-weight: 600;
`;

const UploadArea = styled.div`
  border: 3px dashed #00d4ff;
  border-radius: 20px;
  padding: 60px 40px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
  background: rgba(0, 212, 255, 0.05);
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.2);

  &:hover {
    border-color: #3498db;
    background: rgba(0, 212, 255, 0.1);
    box-shadow: 0 0 30px rgba(0, 212, 255, 0.4);
    transform: scale(1.02);
  }

  @media (max-width: 768px) {
    padding: 50px 30px;
  }
`;

const UploadInput = styled.input`
  display: none;
`;

const UploadText = styled.p`
  color: #b8c5d1;
  font-size: 1rem;
  margin: 0;
`;

const MetadataList = styled.ul`
  list-style: none;
  padding: 0;
  text-align: left;
`;

const MetadataItem = styled.li`
  color: #ffffff;
  margin-bottom: 10px;
  font-size: 0.9rem;

  strong {
    color: #00d4ff;
  }
`;

const InfoText = styled.p`
  color: #b8c5d1;
  font-size: 1rem;
  text-align: center;
  margin-top: 40px;
  line-height: 1.6;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const CrimeIdentifiers = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [videoMetadata, setVideoMetadata] = useState(null);
  const [imageMetadata, setImageMetadata] = useState(null);

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      // Simulate metadata extraction
      setVideoMetadata({
        duration: '2:34',
        resolution: '1920x1080',
        aiVerification: 'Verified - No tampering detected'
      });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Simulate metadata extraction
      setImageMetadata({
        dimensions: '1280x720',
        aiTampering: 'No tampering detected'
      });
    }
  };

  return (
    <Container>
      <BackButton />
      <Content>
        <MainHeading>AI-Powered Evidence Analysis for Justice</MainHeading>
        <Title>Upload Crime Evidence</Title>

        <UploadGrid>
          <UploadBlock>
            <BlockTitle>Upload Video</BlockTitle>
            <UploadArea>
              <UploadInput
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                id="video-upload"
              />
              <label htmlFor="video-upload">
                <UploadText>Drag and drop video file here or click to browse</UploadText>
              </label>
            </UploadArea>
            {videoMetadata && (
              <MetadataList>
                <MetadataItem><strong>Duration:</strong> {videoMetadata.duration}</MetadataItem>
                <MetadataItem><strong>Resolution:</strong> {videoMetadata.resolution}</MetadataItem>
                <MetadataItem><strong>AI Verification Status:</strong> {videoMetadata.aiVerification}</MetadataItem>
              </MetadataList>
            )}
          </UploadBlock>

          <UploadBlock>
            <BlockTitle>Upload Image</BlockTitle>
            <UploadArea>
              <UploadInput
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <UploadText>Drag and drop image file here or click to browse</UploadText>
              </label>
            </UploadArea>
            {imageMetadata && (
              <MetadataList>
                <MetadataItem><strong>Dimensions:</strong> {imageMetadata.dimensions}</MetadataItem>
                <MetadataItem><strong>AI Tampering Detection:</strong> {imageMetadata.aiTampering}</MetadataItem>
              </MetadataList>
            )}
          </UploadBlock>
        </UploadGrid>

        <InfoText>
          The metadata displayed below each upload provides AI-powered analysis including file authenticity verification,
          tampering detection, and technical specifications to ensure evidence integrity and admissibility in legal proceedings.
        </InfoText>
      </Content>
    </Container>
  );
};

export default CrimeIdentifiers;
=======
// CrimeIdentifiers.js
import React, { useState } from 'react';
import UploadDropzone from '../components/UploadDropzone';

export default function CrimeIdentifiers() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [specialResult, setSpecialResult] = useState(null);
  const [error, setError] = useState(null);

  async function sendToServer(endpoint, fileToSend) {
    setError(null);
    setSpecialResult(null);
    const form = new FormData();
    form.append('file', fileToSend, fileToSend.name);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || JSON.stringify(data));
      return data;
    } catch (err) {
      setError(err.message || String(err));
      return null;
    }
  }

  async function handleUpload(fileObj) {
    setFile(fileObj);
    setUploading(true);
    setResult(null);
    setError(null);
    setSpecialResult(null);

    // 1) automatic UCF prediction via Node proxy -> FastAPI
    const ucfResp = await sendToServer('/api/anomaly/upload', fileObj);
    if (ucfResp) setResult(ucfResp);
    setUploading(false);
  }

  async function runShoplifting() {
    if (!file) return setError('No file to analyze');
    setUploading(true);
    const resp = await sendToServer('/api/anomaly/shoplifting', file);
    if (resp) setSpecialResult({ type: 'shoplifting', data: resp });
    setUploading(false);
  }

  async function runWeapon() {
    if (!file) return setError('No file to analyze');
    setUploading(true);
    const resp = await sendToServer('/api/anomaly/weapon', file);
    if (resp) setSpecialResult({ type: 'weapon', data: resp });
    setUploading(false);
  }

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', padding: 20 }}>
      <h2>Crime Identifiers — Anomaly Detection</h2>
      <UploadDropzone onFile={handleUpload} />
      {file && (
        <div style={{ marginTop: 12 }}>
          <strong>Selected:</strong> {file.name} ({Math.round(file.size/1024)} KB)
        </div>
      )}

      {uploading && <div style={{ marginTop: 12 }}>Processing... please wait.</div>}

      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}

      {result && (
        <div style={{ marginTop: 16, padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
          <h4>Automatic (UCF) Result</h4>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(result, null, 2)}</pre>

          <div style={{ marginTop: 10 }}>
            <button onClick={runShoplifting} style={{ marginRight: 8 }}>Run Shoplifting Detection</button>
            <button onClick={runWeapon}>Run Weapon Detection</button>
          </div>
        </div>
      )}

      {specialResult && (
        <div style={{ marginTop: 16, padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
          <h4>{specialResult.type === 'shoplifting' ? 'Shoplifting' : 'Weapon'} Detection</h4>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(specialResult.data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
>>>>>>> 30dfe99 (Anomaly1)
