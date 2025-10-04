import React from 'react';
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
  background: url('/images/police-bg.jpg') no-repeat center center;
  background-size: cover;
  position: relative;
  overflow: hidden;
  padding: 120px 20px 80px;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  animation: ${fadeIn} 0.8s ease-out;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  margin-bottom: 20px;
  text-shadow: 0 0 30px rgba(231, 76, 60, 0.3);

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #b8c5d1;
  text-align: center;
  margin-bottom: 60px;
  line-height: 1.6;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0 20px;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(25px);
  border-radius: 24px;
  padding: 40px 30px;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;

  &:hover {
    transform: translateY(-10px);
    box-shadow:
      0 30px 60px rgba(0, 0, 0, 0.15),
      0 0 40px rgba(231, 76, 60, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 768px) {
    padding: 30px 25px;
  }
`;

const StatIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(231, 76, 60, 0.3);
`;

const StatTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 15px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const StatValue = styled.p`
  font-size: 1.1rem;
  color: #b8c5d1;
  line-height: 1.6;
  margin: 0;
`;

const ActionContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
`;

const ActionLink = styled(Link)`
  display: inline-block;
  padding: 16px 32px;
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: #ffffff;
  text-decoration: none;
  border-radius: 30px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(231, 76, 60, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(231, 76, 60, 0.4);
    background: linear-gradient(135deg, #c0392b 0%, #a93226 100%);
  }

  @media (max-width: 768px) {
    padding: 14px 28px;
    font-size: 1rem;
  }
`;

const Dashboard = () => {
  return (
    <Container>
      <BackButton />
      <Content>
        <Title>Police Dashboard</Title>
        <Subtitle>AI Crime Prediction Dashboard - View hotspots and patterns from FIR data.</Subtitle>

        <StatsContainer>
          <StatCard>
            <StatIcon>
              <svg width="35" height="35" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#ffffff"/>
              </svg>
            </StatIcon>
            <StatTitle>Crime Hotspots</StatTitle>
            <StatValue>High crime areas: Downtown, Sector 5</StatValue>
          </StatCard>

          <StatCard>
            <StatIcon>
              <svg width="35" height="35" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3V21H21V3H3ZM19 19H5V5H19V19Z" fill="#ffffff"/>
                <path d="M7 7H17V9H7V7ZM7 11H17V13H7V11ZM7 15H13V17H7V15Z" fill="#ffffff"/>
              </svg>
            </StatIcon>
            <StatTitle>Prediction Patterns</StatTitle>
            <StatValue>Theft increase by 20% in next week</StatValue>
          </StatCard>
        </StatsContainer>

        <ActionContainer>
          <ActionLink to="/police/manage-firs">
            Manage FIRs & Cases
          </ActionLink>
          <ActionLink to="/police/evidence-locker">
            Evidence Locker
          </ActionLink>
        </ActionContainer>
      </Content>
    </Container>
  );
};
// 
export default Dashboard;