import React, { useState } from 'react';
import styled from 'styled-components';
import BackButton from '../components/BackButton';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  min-height: 100vh;
  background: url('/images/Citizen.jpg') no-repeat center center;
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
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const FormCard = styled.div`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(25px);
  border-radius: 24px;
  padding: 50px;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 30px;

  @media (max-width: 768px) {
    padding: 30px 25px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const Label = styled.label`
  font-size: 1rem;
  color: #ffffff;
  font-weight: 600;
  margin-bottom: 10px;
`;

const Select = styled.select`
  width: 100%;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  color: #ffffff;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00d4ff;
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
    background: rgba(255, 255, 255, 0.08);
  }

  option {
    background: #191919;
    color: #ffffff;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 150px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  color: #ffffff;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: all 0.3s ease;

  &::placeholder {
    color: #b8c5d1;
    opacity: 0.7;
  }

  &:focus {
    outline: none;
    border-color: #ffffff;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.08);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  color: #ffffff;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;

  &::placeholder {
    color: #b8c5d1;
    opacity: 0.7;
  }

  &:focus {
    outline: none;
    border-color: #00d4ff;
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
    background: rgba(255, 255, 255, 0.08);
  }
`;

const Button = styled.button`
  padding: 18px 40px;
  background: navy;
  color: #ffffff;
  border: none;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  align-self: center;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
    background: #000080;
  }

  &:active {
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 16px 32px;
    font-size: 1rem;
  }
`;

const PreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

const Thumbnail = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const Confirmation = styled.div`
  text-align: center;
  color: #ffffff;
  font-size: 1.2rem;
  padding: 20px;
  background: rgba(0, 128, 0, 0.2);
  border-radius: 16px;
  border: 1px solid rgba(0, 128, 0, 0.3);
`;

const FileComplaint = () => {
  const { getToken } = useAuth();
  const [caseType, setCaseType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = getToken();
      console.log('Token:', token ? 'Present' : 'Missing');
      
      // First try without file uploads to isolate the issue
      const formData = new FormData();
      
      formData.append('complaintType', caseType);
      formData.append('description', description);
      formData.append('location', location);
      formData.append('incidentDate', incidentDate);
      
      // Only add files if they exist
      if (files.length > 0) {
        files.forEach((file, index) => {
          formData.append('evidence', file);
        });
      }

      console.log('Submitting complaint:', { caseType, description, location, incidentDate, filesCount: files.length });

      const response = await fetch('http://localhost:5000/api/complaints', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      console.log('Response status:', response.status);
      
      let data;
      try {
        data = await response.json();
        console.log('Response data:', data);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError);
        const text = await response.text();
        console.log('Response text:', text);
        setError('Server returned invalid response. Please try again.');
        return;
      }

      if (response.ok) {
        setSubmitted(true);
      } else {
        setError(data.msg || data.errors?.[0]?.msg || 'Failed to submit complaint. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Container>
        <BackButton />
        <Content>
          <Title>File a Complaint – JusticeChain AI</Title>
          <FormCard>
            <Confirmation>
              <p>Complaint filed successfully.</p>
            </Confirmation>
          </FormCard>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton />
      <Content>
        <Title>File a Complaint – JusticeChain AI</Title>
        <FormCard>
          <Form onSubmit={handleSubmit}>
            <div>
              <Label>⚖️ Case Type</Label>
              <Select value={caseType} onChange={(e) => setCaseType(e.target.value)} required>
                <option value="">Select Case Type</option>
                <option value="criminal">Criminal Case</option>
                <option value="civil">Civil Case</option>
                <option value="other">Other</option>
              </Select>
            </div>
            <div>
              <Label>📝 Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your complaint in detail" required />
            </div>
            <div>
              <Label>📍 Location</Label>
              <Input 
                type="text" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                placeholder="Where did the incident occur?" 
                required 
              />
            </div>
            <div>
              <Label>📅 Incident Date</Label>
              <Input 
                type="date" 
                value={incidentDate} 
                onChange={(e) => setIncidentDate(e.target.value)} 
                required 
              />
            </div>
            <div>
              <Label>📷 Upload Evidence (Optional)</Label>
              <Input type="file" multiple accept="image/*,.pdf,.doc,.docx" onChange={handleFileChange} />
              {files.length > 0 && (
                <PreviewContainer>
                  {files.map((file, index) => (
                    <Thumbnail key={index} src={URL.createObjectURL(file)} alt={`Preview ${index + 1}`} />
                  ))}
                </PreviewContainer>
              )}
            </div>
            {error && (
              <div style={{ color: '#ff6b6b', marginBottom: '20px', textAlign: 'center' }}>
                {error}
              </div>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </Button>
          </Form>
        </FormCard>
      </Content>
    </Container>
  );
};

export default FileComplaint;