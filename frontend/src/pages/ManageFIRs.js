import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { useAuth } from '../contexts/AuthContext';

// Keyframes for animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled components
const Container = styled.div`
  min-height: 100vh;
  background: url('/images/police-bg.jpg') no-repeat center center;
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
  animation: ${fadeIn} 0.8s ease-out;
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

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const StyledInput = styled.input`
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

const StyledSelect = styled.select`
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

const StyledTextarea = styled.textarea`
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

const SubmitButton = styled.button`
  padding: 18px 40px;
  background: linear-gradient(135deg, #00d4ff 0%, #3498db 100%);
  color: #ffffff;
  border: none;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(0, 212, 255, 0.3);
  align-self: center;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(0, 212, 255, 0.4);
    background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  }

  &:active {
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 16px 32px;
    font-size: 1rem;
  }
`;

const FloatingButton = styled(Link)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 15px 25px;
  background: linear-gradient(135deg, #F8B742 0%, #e67e22 100%);
  color: #191919;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(248, 183, 66, 0.3);
  z-index: 10;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(248, 183, 66, 0.4);
    background: linear-gradient(135deg, #e67e22 0%, #d35400 100%);
  }

  @media (max-width: 768px) {
    padding: 12px 20px;
    font-size: 0.8rem;
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

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 5px;
`;

const Tab = styled.button`
  flex: 1;
  padding: 15px 20px;
  background: ${props => props.active ? 'rgba(0, 212, 255, 0.2)' : 'transparent'};
  color: ${props => props.active ? '#00d4ff' : '#b8c5d1'};
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 212, 255, 0.1);
    color: #00d4ff;
  }
`;

const CaseIdDisplay = styled.div`
  background: rgba(255, 215, 0, 0.1);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  text-align: center;

  h3 {
    color: #ffd700;
    margin-bottom: 10px;
    font-size: 1.2rem;
  }

  p {
    color: #ffffff;
    font-size: 1.5rem;
    font-weight: 700;
    font-family: 'Courier New', monospace;
  }
