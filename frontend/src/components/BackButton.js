import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const BackButtonContainer = styled.button`
  position: fixed;
  bottom: 30px;
  left: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00d4ff 0%, #00ff88 100%);
  border: none;
  cursor: pointer;
  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.15),
    0 4px 15px rgba(0, 212, 255, 0.3);
  transition: all 0.3s ease;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow:
      0 12px 35px rgba(0, 0, 0, 0.2),
      0 6px 20px rgba(0, 212, 255, 0.4);
  }

  &:active {
    transform: translateY(-1px) scale(0.98);
  }

  @media (max-width: 768px) {
    bottom: 20px;
    left: 20px;
    width: 50px;
    height: 50px;
  }
`;

const ArrowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M19 12H5M12 19L5 12L12 5"
      stroke="#1a2035"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <BackButtonContainer onClick={handleBack} title="Go Back">
      <ArrowIcon />
    </BackButtonContainer>
  );
};

export default BackButton;