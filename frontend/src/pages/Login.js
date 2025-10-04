import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

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
  padding: 60px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 2;

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
  margin-bottom: 50px;
  font-family: 'Montserrat', sans-serif;
  font-size: 3rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
`;

const LoginOption = styled.button`
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 30px 40px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover {
    border-color: #ffd700;
    background: rgba(255, 255, 255, 0.12);
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(255, 215, 0, 0.2);

    &::before {
      left: 100%;
    }
  }
`;

const OptionTitle = styled.h3`
  color: #ffffff;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 10px;
  font-family: 'Montserrat', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const OptionDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
`;

const Icon = styled.div`
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 2rem;
  color: #ffd700;
  opacity: 0.7;
`;

const Login = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <LoginCard>
        <Title>JusticeChain AI</Title>
        <OptionsGrid>
          <LoginOption onClick={() => navigate('/police-login')}>
            <OptionTitle>Police Portal</OptionTitle>
            <OptionDescription>
              Access police dashboard, manage FIRs, evidence locker, and law enforcement tools
            </OptionDescription>
            <Icon>🚔</Icon>
          </LoginOption>

          <LoginOption onClick={() => navigate('/court-login')}>
            <OptionTitle>Court Portal</OptionTitle>
            <OptionDescription>
              Judicial access to case management, AI summarizer, NLP translation, and delay prediction
            </OptionDescription>
            <Icon>⚖️</Icon>
          </LoginOption>

          <LoginOption onClick={() => navigate('/citizen-login')}>
            <OptionTitle>Citizen Portal</OptionTitle>
            <OptionDescription>
              File complaints, track cases, upload evidence, and access citizen services
            </OptionDescription>
            <Icon>👤</Icon>
          </LoginOption>
        </OptionsGrid>
      </LoginCard>
    </Container>
  );
};

export default Login;