import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  min-height: 100vh;
  background: url('/images/citizen-bg.jpg') no-repeat center center;
  background-size: cover;
  position: relative;
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
  max-width: 1000px;
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

const SearchCard = styled.div`
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

const SearchForm = styled.form`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  flex: 1;
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
    border-color: #3498db;
    box-shadow: 0 0 20px rgba(52, 152, 219, 0.3);
    background: rgba(255, 255, 255, 0.08);
  }
`;

const SearchButton = styled.button`
  padding: 20px 40px;
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: #ffffff;
  border: none;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(52, 152, 219, 0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(52, 152, 219, 0.4);
    background: linear-gradient(135deg, #2980b9 0%, #21618c 100%);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CaseCard = styled.div`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(25px);
  border-radius: 24px;
  padding: 40px;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;
`;

const CaseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const CaseId = styled.h2`
  color: #3498db;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
`;

const Status = styled.span`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => {
    switch(props.status) {
      case 'filed': return 'rgba(52, 152, 219, 0.2)';
      case 'hearing': return 'rgba(241, 196, 15, 0.2)';
      case 'judgment': return 'rgba(46, 204, 113, 0.2)';
      case 'closed': return 'rgba(149, 165, 166, 0.2)';
      default: return 'rgba(231, 76, 60, 0.2)';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'filed': return '#3498db';
      case 'hearing': return '#f1c40f';
      case 'judgment': return '#2ecc71';
      case 'closed': return '#95a5a6';
      default: return '#e74c3c';
    }
  }};
`;

const CaseDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
`;

const DetailSection = styled.div`
  h3 {
    color: #3498db;
    font-size: 1.2rem;
    margin-bottom: 15px;
    border-bottom: 1px solid rgba(52, 152, 219, 0.3);
    padding-bottom: 5px;
  }
  
  p {
    color: #ffffff;
    margin: 8px 0;
    line-height: 1.6;
  }
`;

const Message = styled.div`
  padding: 15px 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  font-weight: 500;
  text-align: center;
  background: ${props => props.type === 'success' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(255, 107, 107, 0.1)'};
  border: 1px solid ${props => props.type === 'success' ? 'rgba(74, 222, 128, 0.3)' : 'rgba(255, 107, 107, 0.3)'};
  color: ${props => props.type === 'success' ? '#4ade80' : '#ff6b6b'};
`;

const TrackCase = () => {
  const { user } = useAuth();
  const [caseId, setCaseId] = useState('');
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Fetch user's cases on component mount
  useEffect(() => {
    const fetchUserCases = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/casefiles', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setCaseData(data[0]); // Show the most recent case
            setCaseId(data[0].caseNumber);
          }
        }
      } catch (error) {
        console.error('Error fetching user cases:', error);
      }
    };

    if (user) {
      fetchUserCases();
    }
  }, [user]);

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setCaseData(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/casefiles/search/${caseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        setCaseData(data);
        setMessage('Case found successfully!');
        setMessageType('success');
      } else {
        setMessage(data.msg || 'Case not found. Please check your Case ID.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error tracking case:', error);
      setMessage('Network error. Please check your connection and try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Content>
        <Title>🔍 Track Case</Title>
        
        <SearchCard>
          {message && <Message type={messageType}>{message}</Message>}
          
          <SearchForm onSubmit={handleTrack}>
            <SearchInput
              type="text"
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              placeholder="Enter Case ID (e.g., CASE-2024-0001)"
              required
            />
            <SearchButton type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Track Case'}
            </SearchButton>
          </SearchForm>
        </SearchCard>

        {caseData && (
          <CaseCard>
            <CaseHeader>
              <CaseId>{caseData.caseNumber}</CaseId>
              <Status status={caseData.caseStatus}>{caseData.caseStatus}</Status>
            </CaseHeader>
            
            <CaseDetails>
              <DetailSection>
                <h3>Case Information</h3>
                <p><strong>Case Type:</strong> {caseData.caseType}</p>
                <p><strong>Court:</strong> {caseData.courtName}</p>
                <p><strong>Judge:</strong> {caseData.judgeName}</p>
                <p><strong>Public Prosecutor:</strong> {caseData.publicProsecutor}</p>
                <p><strong>Filed Date:</strong> {new Date(caseData.filedDate).toLocaleDateString()}</p>
                {caseData.nextHearingDate && (
                  <p><strong>Next Hearing:</strong> {new Date(caseData.nextHearingDate).toLocaleDateString()}</p>
                )}
              </DetailSection>

              <DetailSection>
                <h3>Case Details</h3>
                <p>{caseData.caseDetails}</p>
              </DetailSection>

              {caseData.charges && caseData.charges.length > 0 && (
                <DetailSection>
                  <h3>Charges</h3>
                  {caseData.charges.map((charge, index) => (
                    <div key={index} style={{ marginBottom: '10px', padding: '10px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
                      <p><strong>Section:</strong> {charge.section}</p>
                      <p><strong>Description:</strong> {charge.description}</p>
                      <p><strong>Punishment:</strong> {charge.punishment}</p>
                    </div>
                  ))}
                </DetailSection>
              )}

              {caseData.accusedDetails && caseData.accusedDetails.length > 0 && (
                <DetailSection>
                  <h3>Accused Details</h3>
                  {caseData.accusedDetails.map((accused, index) => (
                    <div key={index} style={{ marginBottom: '10px', padding: '10px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
                      <p><strong>Name:</strong> {accused.name}</p>
                      <p><strong>Age:</strong> {accused.age}</p>
                      <p><strong>Address:</strong> {accused.address}</p>
                      <p><strong>Phone:</strong> {accused.phone}</p>
                      <p><strong>Status:</strong> {accused.status}</p>
                    </div>
                  ))}
                </DetailSection>
              )}

              {caseData.judgment && (
                <DetailSection>
                  <h3>Judgment</h3>
                  <p><strong>Verdict:</strong> {caseData.judgment.verdict}</p>
                  <p><strong>Sentence:</strong> {caseData.judgment.sentence}</p>
                  {caseData.judgment.fine && (
                    <p><strong>Fine:</strong> ₹{caseData.judgment.fine}</p>
                  )}
                  <p><strong>Judgment Date:</strong> {new Date(caseData.judgment.judgmentDate).toLocaleDateString()}</p>
                  <p><strong>Judgment Text:</strong> {caseData.judgment.judgmentText}</p>
                </DetailSection>
              )}
            </CaseDetails>
          </CaseCard>
        )}
      </Content>
    </Container>
  );
};

export default TrackCase;