`;

const ManageFIRs = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('fir'); // 'fir' or 'case'
  const [formData, setFormData] = useState({
    complaintId: '',
    firDetails: '',
    sections: [],
    accusedDetails: [],
    witnessDetails: [],
    investigationNotes: []
  });
  const [caseFormData, setCaseFormData] = useState({
    firNumber: '',
    caseDetails: '',
    caseType: '',
    judgeName: '',
    publicProsecutor: '',
    charges: [],
    accusedDetails: [],
    nextHearingDate: ''
  });
  const [complaints, setComplaints] = useState([]);
  const [firs, setFirs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [generatedCaseId, setGeneratedCaseId] = useState('');

  // Fetch complaints and FIRs assigned to this police officer
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch complaints
        const complaintsResponse = await fetch('http://localhost:5000/api/complaints', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (complaintsResponse.ok) {
          const complaintsData = await complaintsResponse.json();
          // Filter complaints that are not yet assigned or assigned to this officer
          const availableComplaints = complaintsData.filter(complaint => 
            complaint.status === 'pending' || 
            (complaint.assignedOfficer && complaint.assignedOfficer._id === user?.id)
          );
          setComplaints(availableComplaints);
        }

        // Fetch FIRs
        const firsResponse = await fetch('http://localhost:5000/api/firs', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (firsResponse.ok) {
          const firsData = await firsResponse.json();
          console.log('All FIRs fetched:', firsData);
          
          // Filter FIRs that can be converted to cases (include more statuses)
          const eligibleFirs = firsData.filter(fir => 
            fir.status === 'filed' || 
            fir.status === 'under_investigation' || 
            fir.status === 'chargesheet_filed' ||
            fir.status === 'case_filed'
          );
          
          console.log('Eligible FIRs for case filing:', eligibleFirs);
          
          // If no eligible FIRs found, show all FIRs for debugging
          if (eligibleFirs.length === 0 && firsData.length > 0) {
            console.log('No eligible FIRs found, showing all FIRs for debugging');
            setFirs(firsData);
          } else {
            setFirs(eligibleFirs);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCaseChange = (e) => {
    const { name, value } = e.target;
    setCaseFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSectionsChange = (e) => {
    const sections = e.target.value.split(',').map(section => section.trim()).filter(Boolean);
    setFormData(prev => ({
      ...prev,
      sections
    }));
  };

  const handleChargesChange = (e) => {
    const chargesText = e.target.value;
    const charges = chargesText.split('\n').map(charge => {
      const [section, description, punishment] = charge.split('|').map(s => s.trim());
      return { section, description, punishment };
    }).filter(charge => charge.section);
    
    setCaseFormData(prev => ({
      ...prev,
      charges
    }));
  };

  const handleAccusedChange = (e) => {
    const accusedText = e.target.value;
    const accusedDetails = accusedText.split('\n').map(accused => {
      const [name, age, address, phone] = accused.split('|').map(s => s.trim());
      return { name, age: parseInt(age) || 0, address, phone };
    }).filter(accused => accused.name);
    
    setCaseFormData(prev => ({
      ...prev,
      accusedDetails
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setGeneratedCaseId('');

    try {
      const token = localStorage.getItem('token');
      
      if (activeTab === 'fir') {
        // Submit FIR
        const response = await fetch('http://localhost:5000/api/firs', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...formData,
            policeStation: user?.policeStation
          })
        });

        const data = await response.json();

        if (response.ok) {
          setMessage(`FIR filed successfully! FIR Number: ${data.fir.firNumber}`);
          setMessageType('success');
          // Reset form
          setFormData({
            complaintId: '',
            firDetails: '',
            sections: [],
            accusedDetails: [],
            witnessDetails: [],
            investigationNotes: []
          });
        } else {
          setMessage(data.msg || 'Failed to file FIR. Please try again.');
          setMessageType('error');
        }
      } else {
        // Submit Case - first find FIR by number
        const firResponse = await fetch(`http://localhost:5000/api/firs/search/${caseFormData.firNumber}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!firResponse.ok) {
          setMessage('FIR not found. Please check the FIR number.');
          setMessageType('error');
          setLoading(false);
          return;
        }

        const firData = await firResponse.json();
        
        const response = await fetch('http://localhost:5000/api/casefiles', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...caseFormData,
            firId: firData._id
          })
        });

        const data = await response.json();

        if (response.ok) {
          setGeneratedCaseId(data.caseFile.caseNumber);
          setMessage(`Case filed successfully! Case ID: ${data.caseFile.caseNumber}`);
          setMessageType('success');
          // Reset form
          setCaseFormData({
            firNumber: '',
            caseDetails: '',
            caseType: '',
            judgeName: '',
            publicProsecutor: '',
            charges: [],
            accusedDetails: [],
            nextHearingDate: ''
          });
        } else {
          setMessage(data.msg || 'Failed to file case. Please try again.');
          setMessageType('error');
        }
      }
    } catch (error) {
      console.error('Error submitting:', error);
      setMessage('Network error. Please check your connection and try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <BackButton />
      <Content>
        <Title>Police Case Management</Title>

        <FormCard>
          {message && <Message type={messageType}>{message}</Message>}
          
          {generatedCaseId && (
            <CaseIdDisplay>
              <h3>Generated Case ID</h3>
              <p>{generatedCaseId}</p>
            </CaseIdDisplay>
          )}

          <TabContainer>
            <Tab 
              active={activeTab === 'fir'} 
              onClick={() => setActiveTab('fir')}
            >
              File FIR
            </Tab>
            <Tab 
              active={activeTab === 'case'} 
              onClick={() => setActiveTab('case')}
            >
              File Case
            </Tab>
          </TabContainer>

          <StyledForm onSubmit={handleSubmit}>
            {activeTab === 'fir' ? (
              <>
                <StyledSelect
                  name="complaintId"
                  value={formData.complaintId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Complaint to File FIR</option>
                  {complaints.map((complaint) => (
                    <option key={complaint._id} value={complaint._id}>
                      {complaint.complaintType} - {complaint.citizenName} - {new Date(complaint.createdAt).toLocaleDateString()}
                    </option>
                  ))}
                </StyledSelect>

                <StyledTextarea
                  name="firDetails"
                  value={formData.firDetails}
                  onChange={handleChange}
                  placeholder="Detailed FIR Information (minimum 20 characters)"
                  minLength="20"
                  required
                />

                <StyledInput
                  type="text"
                  name="sections"
                  value={formData.sections.join(', ')}
                  onChange={handleSectionsChange}
                  placeholder="Legal Sections (comma-separated, e.g., IPC 420, IPC 406)"
                  required
                />

                <SubmitButton type="submit" disabled={loading}>
                  {loading ? 'Filing FIR...' : 'File FIR'}
                </SubmitButton>
              </>
            ) : (
              <>
                <StyledInput
                  type="text"
                  name="firNumber"
                  value={caseFormData.firNumber || ''}
                  onChange={handleCaseChange}
                  placeholder="Enter FIR Number (e.g., FIR-2024-0001)"
                  required
                />

                <StyledSelect
                  name="caseType"
                  value={caseFormData.caseType}
                  onChange={handleCaseChange}
                  required
                >
                  <option value="">Select Case Type</option>
                  <option value="criminal">Criminal</option>
                  <option value="civil">Civil</option>
                  <option value="family">Family</option>
                  <option value="commercial">Commercial</option>
                  <option value="constitutional">Constitutional</option>
                </StyledSelect>

                <StyledInput
                  type="text"
                  name="judgeName"
                  value={caseFormData.judgeName}
                  onChange={handleCaseChange}
                  placeholder="Judge Name"
                  required
                />

                <StyledInput
                  type="text"
                  name="publicProsecutor"
                  value={caseFormData.publicProsecutor}
                  onChange={handleCaseChange}
                  placeholder="Public Prosecutor Name"
                  required
                />

                <StyledTextarea
                  name="caseDetails"
                  value={caseFormData.caseDetails}
                  onChange={handleCaseChange}
                  placeholder="Detailed Case Information (minimum 20 characters)"
                  minLength="20"
                  required
                />

                <StyledTextarea
                  name="charges"
                  value={caseFormData.charges.map(charge => 
                    `${charge.section} | ${charge.description} | ${charge.punishment}`
                  ).join('\n')}
                  onChange={handleChargesChange}
                  placeholder="Charges (one per line, format: Section | Description | Punishment)"
                />

                <StyledTextarea
                  name="accusedDetails"
                  value={caseFormData.accusedDetails.map(accused => 
                    `${accused.name} | ${accused.age} | ${accused.address} | ${accused.phone}`
                  ).join('\n')}
                  onChange={handleAccusedChange}
                  placeholder="Accused Details (one per line, format: Name | Age | Address | Phone)"
                />

                <StyledInput
                  type="datetime-local"
                  name="nextHearingDate"
                  value={caseFormData.nextHearingDate}
                  onChange={handleCaseChange}
                  placeholder="Next Hearing Date"
                />

                <SubmitButton type="submit" disabled={loading}>
                  {loading ? 'Filing Case...' : 'File Case & Generate Case ID'}
                </SubmitButton>
              </>
            )}
          </StyledForm>
        </FormCard>

        <FloatingButton to="/crime-identifiers">
          Crime Identifiers
        </FloatingButton>
      </Content>
    </Container>
  );
};

export default ManageFIRs;