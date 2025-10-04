import React from 'react';
import styled, { keyframes } from 'styled-components';
import BackButton from '../components/BackButton';

// Keyframes for animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
`;

// Styled components
const Container = styled.div`
  min-height: 100vh;
  background: url('/images/citizen-bg.jpg') no-repeat center center;
  background-size: cover;
  position: relative;
  overflow: hidden;
  padding: 120px 10px 80px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    pointer-events: none;
  }
`;

const Content = styled.div`
  width: 100%;
  position: relative;
  z-index: 2;
  animation: ${fadeIn} 0.8s ease-out;
  padding: 0 10px;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #00d4ff 0%, #3498db 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  margin-bottom: 20px;
  text-shadow: 0 0 40px rgba(0, 212, 255, 0.3);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  color: #e2e8f0;
  text-align: center;
  margin-bottom: 60px;
  line-height: 1.7;
  opacity: 0.9;
  width: 100%;
  padding: 0 20px;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const AboutGrid = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 60px;
  overflow-x: auto;
  padding: 20px 0;
  justify-content: center;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    overflow-x: visible;
    padding: 10px 0;
  }
`;

const AboutCard = styled.div`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(25px);
  border-radius: 20px;
  padding: 25px;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  animation: ${slideIn} 0.6s ease-out;
  min-width: 300px;
  max-width: 350px;
  flex: 1;

  &:hover {
    transform: translateY(-5px);
    box-shadow:
      0 30px 60px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.12);
  }

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.4s;
  }

  &:nth-child(4) {
    animation-delay: 0.6s;
  }

  @media (max-width: 768px) {
    min-width: auto;
    max-width: none;
    width: 100%;
  }
`;

const CardIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 20px;
  text-align: center;
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 15px;
  text-align: center;
`;

const CardText = styled.p`
  font-size: 1rem;
  color: #cbd5e1;
  line-height: 1.6;
  text-align: center;
`;

const MissionSection = styled.div`
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 50px 30px;
  text-align: center;
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 40px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 30px 20px;
  }
`;

const MissionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const MissionText = styled.p`
  font-size: 1.2rem;
  color: #e2e8f0;
  line-height: 1.8;
  margin: 0;
  opacity: 0.9;
  width: 100%;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 25px;
  margin-top: 60px;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-top: 40px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 25px;
  text-align: center;
  box-shadow:
    0 15px 30px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    background: rgba(255, 255, 255, 0.12);
  }
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #00d4ff 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #cbd5e1;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TeamSection = styled.div`
  margin-bottom: 60px;
`;

const TeamTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const TeamCard = styled.div`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(25px);
  border-radius: 20px;
  padding: 30px 20px;
  text-align: center;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow:
      0 30px 60px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.12);
  }
`;

const TeamImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 0 auto 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  border: 3px solid rgba(255, 255, 255, 0.2);
  object-fit: cover;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  }
`;

const TeamName = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
`;

const TeamRole = styled.div`
  font-size: 0.95rem;
  color: #06b6d4;
  font-weight: 600;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TeamBio = styled.p`
  font-size: 0.9rem;
  color: #cbd5e1;
  line-height: 1.5;
`;

const About = () => {
  return (
    <Container>
      <BackButton />
      <Content>
        <Title>About JusticeChain AI</Title>
        <Subtitle>
          Revolutionizing justice through blockchain technology and artificial intelligence
        </Subtitle>

        <AboutGrid>
          <AboutCard>
            <CardIcon>⚖️</CardIcon>
            <CardTitle>Blockchain Security</CardTitle>
            <CardText>
              Immutable case records and evidence storage ensuring tamper-proof judicial proceedings
            </CardText>
          </AboutCard>

          <AboutCard>
            <CardIcon>🤖</CardIcon>
            <CardTitle>AI-Powered Analysis</CardTitle>
            <CardText>
              Advanced machine learning algorithms for case prediction, evidence verification, and legal research
            </CardText>
          </AboutCard>

          <AboutCard>
            <CardIcon>🚀</CardIcon>
            <CardTitle>Smart Contracts</CardTitle>
            <CardText>
              Automated judicial processes and transparent case management through smart contract technology
            </CardText>
          </AboutCard>

          <AboutCard>
            <CardIcon>🌐</CardIcon>
            <CardTitle>Decentralized Access</CardTitle>
            <CardText>
              Secure, transparent access to judicial information for citizens, lawyers, and judicial authorities
            </CardText>
          </AboutCard>
        </AboutGrid>

        <MissionSection>
          <MissionTitle>Our Mission</MissionTitle>
          <MissionText>
            To create a transparent, efficient, and accessible justice system by leveraging cutting-edge
            blockchain technology and artificial intelligence. We aim to eliminate corruption, reduce
            case backlogs, and ensure fair trials for every citizen through innovative digital solutions.
          </MissionText>
        </MissionSection>

        <TeamSection>
          <TeamTitle>Meet Our Team</TeamTitle>
          <TeamGrid>
            <TeamCard>
              <TeamImage src="/images/Veekshitha.jpg" alt="Veekshitha K" />
              <TeamName>Veekshitha K</TeamName>
              <TeamRole>Blockchain Developer</TeamRole>
              <TeamBio>
                Skilled in smart contracts and decentralized applications with a focus on secure blockchain solutions.
              </TeamBio>
            </TeamCard>

            <TeamCard>
              <TeamImage src="/images/Aditya.jpg" alt="Aditya A S" />
              <TeamName>Aditya A S</TeamName>
              <TeamRole>Backend & ML Developer</TeamRole>
              <TeamBio>
                Specializes in backend architecture, databases, and integrating AI/ML models for scalable systems.
              </TeamBio>
            </TeamCard>

            <TeamCard>
              <TeamImage src="/images/Harish.jpg" alt="Harish Gowda J" />
              <TeamName>Harish Gowda J</TeamName>
              <TeamRole>Frontend, AI & ML Developer</TeamRole>
              <TeamBio>
                Expert in modern UI/UX design, frontend frameworks, and applying AI/ML for intelligent user experiences.
              </TeamBio>
            </TeamCard>

            <TeamCard>
              <TeamImage src="/images/Shreya.jpg" alt="Shreya SR" />
              <TeamName>Shreya SR</TeamName>
              <TeamRole>Backend & ML Developer</TeamRole>
              <TeamBio>
                Focused on building robust backend systems and developing AI/ML algorithms for advanced analytics.
              </TeamBio>
            </TeamCard>

            <TeamCard>
              <TeamImage src="/images/Jayanth.jpg" alt="Jayanth KJ" />
              <TeamName>Jayanth KJ</TeamName>
              <TeamRole>Blockchain Developer</TeamRole>
              <TeamBio>
                Proficient in blockchain infrastructure and smart contract development for decentralized platforms.
              </TeamBio>
            </TeamCard>
          </TeamGrid>
        </TeamSection>

        <StatsGrid>
          <StatCard>
            <StatNumber>10K+</StatNumber>
            <StatLabel>Cases Processed</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>99.9%</StatNumber>
            <StatLabel>Data Accuracy</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>24/7</StatNumber>
            <StatLabel>System Uptime</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>50+</StatNumber>
            <StatLabel>Courts Connected</StatLabel>
          </StatCard>
        </StatsGrid>
      </Content>
    </Container>
  );
};

export default About;