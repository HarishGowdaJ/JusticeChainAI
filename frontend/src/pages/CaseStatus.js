import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from '../components/Navbar';

const Container = styled.div`
  min-height: 100vh;
  background: #ffffff;
  color: #333;
  font-family: 'Open Sans', sans-serif;
  padding-top: 80px;
`;

const Header = styled.header`
  background: #191919;
  color: #ffffff;
  padding: 20px;
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  font-family: 'Montserrat', sans-serif;
  text-transform: uppercase;
`;

const FiltersSection = styled.section`
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #ddd;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  min-width: 150px;
`;

const TabsSection = styled.section`
  display: flex;
  justify-content: center;
  padding: 10px;
  background: #f8f9fa;
  border-bottom: 1px solid #ddd;
`;

const Tab = styled.button`
  padding: 10px 20px;
  border: none;
  background: ${props => props.active ? '#007bff' : '#e9ecef'};
  color: ${props => props.active ? '#fff' : '#333'};
  cursor: pointer;
  border-radius: 5px 5px 0 0;
  font-weight: 500;
  transition: all 0.3s;

  &:hover {
    background: ${props => props.active ? '#0056b3' : '#dee2e6'};
  }
`;

const MainContent = styled.div`
  display: flex;
  min-height: calc(100vh - 200px);

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.aside`
  width: 250px;
  background: #f8f9fa;
  padding: 20px;
  border-right: 1px solid #ddd;

  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #ddd;
  }
`;

const SidebarButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 15px;
  border: none;
  background: #ffffff;
  color: #333;
  cursor: pointer;
  border-radius: 5px;
  margin-bottom: 10px;
  transition: all 0.3s;
  font-size: 16px;

  &:hover {
    background: #007bff;
    color: #fff;
  }
`;

const ContentArea = styled.main`
  flex: 1;
  padding: 20px;
`;

const FormSection = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 20px;
  margin: 10px 0;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const CaptchaSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 20px 0;
`;

const CaptchaImage = styled.div`
  width: 120px;
  height: 40px;
  background: #f0f0f0;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
  color: #333;
`;

const RefreshButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  font-size: 20px;
  color: #007bff;
`;

const MapPlaceholder = styled.div`
  width: 100%;
  height: 300px;
  background: #f0f0f0;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #666;
  margin-bottom: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const PrimaryButton = styled.button`
  padding: 12px 30px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s;

  &:hover {
    background: #0056b3;
    transform: translateY(-2px);
  }
`;

const SecondaryButton = styled.button`
  padding: 12px 30px;
  background: #6c757d;
  color: #fff;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s;

  &:hover {
    background: #545b62;
    transform: translateY(-2px);
  }
`;

const InstructionsSection = styled.section`
  margin-top: 40px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
`;

const InstructionsTitle = styled.h3`
  margin-bottom: 10px;
  color: #007bff;
`;

const HelpLink = styled.a`
  color: #007bff;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const InstructionsList = styled.ol`
  padding-left: 20px;
`;

const InstructionItem = styled.li`
  margin-bottom: 10px;
  line-height: 1.6;
