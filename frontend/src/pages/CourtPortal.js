import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Container = styled.div`
  min-height: 100vh;
  background: url('/images/court.jpg') no-repeat center center;
  background-size: cover;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(25, 25, 25, 0.8);
    z-index: 1;
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const TopBanner = styled.div`
  background: white;
  color: black;
  padding: 20px;
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  font-family: 'Montserrat', sans-serif;
  text-transform: uppercase;
  box-shadow: 0 4px 20px rgba(248, 183, 66, 0.3);
`;

const DashboardContainer = styled.div`
  display: flex;
  flex: 1;
`;

const Sidebar = styled.div`
  width: 250px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px 0;
  box-shadow: 2px 0 20px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: 200px;
  }
`;

const SidebarItem = styled.div`
  padding: 15px 20px;
  margin: 5px 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: ${props => props.active ? '#F8B742' : '#ffffff'};
  background: ${props => props.active ? 'rgba(248, 183, 66, 0.1)' : 'transparent'};

  &:hover {
    background: rgba(248, 183, 66, 0.1);
    color: #F8B742;
    transform: translateX(5px);
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 30px;
  overflow-y: auto;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(25px);
  border-radius: 24px;
  padding: 30px;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;
`;

const Title = styled.h2`
  color: #ffffff;
  margin-bottom: 20px;
  font-family: 'Montserrat', sans-serif;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const UploadArea = styled.div`
  border: 2px dashed rgba(248, 183, 66, 0.3);
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #cccccc;
  margin-bottom: 20px;

  &:hover {
    border-color: #F8B742;
    background: rgba(248, 183, 66, 0.05);
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(248, 183, 66, 0.3);
  }
`;

const UploadButton = styled.button`
  background: linear-gradient(135deg, #F8B742 0%, #e67e22 100%);
  color: #191919;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(248, 183, 66, 0.4);
  }
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 20px 0;
  color: #ffffff;

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: #F8B742;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  overflow: hidden;

  th, td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  th {
    background: rgba(248, 183, 66, 0.1);
    color: #ffffff;
    font-weight: 600;
  }

  tr:hover {
    background: rgba(255, 255, 255, 0.02);
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  margin-bottom: 20px;

  &:focus {
    outline: none;
    border-color: #F8B742;
    box-shadow: 0 0 10px rgba(248, 183, 66, 0.3);
  }

  &::placeholder {
    color: #cccccc;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    color: #ffffff;
    font-weight: 500;
  }

  select, input {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.05);
    color: #ffffff;

    &:focus {
      outline: none;
      border-color: #F8B742;
      box-shadow: 0 0 10px rgba(248, 183, 66, 0.3);
    }

    &::placeholder {
      color: #cccccc;
    }
  }
`;

const PredictButton = styled.button`
  background: linear-gradient(135deg, #F8B742 0%, #e67e22 100%);
  color: #191919;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(248, 183, 66, 0.4);
  }
`;

const ResultBox = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
`;

const JudgmentTextArea = styled.textarea`
  width: 100%;
  min-height: 300px;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  margin-bottom: 20px;

  &:focus {
    outline: none;
    border-color: #F8B742;
    box-shadow: 0 0 10px rgba(248, 183, 66, 0.3);
  }

  &::placeholder {
    color: #cccccc;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #F8B742 0%, #e67e22 100%);
  color: #191919;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(248, 183, 66, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SecondaryButton = styled(ActionButton)`
  background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%);
  color: #ffffff;

  &:hover {
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  }
`;

const FormatToolbar = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const FormatButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(248, 183, 66, 0.2);
    border-color: #F8B742;
    color: #F8B742;
  }
`;


const CourtPortal = () => {
  const [activeMenu, setActiveMenu] = useState('upload');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isPublic, setIsPublic] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [caseType, setCaseType] = useState('');
  const [caseYear, setCaseYear] = useState('');
  const [district, setDistrict] = useState('');
  const [prediction, setPrediction] = useState('');
  const [judgmentText, setJudgmentText] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  // Mock data for case records
  const [caseRecords] = useState([
    { caseNo: 'CR-2024-001', parties: 'State vs. John Doe', date: '2024-01-15', status: 'Judgment Delivered', hash: 'abc123...', access: 'Public' },
    { caseNo: 'CR-2024-002', parties: 'State vs. Jane Smith', date: '2024-02-20', status: 'Hearing Scheduled', hash: 'def456...', access: 'Private' },
    { caseNo: 'CR-2024-003', parties: 'State vs. Bob Johnson', date: '2024-03-10', status: 'Judgment Delivered', hash: 'ghi789...', access: 'Public' },
  ]);

  const filteredRecords = caseRecords.filter(record =>
    record.caseNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.parties.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpload = () => {
    if (uploadedFile) {
      alert('Stored on Blockchain Ledger');
      setUploadedFile(null);
    }
  };

  const handlePredict = () => {
    if (caseType && caseYear && district) {
      setPrediction(`Predicted resolution time: ${Math.floor(Math.random() * 60) + 30} days`);
    }
  };

  const handleConnectBlockchain = () => {
    setIsConnected(!isConnected);
    alert(isConnected ? 'Disconnected from Blockchain' : 'Connected to Blockchain successfully!');
  };

  const handlePrint = () => {
    const printContent = judgmentText || 'No judgment text to print';
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Court Judgment</title>
          <style>
            body { font-family: 'Courier New', monospace; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .content { white-space: pre-wrap; line-height: 1.5; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Court Judgment</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="content">${printContent}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleFormatText = (formatType) => {
    const textarea = document.getElementById('judgment-textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = judgmentText.substring(start, end);

    let formattedText = '';
    switch (formatType) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `__${selectedText}__`;
        break;
      case 'uppercase':
        formattedText = selectedText.toUpperCase();
        break;
      case 'lowercase':
        formattedText = selectedText.toLowerCase();
        break;
      default:
        return;
    }

    const newText = judgmentText.substring(0, start) + formattedText + judgmentText.substring(end);
    setJudgmentText(newText);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'upload':
        return (
          <Card>
            <Title>⚖️ Upload Judgment (Blockchain Storage)</Title>

            {/* Text Formatting Toolbar */}
            <FormatToolbar>
              <FormatButton onClick={() => handleFormatText('bold')}>B</FormatButton>
              <FormatButton onClick={() => handleFormatText('italic')}>I</FormatButton>
              <FormatButton onClick={() => handleFormatText('underline')}>U</FormatButton>
              <FormatButton onClick={() => handleFormatText('uppercase')}>AA</FormatButton>
              <FormatButton onClick={() => handleFormatText('lowercase')}>aa</FormatButton>
            </FormatToolbar>

            {/* Judgment Text Area */}
            <JudgmentTextArea
              id="judgment-textarea"
              placeholder="Type your judgment here...&#10;&#10;IN THE COURT OF...&#10;&#10;Case No:&#10;Parties:&#10;&#10;JUDGMENT&#10;&#10;[Enter judgment text here]"
              value={judgmentText}
              onChange={(e) => setJudgmentText(e.target.value)}
            />

            {/* File Upload Area */}
            <UploadArea onClick={() => document.getElementById('judgment-file').click()}>
              {uploadedFile ? `Selected: ${uploadedFile.name}` : 'Click to select judgment file (PDF/DOC) - Optional'}
              <input
                id="judgment-file"
                type="file"
                accept=".pdf,.doc,.docx"
                style={{ display: 'none' }}
                onChange={(e) => setUploadedFile(e.target.files[0])}
              />
            </UploadArea>

            <Checkbox>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              <label>Make public via Web3 Access</label>
            </Checkbox>

            {/* Action Buttons */}
            <ButtonGroup>
              <SecondaryButton onClick={handleConnectBlockchain}>
                🔗 {isConnected ? 'Disconnect' : 'Connect'} Blockchain
              </SecondaryButton>
              <SecondaryButton onClick={handlePrint} disabled={!judgmentText.trim()}>
                🖨️ Print Judgment
              </SecondaryButton>
              <ActionButton onClick={handleUpload} disabled={!uploadedFile && !judgmentText.trim()}>
                📤 Upload to Blockchain
              </ActionButton>
            </ButtonGroup>

            {(uploadedFile || judgmentText.trim()) && (
              <p style={{ marginTop: '10px', color: '#F8B742' }}>
                Case ID will be auto-linked with citizen's FIR record
              </p>
            )}

            {isConnected && (
              <p style={{ marginTop: '10px', color: '#27ae60' }}>
                ✅ Connected to Blockchain Network
              </p>
            )}
          </Card>
        );

      case 'records':
        return (
          <Card>
            <Title>📜 Case Records (Blockchain Viewer)</Title>
            <SearchInput
              type="text"
              placeholder="Search by case number or parties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Table>
              <thead>
                <tr>
                  <th>Case No</th>
                  <th>Parties</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Blockchain Hash</th>
                  <th>Access</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record, index) => (
                  <tr key={index}>
                    <td>{record.caseNo}</td>
                    <td>{record.parties}</td>
                    <td>{record.date}</td>
                    <td>{record.status}</td>
                    <td>{record.hash}</td>
                    <td>{record.access}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        );

      case 'predictor':
        return (
          <Card>
            <Title>⏳ ML Delay Predictor</Title>
            <FormGroup>
              <label>Case Type</label>
              <select value={caseType} onChange={(e) => setCaseType(e.target.value)}>
                <option value="">Select case type</option>
                <option value="criminal">Criminal</option>
                <option value="civil">Civil</option>
                <option value="family">Family</option>
                <option value="property">Property</option>
              </select>
            </FormGroup>
            <FormGroup>
              <label>Case Year</label>
              <input
                type="number"
                placeholder="Enter case year"
                value={caseYear}
                onChange={(e) => setCaseYear(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <label>District</label>
              <select value={district} onChange={(e) => setDistrict(e.target.value)}>
                <option value="">Select district</option>
                <option value="bangalore">Bangalore</option>
                <option value="mysore">Mysore</option>
                <option value="mangalore">Mangalore</option>
                <option value="hubli">Hubli</option>
              </select>
            </FormGroup>
            <PredictButton onClick={handlePredict}>
              Predict Resolution Time
            </PredictButton>
            {prediction && (
              <ResultBox>
                <strong>Prediction Result:</strong><br />
                {prediction}
              </ResultBox>
            )}
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <Container>
      <Navbar />
      <Content>
        <TopBanner>
          Court Portal – AI + Blockchain for Judiciary
        </TopBanner>
        <DashboardContainer>
          <Sidebar>
            <SidebarItem
              active={activeMenu === 'upload'}
              onClick={() => setActiveMenu('upload')}
            >
              ⚖️ Upload Judgment
            </SidebarItem>
            <SidebarItem
              active={activeMenu === 'records'}
              onClick={() => setActiveMenu('records')}
            >
              📜 Case Records
            </SidebarItem>
            <SidebarItem
              active={activeMenu === 'predictor'}
              onClick={() => setActiveMenu('predictor')}
            >
              ⏳ Delay Predictor
            </SidebarItem>
            <SidebarItem onClick={() => alert('Logout functionality')}>
              🚪 Logout
            </SidebarItem>
          </Sidebar>
          <MainContent>
            {renderContent()}
          </MainContent>
        </DashboardContainer>
      </Content>
    </Container>
  );
};

export default CourtPortal;