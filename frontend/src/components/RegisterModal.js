import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  max-height: 90vh;
  overflow-y: auto;

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

const Title = styled.h2`
  color: #ffffff;
  text-align: center;
  margin-bottom: 30px;
  font-family: 'Montserrat', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  padding: 15px 18px;
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
  padding: 15px 18px;
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

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #ffd700, #ff8c00);
  color: #1a1a2e;
  border: none;
  padding: 18px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  letter-spacing: 1px;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #ffed4e, #ffa726);
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(255, 215, 0, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: #ffd700;
  }
`;

const Message = styled.p`
  color: ${props => props.type === 'error' ? '#ff6b6b' : '#4ade80'};
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
  background: ${props => props.type === 'error' ? 'rgba(255, 107, 107, 0.1)' : 'rgba(74, 222, 128, 0.1)'};
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${props => props.type === 'error' ? 'rgba(255, 107, 107, 0.3)' : 'rgba(74, 222, 128, 0.3)'};
`;

const RoleSpecificFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 10px;
`;

const RegisterModal = ({ isOpen, onClose }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'citizen',
    policeStation: '',
    badgeNumber: '',
    courtName: '',
    designation: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      setMessage('Please fill in all required fields.');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setMessage('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    // Role-specific validation
    if (formData.role === 'police' && (!formData.policeStation || !formData.badgeNumber)) {
      setMessage('Police station and badge number are required for police role.');
      setIsLoading(false);
      return;
    }

    if (formData.role === 'court' && (!formData.courtName || !formData.designation)) {
      setMessage('Court name and designation are required for court role.');
      setIsLoading(false);
      return;
    }

    // Prepare registration data
    const registrationData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      role: formData.role
    };

    // Add role-specific fields
    if (formData.role === 'police') {
      registrationData.policeStation = formData.policeStation;
      registrationData.badgeNumber = formData.badgeNumber;
    } else if (formData.role === 'court') {
      registrationData.courtName = formData.courtName;
      registrationData.designation = formData.designation;
    }

    // Register with backend
    const result = await register(registrationData);
    
    if (result.success) {
      setMessage('Registration successful! You are now logged in.');
      setTimeout(() => {
        onClose();
        // Reset form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone: '',
          role: 'citizen',
          policeStation: '',
          badgeNumber: '',
          courtName: '',
          designation: ''
        });
        setMessage('');
      }, 2000);
    } else {
      setMessage(result.error || 'Registration failed. Please try again.');
    }
    
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>Register Account</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Full Name *</Label>
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

          <FormGroup>
            <Label htmlFor="email">Email Address *</Label>
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
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="role">Role *</Label>
            <Select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
            >
              <option value="citizen">Citizen</option>
              <option value="police">Police Officer</option>
              <option value="court">Court Official</option>
            </Select>
          </FormGroup>

          {formData.role === 'police' && (
            <RoleSpecificFields>
              <FormGroup>
                <Label htmlFor="policeStation">Police Station *</Label>
                <Input
                  type="text"
                  id="policeStation"
                  name="policeStation"
                  placeholder="Enter police station name"
                  value={formData.policeStation}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="badgeNumber">Badge Number *</Label>
                <Input
                  type="text"
                  id="badgeNumber"
                  name="badgeNumber"
                  placeholder="Enter badge number"
                  value={formData.badgeNumber}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
            </RoleSpecificFields>
          )}

          {formData.role === 'court' && (
            <RoleSpecificFields>
              <FormGroup>
                <Label htmlFor="courtName">Court Name *</Label>
                <Input
                  type="text"
                  id="courtName"
                  name="courtName"
                  placeholder="Enter court name"
                  value={formData.courtName}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="designation">Designation *</Label>
                <Input
                  type="text"
                  id="designation"
                  name="designation"
                  placeholder="Enter your designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
            </RoleSpecificFields>
          )}

          <FormGroup>
            <Label htmlFor="password">Password *</Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Enter password (min 6 characters)"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
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

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register Account'}
          </SubmitButton>
        </Form>
        {message && <Message type={message.includes('successful') ? 'success' : 'error'}>{message}</Message>}
      </ModalContent>
    </ModalOverlay>
  );
};

export default RegisterModal;