`;

const districts = {
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool'],
  'Arunachal Pradesh': ['Itanagar', 'Naharlagun'],
  'Assam': ['Guwahati', 'Silchar', 'Dibrugarh'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur'],
  'Chhattisgarh': ['Raipur', 'Bilaspur', 'Korba'],
  'Goa': ['Panaji', 'Margao'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
  'Haryana': ['Chandigarh', 'Faridabad', 'Gurgaon', 'Hisar'],
  'Himachal Pradesh': ['Shimla', 'Manali', 'Dharamshala'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad'],
  'Karnataka': ['Bangalore', 'Mysuru', 'Mangalore', 'Hubli', 'Belgaum'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik'],
  'Manipur': ['Imphal'],
  'Meghalaya': ['Shillong'],
  'Mizoram': ['Aizawl'],
  'Nagaland': ['Kohima'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela'],
  'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'],
  'Sikkim': ['Gangtok'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad'],
  'Tripura': ['Agartala'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Rishikesh'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol'],
  'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi']
};

const CaseStatus = () => {
  const [activeTab, setActiveTab] = useState('party');
  const [activeView, setActiveView] = useState('caseStatus');
  const [selectedState, setSelectedState] = useState('');
  const [formData, setFormData] = useState({
    petitioner: '',
    year: '',
    status: 'pending',
    captcha: '',
    caseType: '',
    caseNumber: '',
    filingNumber: '',
    advocateName: '',
    policeStation: '',
    firNumber: '',
    actName: '',
    sectionNumber: '',
    cnrNumber: '',
    dateOfOrder: '',
    courtComplex: '',
    date: '',
    judgeName: '',
    caveatorName: '',
    state: '',
    district: ''
  });
  const [captchaText, setCaptchaText] = useState('ABC123');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const refreshCaptcha = () => {
    setCaptchaText(Math.random().toString(36).substring(2, 8).toUpperCase());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Search submitted!');
  };

  const handleReset = () => {
    setFormData({
      petitioner: '',
      year: '',
      status: 'pending',
      captcha: '',
      caseType: '',
      caseNumber: '',
      filingNumber: '',
      advocateName: '',
      policeStation: '',
      firNumber: '',
      actName: '',
      sectionNumber: '',
      cnrNumber: '',
      dateOfOrder: '',
      courtComplex: '',
      date: '',
      judgeName: '',
      caveatorName: '',
      state: '',
      district: ''
    });
  };

  return (
    <Container>
      <Navbar />
      <Header>Case Status</Header>

      <FiltersSection>
        <Select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
          <option value="">Select State</option>
          {Object.keys(districts).map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </Select>
        <Select>
          <option>Select District</option>
          {selectedState && districts[selectedState].map(district => (
            <option key={district} value={district}>{district}</option>
          ))}
        </Select>
        <Select>
          <option>Select Court Complex</option>
          <option>Court Complex- Nanjangud</option>
          <option>LawCourtComplex, Mysuru</option>
          <option>Court Complex- KrishnarajaNagar</option>
          <option>Court Complex- Y T.Narasipura</option>
          <option>Court Complex-Hunsur Double Road</option>
          <option>Court Complex, Mysuru</option>
          <option>Court Complex- Heggadadevankote</option>
          <option>ADRCOURT COMPLEX, MYSURU</option>
          <option>CourtComplex- Periyapatna</option>
        </Select>
      </FiltersSection>

      {activeView === 'caseStatus' && (
        <TabsSection>
          <Tab active={activeTab === 'party'} onClick={() => setActiveTab('party')}>Party Name</Tab>
          <Tab active={activeTab === 'case'} onClick={() => setActiveTab('case')}>Case Number</Tab>
          <Tab active={activeTab === 'filing'} onClick={() => setActiveTab('filing')}>Filing Number</Tab>
          <Tab active={activeTab === 'advocate'} onClick={() => setActiveTab('advocate')}>Advocate</Tab>
          <Tab active={activeTab === 'fir'} onClick={() => setActiveTab('fir')}>FIR Number</Tab>
          <Tab active={activeTab === 'act'} onClick={() => setActiveTab('act')}>Act</Tab>
          <Tab active={activeTab === 'type'} onClick={() => setActiveTab('type')}>Case Type</Tab>
        </TabsSection>
      )}

      <MainContent>
        <Sidebar>
          <SidebarButton onClick={() => setActiveView('cnr')}>🔢 CNR Number</SidebarButton>
          <SidebarButton onClick={() => setActiveView('caseStatus')}>📊 Case Status</SidebarButton>
          <SidebarButton onClick={() => setActiveView('courtOrders')}>📋 Court Orders</SidebarButton>
          <SidebarButton onClick={() => setActiveView('causeList')}>📅 Cause List</SidebarButton>
          <SidebarButton onClick={() => setActiveView('caveat')}>⚠️ Caveat Search</SidebarButton>
          <SidebarButton onClick={() => setActiveView('location')}>📍 Location</SidebarButton>
        </Sidebar>

        <ContentArea>
          <FormSection>
            <form onSubmit={handleSubmit}>
              {activeView === 'caseStatus' && activeTab === 'party' && (
                <>
                  <FormGroup>
                    <Label htmlFor="petitioner">Petitioner/Respondent *</Label>
                    <Input
                      type="text"
                      id="petitioner"
                      name="petitioner"
                      placeholder="Enter Petitioner/Respondent"
                      value={formData.petitioner}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="year">Registration Year *</Label>
                    <Input
                      type="text"
                      id="year"
                      name="year"
                      placeholder="Enter Year"
                      value={formData.year}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Case Status</Label>
                    <RadioGroup>
                      <RadioLabel>
                        <input
                          type="radio"
                          name="status"
                          value="pending"
                          checked={formData.status === 'pending'}
                          onChange={handleInputChange}
                        />
                        Pending
                      </RadioLabel>
                      <RadioLabel>
                        <input
                          type="radio"
                          name="status"
                          value="disposed"
                          checked={formData.status === 'disposed'}
                          onChange={handleInputChange}
                        />
                        Disposed
                      </RadioLabel>
                      <RadioLabel>
                        <input
                          type="radio"
                          name="status"
                          value="both"
                          checked={formData.status === 'both'}
                          onChange={handleInputChange}
                        />
                        Both
                      </RadioLabel>
                    </RadioGroup>
                  </FormGroup>
                </>
              )}

              {activeView === 'caseStatus' && activeTab === 'case' && (
                <>
                  <FormGroup>
                    <Label htmlFor="caseType">Case Type *</Label>
                    <Input
                      type="text"
                      id="caseType"
                      name="caseType"
                      placeholder="Enter Case Type"
                      value={formData.caseType}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="year">Year *</Label>
                    <Input
                      type="text"
                      id="year"
                      name="year"
                      placeholder="Enter Year"
                      value={formData.year}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="caseNumber">Case Number *</Label>
                    <Input
                      type="text"
                      id="caseNumber"
                      name="caseNumber"
                      placeholder="Enter Case Number"
                      value={formData.caseNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                </>
              )}

              {activeView === 'caseStatus' && activeTab === 'filing' && (
                <>
                  <FormGroup>
                    <Label htmlFor="filingNumber">Filing Number *</Label>
                    <Input
                      type="text"
                      id="filingNumber"
                      name="filingNumber"
                      placeholder="Enter Filing Number"
                      value={formData.filingNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="year">Year *</Label>
                    <Input
                      type="text"
                      id="year"
                      name="year"
                      placeholder="Enter Year"
                      value={formData.year}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                </>
              )}

              {activeView === 'caseStatus' && activeTab === 'advocate' && (
                <>
                  <FormGroup>
                    <Label htmlFor="advocateName">Advocate Name *</Label>
                    <Input
                      type="text"
                      id="advocateName"
                      name="advocateName"
                      placeholder="Enter Advocate Name"
                      value={formData.advocateName}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="year">Year *</Label>
                    <Input
                      type="text"
                      id="year"
                      name="year"
                      placeholder="Enter Year"
                      value={formData.year}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                </>
              )}

              {activeView === 'caseStatus' && activeTab === 'fir' && (
                <>
                  <FormGroup>
                    <Label htmlFor="policeStation">Police Station *</Label>
                    <Input
                      type="text"
                      id="policeStation"
                      name="policeStation"
                      placeholder="Enter Police Station"
                      value={formData.policeStation}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="firNumber">FIR Number *</Label>
                    <Input
                      type="text"
                      id="firNumber"
                      name="firNumber"
                      placeholder="Enter FIR Number"
                      value={formData.firNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="year">Year *</Label>
                    <Input
                      type="text"
                      id="year"
                      name="year"
                      placeholder="Enter Year"
                      value={formData.year}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                </>
              )}

              {activeView === 'caseStatus' && activeTab === 'act' && (
                <>
                  <FormGroup>
                    <Label htmlFor="actName">Act Name *</Label>
                    <Input
                      type="text"
                      id="actName"
                      name="actName"
                      placeholder="Enter Act Name"
                      value={formData.actName}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="sectionNumber">Section Number *</Label>
                    <Input
                      type="text"
                      id="sectionNumber"
                      name="sectionNumber"
                      placeholder="Enter Section Number"
                      value={formData.sectionNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="year">Year *</Label>
                    <Input
                      type="text"
                      id="year"
                      name="year"
                      placeholder="Enter Year"
                      value={formData.year}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                </>
              )}

              {activeView === 'caseStatus' && activeTab === 'type' && (
                <>
                  <FormGroup>
                    <Label htmlFor="caseType">Case Type *</Label>
                    <Input
                      type="text"
                      id="caseType"
                      name="caseType"
                      placeholder="Enter Case Type"
                      value={formData.caseType}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="year">Year *</Label>
                    <Input
                      type="text"
                      id="year"
                      name="year"
                      placeholder="Enter Year"
                      value={formData.year}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                </>
              )}

              {activeView === 'cnr' && (
                <>
                  <FormGroup>
                    <Label htmlFor="cnrNumber">16-digit CNR Number *</Label>
                    <Input
                      type="text"
                      id="cnrNumber"
                      name="cnrNumber"
                      placeholder="Enter 16-digit CNR Number"
                      value={formData.cnrNumber}
                      onChange={handleInputChange}
                      required
                      maxLength="16"
                    />
                  </FormGroup>
                </>
              )}

              {activeView === 'courtOrders' && (
                <>
                  <FormGroup>
                    <Label htmlFor="caseNumber">Case Number *</Label>
                    <Input
                      type="text"
                      id="caseNumber"
                      name="caseNumber"
                      placeholder="Enter Case Number"
                      value={formData.caseNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="dateOfOrder">Date of Order *</Label>
                    <Input
                      type="date"
                      id="dateOfOrder"
                      name="dateOfOrder"
                      value={formData.dateOfOrder}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                </>
              )}

              {activeView === 'causeList' && (
                <>
                  <FormGroup>
                    <Label htmlFor="courtComplex">Court Complex *</Label>
                    <Input
                      type="text"
                      id="courtComplex"
                      name="courtComplex"
                      placeholder="Enter Court Complex"
                      value={formData.courtComplex}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="judgeName">Judge Name</Label>
                    <Input
                      type="text"
                      id="judgeName"
                      name="judgeName"
                      placeholder="Enter Judge Name (optional)"
                      value={formData.judgeName}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </>
              )}

              {activeView === 'caveat' && (
                <>
                  <FormGroup>
                    <Label htmlFor="caveatorName">Caveator Name *</Label>
                    <Input
                      type="text"
                      id="caveatorName"
                      name="caveatorName"
                      placeholder="Enter Caveator Name"
                      value={formData.caveatorName}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="year">Year *</Label>
                    <Input
                      type="text"
                      id="year"
                      name="year"
                      placeholder="Enter Year"
                      value={formData.year}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                </>
              )}

              {activeView === 'location' && (
                <>
                  <MapPlaceholder>Map Placeholder</MapPlaceholder>

                  <FormGroup>
                    <Label htmlFor="state">State *</Label>
                    <Select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select State</option>
                      {Object.keys(districts).map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </Select>
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="district">District *</Label>
                    <Select
                      id="district"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select District</option>
                      {formData.state && districts[formData.state].map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </Select>
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="courtComplex">Court Complex *</Label>
                    <Select
                      id="courtComplex"
                      name="courtComplex"
                      value={formData.courtComplex}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Court Complex</option>
                      <option>Court Complex- Nanjangud</option>
                      <option>LawCourtComplex, Mysuru</option>
                      <option>Court Complex- KrishnarajaNagar</option>
                      <option>Court Complex- Y T.Narasipura</option>
                      <option>Court Complex-Hunsur Double Road</option>
                      <option>Court Complex, Mysuru</option>
                      <option>Court Complex- Heggadadevankote</option>
                      <option>ADRCOURT COMPLEX, MYSURU</option>
                      <option>CourtComplex- Periyapatna</option>
                    </Select>
                  </FormGroup>
                </>
              )}

              <CaptchaSection>
                <CaptchaImage>{captchaText}</CaptchaImage>
                <RefreshButton onClick={refreshCaptcha} title="Refresh Captcha">🔄</RefreshButton>
                <Input
                  type="text"
                  name="captcha"
                  placeholder="Enter Captcha"
                  value={formData.captcha}
                  onChange={handleInputChange}
                  style={{ flex: 1 }}
                />
              </CaptchaSection>

              <ButtonGroup>
                <PrimaryButton type="submit">Go</PrimaryButton>
                <SecondaryButton type="button" onClick={handleReset}>Reset</SecondaryButton>
              </ButtonGroup>
            </form>
          </FormSection>

          <InstructionsSection>
            <HelpLink href="#">Click here to view help video</HelpLink>
            <InstructionsTitle>How to</InstructionsTitle>
            <InstructionsList>
              <InstructionItem>Select your State, District, and Court Complex from the dropdown menus.</InstructionItem>
              <InstructionItem>Choose the appropriate search tab (Party Name, Case Number, Filing Number, Advocate, FIR Number, Act, Case Type) or use the sidebar for other options (CNR Number, Court Orders, Cause List, Caveat Search, Location).</InstructionItem>
              <InstructionItem>Fill in the required fields for your selected search type.</InstructionItem>
              <InstructionItem>For Case Status searches, select the case status (Pending, Disposed, or Both).</InstructionItem>
              <InstructionItem>Enter the captcha code shown in the image.</InstructionItem>
              <InstructionItem>Click "Go" to search or "Reset" to clear the form.</InstructionItem>
              <InstructionItem>Use the sidebar menu to switch between different search types.</InstructionItem>
            </InstructionsList>
          </InstructionsSection>
        </ContentArea>
      </MainContent>
    </Container>
  );
};

export default CaseStatus;