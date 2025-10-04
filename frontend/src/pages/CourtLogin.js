import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  min-height: 100vh;
  background: url('/images/login.jpg') no-repeat center center;
  background-size: cover;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: 'Inter', sans-serif;
  position: relative;
`;

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 50px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 140, 0, 0.1));
    border-radius: 20px;
    z-index: -1;
  }
`;

const Title = styled.h1`
  color: #ffffff;
  text-align: center;
  margin-bottom: 40px;
  font-family: 'Montserrat', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #ffffff;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  padding: 18px 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  font-size: 16px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:focus {
    outline: none;
    border-color: #ffd700;
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.2);
    background: rgba(255, 255, 255, 0.1);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const Select = styled.select`
  padding: 18px 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:focus {
    outline: none;
    border-color: #ffd700;
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.2);
    background: rgba(255, 255, 255, 0.1);
  }

  option {
    background: #1a1a2e;
    color: #ffffff;
  }
`;

const LoginButton = styled.button`
  background: linear-gradient(135deg, #ffd700, #ff8c00);
  color: #1a1a2e;
  border: none;
  padding: 20px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
  letter-spacing: 1px;

  &:hover {
    background: linear-gradient(135deg, #ffed4e, #ffa726);
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(255, 215, 0, 0.4);
  }
`;

const BackButton = styled.button`
  background: transparent;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
  align-self: flex-start;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: #ffd700;
  }
`;

const Message = styled.p`
  color: #ff6b6b;
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
  background: rgba(255, 107, 107, 0.1);
  padding: 10px;
  border-radius: 8px;
  border: 1px solid rgba(255, 107, 107, 0.3);
`;

const SuccessMessage = styled.p`
  color: #4ade80;
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
  background: rgba(74, 222, 128, 0.1);
  padding: 10px;
  border-radius: 8px;
  border: 1px solid rgba(74, 222, 128, 0.3);
`;

const ToggleButton = styled.button`
  background: transparent;
  color: #ffd700;
  border: 1px solid #ffd700;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
  align-self: center;

  &:hover {
    background: rgba(255, 215, 0, 0.1);
  }
`;

const CourtLogin = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    courtType: '',
    state: '',
    district: '',
    courtName: '',
    designation: '',
    judgeId: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');

  // District data for Indian states
  const stateDistricts = {
    'andhra-pradesh': [
      'Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Krishna', 'Kurnool', 
      'Nellore', 'Prakasam', 'Srikakulam', 'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR Kadapa'
    ],
    'karnataka': [
      'Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban', 'Bidar', 
      'Chamarajanagar', 'Chikballapur', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada', 
      'Davanagere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri', 'Kalaburagi', 'Kodagu', 
      'Kolar', 'Koppal', 'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga', 
      'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayapura', 'Yadgir'
    ],
    'tamil-nadu': [
      'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 
      'Dindigul', 'Erode', 'Kallakurichi', 'Kancheepuram', 'Karur', 'Krishnagiri', 
      'Madurai', 'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 
      'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 
      'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur', 
      'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'
    ],
    'telangana': [
      'Adilabad', 'Bhadradri Kothagudem', 'Hyderabad', 'Jagtial', 'Jangaon', 'Jayashankar Bhupalpally', 
      'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar', 'Khammam', 'Komaram Bheem Asifabad', 'Mahabubabad', 
      'Mahabubnagar', 'Mancherial', 'Medak', 'Medchal-Malkajgiri', 'Mulugu', 'Nagarkurnool', 
      'Nalgonda', 'Narayanpet', 'Nirmal', 'Nizamabad', 'Peddapalli', 'Rajanna Sircilla', 
      'Rangareddy', 'Sangareddy', 'Siddipet', 'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal Rural', 'Warangal Urban', 'Yadadri Bhuvanagiri'
    ],
    'maharashtra': [
      'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 'Buldhana', 
      'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna', 
      'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nandurbar', 
      'Nashik', 'Osmanabad', 'Palghar', 'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 
      'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal'
    ],
    'gujarat': [
      'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 'Bhavnagar', 
      'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhoomi Dwarka', 'Gandhinagar', 
      'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch', 'Mahisagar', 'Mehsana', 
      'Morbi', 'Narmada', 'Navsari', 'Panchmahal', 'Patan', 'Porbandar', 'Rajkot', 
      'Sabarkantha', 'Surat', 'Surendranagar', 'Tapi', 'Vadodara', 'Valsad'
    ],
    'rajasthan': [
      'Ajmer', 'Alwar', 'Banswara', 'Baran', 'Barmer', 'Bharatpur', 'Bhilwara', 'Bikaner', 
      'Bundi', 'Chittorgarh', 'Churu', 'Dausa', 'Dholpur', 'Dungarpur', 'Hanumangarh', 
      'Jaipur', 'Jaisalmer', 'Jalore', 'Jhalawar', 'Jhunjhunu', 'Jodhpur', 'Karauli', 
      'Kota', 'Nagaur', 'Pali', 'Pratapgarh', 'Rajsamand', 'Sawai Madhopur', 'Sikar', 
      'Sirohi', 'Sri Ganganagar', 'Tonk', 'Udaipur'
    ],
    'delhi': [
      'Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi', 
      'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi'
    ],
    'uttar-pradesh': [
      'Agra', 'Aligarh', 'Allahabad', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 
      'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 
      'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 
      'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Faizabad', 'Farrukhabad', 'Fatehpur', 
      'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 
      'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj', 
      'Kanpur Dehat', 'Kanpur Nagar', 'Kanshiram Nagar', 'Kaushambi', 'Kheri', 'Kushinagar', 
      'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau', 
      'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 
      'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur', 
      'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 
      'Unnao', 'Varanasi'
    ]
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Reset district when state changes
    if (name === 'state') {
      setFormData({
        ...formData,
        [name]: value,
        district: '' // Reset district when state changes
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isRegistering) {
      // Registration logic
      if (!formData.name || !formData.email || !formData.courtType || !formData.state || !formData.district || !formData.courtName || !formData.designation || !formData.judgeId || !formData.password || !formData.confirmPassword) {
        setMessage('Please fill in all required fields.');
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setMessage('Passwords do not match.');
        return;
      }
      
      if (formData.password.length < 6) {
        setMessage('Password must be at least 6 characters long.');
        return;
      }

      try {
        setMessage('');
        const result = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'court',
          phone: formData.judgeId,
          state: formData.state,
          district: formData.district,
          courtType: formData.courtType,
          courtName: formData.courtName,
          designation: formData.designation,
          judgeId: formData.judgeId
        });
        
        if (result.success) {
          setMessage('Registration successful! You are now logged in.');
          setTimeout(() => {
            navigate('/court/portal');
          }, 2000);
        } else {
          setMessage(result.error || 'Registration failed. Please try again.');
        }
      } catch (error) {
        console.error('Registration error:', error);
        setMessage('Registration failed. Please try again.');
      }
    } else {
      // Login logic
      if (!formData.email || !formData.password) {
        setMessage('Please fill in all required fields.');
        return;
      }

      try {
        setMessage('');
        const result = await login({
          email: formData.email,
          password: formData.password,
          role: 'court'
        });
        
        if (result.success) {
          navigate('/court/portal');
        } else {
          setMessage(result.error || 'Invalid Judge ID or Password. Please check your credentials and try again.');
        }
      } catch (error) {
        console.error('Login error:', error);
        setMessage('Invalid Judge ID or Password. Please check your credentials and try again, or go back to login.');
      }
    }
  };

  return (
    <Container>
      <LoginCard>
        <BackButton onClick={() => navigate('/login')}>← Back to Login</BackButton>
        <Title>{isRegistering ? 'Court Registration' : 'Court Login'}</Title>
        
        <ToggleButton onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Already have an account? Login' : 'New judge? Register here'}
        </ToggleButton>
        
        <Form onSubmit={handleSubmit}>
          {isRegistering && (
            <FormGroup>
              <Label htmlFor="name">Full Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
          )}

          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="courtType">Court Type</Label>
            <Select
              id="courtType"
              name="courtType"
              value={formData.courtType}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Court Type</option>
              <option value="supreme-court">Supreme Court</option>
              <option value="high-court">High Court</option>
              <option value="district-court">District Court</option>
              <option value="sessions-court">Sessions Court</option>
              <option value="magistrate-court">Magistrate Court</option>
              <option value="family-court">Family Court</option>
              <option value="labour-court">Labour Court</option>
              <option value="consumer-court">Consumer Court</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="state">State</Label>
            <Select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              required
            >
              <option value="">Select State</option>
              <option value="andhra-pradesh">Andhra Pradesh</option>
              <option value="karnataka">Karnataka</option>
              <option value="tamil-nadu">Tamil Nadu</option>
              <option value="telangana">Telangana</option>
              <option value="maharashtra">Maharashtra</option>
              <option value="gujarat">Gujarat</option>
              <option value="rajasthan">Rajasthan</option>
              <option value="delhi">Delhi</option>
              <option value="uttar-pradesh">Uttar Pradesh</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="district">District</Label>
            <Select
              id="district"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              required
            >
              <option value="">Select District</option>
              {formData.state && stateDistricts[formData.state] && 
                stateDistricts[formData.state].map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))
              }
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="courtName">Court Name</Label>
            <Input
              type="text"
              id="courtName"
              name="courtName"
              placeholder="Enter Court Name"
              value={formData.courtName}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          {isRegistering && (
            <FormGroup>
              <Label htmlFor="designation">Designation</Label>
              <Input
                type="text"
                id="designation"
                name="designation"
                placeholder="Enter your designation (e.g., Judge, Magistrate)"
                value={formData.designation}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
          )}

          <FormGroup>
            <Label htmlFor="judgeId">Judge ID / Court Code</Label>
            <Input
              type="text"
              id="judgeId"
              name="judgeId"
              placeholder="Enter Judge ID / Court Code"
              value={formData.judgeId}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          {isRegistering && (
            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
          )}

          <LoginButton type="submit">
            {isRegistering ? 'Register & Login' : 'Login to Court Portal'}
          </LoginButton>
        </Form>
        {message && (message.includes('successful') ? <SuccessMessage>{message}</SuccessMessage> : <Message>{message}</Message>)}
      </LoginCard>
    </Container>
  );
};

export default CourtLogin;