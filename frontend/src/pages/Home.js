import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Container = styled.div`
  min-height: 100vh;
  background: #191919;
  color: #ffffff;
  font-family: 'Open Sans', sans-serif;
`;

// Hero Section
const HeroSection = styled.section`
  background: url('/images/background.jpg') no-repeat center center;
  background-size: cover;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(25, 25, 25, 0.5);
  }
`;

const HeroContent = styled.div`
  text-align: center;
  max-width: 800px;
  padding: 0 20px;
  position: relative;
  z-index: 2;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 20px;
  font-family: 'Montserrat', sans-serif;
  text-transform: uppercase;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.3rem;
  color: #ffffff;
  margin-bottom: 40px;
  line-height: 1.6;
  font-weight: 300;
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const SecondaryButton = styled(Link)`
  background: transparent;
  color: #F8B742;
  padding: 15px 30px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  text-transform: uppercase;
  border: 2px solid #F8B742;
  transition: all 0.3s ease;
  display: inline-block;

  &:hover {
    background: #F8B742;
    color: #191919;
    transform: translateY(-2px);
  }
`;


const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
  margin-bottom: 20px;
  font-family: 'Montserrat', sans-serif;
  text-transform: uppercase;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;





// Features Section
const FeaturesSection = styled.section`
  padding: 80px 20px;
  background: #191919;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureItem = styled.div`
  text-align: center;
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  color: #F8B742;
  margin-bottom: 20px;
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  color: #ffffff;
  margin-bottom: 15px;
  font-family: 'Montserrat', sans-serif;
  text-transform: uppercase;
`;

const FeatureText = styled.p`
  color: #cccccc;
  line-height: 1.6;
`;

// Horizontal Links Section
const HorizontalLinksSection = styled.div`
  margin-top: 40px;
  padding: 20px 0;
  background: rgba(25, 25, 25, 0.7);
  border-radius: 15px;
  overflow: hidden;
  position: relative;
  width: 100%;
  max-width: none;
  margin-left: -20px;
  margin-right: -20px;
  width: calc(100% + 40px);
`;

const HorizontalLinksContainer = styled.div`
  display: flex;
  animation: scrollHorizontal 80s linear infinite;
  white-space: nowrap;
  width: max-content;
  padding: 0 20px;

  @keyframes scrollHorizontal {
    0% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(-50%);
    }
  }
`;

const LinkItem = styled.a`
  display: inline-block;
  color: #ffffff;
  padding: 12px 20px;
  margin: 0 15px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  border-radius: 8px;
  position: relative;
  border: 1px solid rgba(248, 183, 66, 0.3);
  background: rgba(0, 0, 0, 0.5);

  &:hover {
    color: #F8B742;
    background: rgba(248, 183, 66, 0.1);
    border-color: #F8B742;
    text-decoration: underline;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(248, 183, 66, 0.3);
  }
`;

const NewBadge = styled.span`
  position: absolute;
  top: 8px;
  right: 10px;
  background: #ff4444;
  color: white;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(255, 68, 68, 0.3);
`;

// Footer
const Footer = styled.footer`
  background: #111;
  padding: 60px 20px 30px;
  color: #cccccc;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
`;

const FooterSection = styled.div``;

const FooterTitle = styled.h4`
  color: #F8B742;
  margin-bottom: 20px;
  font-family: 'Montserrat', sans-serif;
  text-transform: uppercase;
`;

const FooterLink = styled(Link)`
  display: block;
  color: #cccccc;
  text-decoration: none;
  margin-bottom: 10px;
  transition: color 0.3s ease;

  &:hover {
    color: #F8B742;
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #333;
  color: #888;
`;


const Home = () => {
  return (
    <Container>
      <Navbar />

      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <HeroTitle>JusticeChain AI – Police, Courts, Citizens. Connected.</HeroTitle>
          <HeroSubtitle>End-to-End AI + Blockchain for Next-Gen Justice.</HeroSubtitle>
          <HeroButtons>
            <SecondaryButton to="/citizen/track-case">Track Case</SecondaryButton>
            <SecondaryButton to="/case-status">Case Status</SecondaryButton>
          </HeroButtons>

          {/* Horizontal Scrolling Links */}
          <HorizontalLinksSection>
            <HorizontalLinksContainer>
              {/* First set of links */}
              <LinkItem href="https://services.ecourts.gov.in/" target="_blank" rel="noopener noreferrer">
                India-level eCourts Services
                <NewBadge>New</NewBadge>
              </LinkItem>
              <LinkItem href="https://ecourts.gov.in/ecourts_home/" target="_blank" rel="noopener noreferrer">
                eCourts Services Portal
                <NewBadge>New</NewBadge>
              </LinkItem>
              <LinkItem href="https://doj.gov.in/" target="_blank" rel="noopener noreferrer">
                eCourt Services (Dept. of Justice)
              </LinkItem>
              <LinkItem href="https://services.ecourts.gov.in/ecourtindia_v6/" target="_blank" rel="noopener noreferrer">
                eCourts National Portal
                <NewBadge>New</NewBadge>
              </LinkItem>
              <LinkItem href="https://main.sci.gov.in/" target="_blank" rel="noopener noreferrer">
                Supreme Court of India
              </LinkItem>
              <LinkItem href="https://karnatakajudiciary.kar.nic.in/" target="_blank" rel="noopener noreferrer">
                Karnataka High Court
                <NewBadge>New</NewBadge>
              </LinkItem>
              <LinkItem href="https://hcservices.ecourts.gov.in/hcservices/" target="_blank" rel="noopener noreferrer">
                Case List Search — Karnataka
              </LinkItem>
              <LinkItem href="https://judgments.ecourts.gov.in/" target="_blank" rel="noopener noreferrer">
                Case & Judgement Search — Karnataka HC
                <NewBadge>New</NewBadge>
              </LinkItem>
              <LinkItem href="https://lawmin.gov.in/" target="_blank" rel="noopener noreferrer">
                Ministry of Law & Justice (India)
              </LinkItem>
              <LinkItem href="https://njdg.ecourts.gov.in/" target="_blank" rel="noopener noreferrer">
                National Judicial Data Grid (NJDG)
                <NewBadge>New</NewBadge>
              </LinkItem>
              {/* Duplicate set for seamless scrolling */}
              <LinkItem href="https://services.ecourts.gov.in/" target="_blank" rel="noopener noreferrer">
                India-level eCourts Services
                <NewBadge>New</NewBadge>
              </LinkItem>
              <LinkItem href="https://ecourts.gov.in/ecourts_home/" target="_blank" rel="noopener noreferrer">
                eCourts Services Portal
                <NewBadge>New</NewBadge>
              </LinkItem>
              <LinkItem href="https://doj.gov.in/" target="_blank" rel="noopener noreferrer">
                eCourt Services (Dept. of Justice)
              </LinkItem>
              <LinkItem href="https://services.ecourts.gov.in/ecourtindia_v6/" target="_blank" rel="noopener noreferrer">
                eCourts National Portal
                <NewBadge>New</NewBadge>
              </LinkItem>
              <LinkItem href="https://main.sci.gov.in/" target="_blank" rel="noopener noreferrer">
                Supreme Court of India
              </LinkItem>
              <LinkItem href="https://karnatakajudiciary.kar.nic.in/" target="_blank" rel="noopener noreferrer">
                Karnataka High Court
                <NewBadge>New</NewBadge>
              </LinkItem>
              <LinkItem href="https://hcservices.ecourts.gov.in/hcservices/" target="_blank" rel="noopener noreferrer">
                Case List Search — Karnataka
              </LinkItem>
              <LinkItem href="https://judgments.ecourts.gov.in/" target="_blank" rel="noopener noreferrer">
                Case & Judgement Search — Karnataka HC
                <NewBadge>New</NewBadge>
              </LinkItem>
              <LinkItem href="https://lawmin.gov.in/" target="_blank" rel="noopener noreferrer">
                Ministry of Law & Justice (India)
              </LinkItem>
              <LinkItem href="https://njdg.ecourts.gov.in/" target="_blank" rel="noopener noreferrer">
                National Judicial Data Grid (NJDG)
                <NewBadge>New</NewBadge>
              </LinkItem>
            </HorizontalLinksContainer>
          </HorizontalLinksSection>
        </HeroContent>
      </HeroSection>

        {/* Features Section */}
        <FeaturesSection>
          <SectionTitle>What Makes JusticeChain Unique?</SectionTitle>
          <FeaturesGrid>
            <FeatureItem>
              <FeatureIcon>🔗</FeatureIcon>
              <FeatureTitle>Immutable Records</FeatureTitle>
              <FeatureText>Blockchain ensures all judicial records are tamper-proof and transparent</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>🧠</FeatureIcon>
              <FeatureTitle>AI Crime & Delay Prediction</FeatureTitle>
              <FeatureText>Machine learning algorithms predict crime patterns and case resolution times</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>💬</FeatureIcon>
              <FeatureTitle>NLP Courtroom Bots</FeatureTitle>
              <FeatureText>Natural language processing for automated legal document analysis</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>🌐</FeatureIcon>
              <FeatureTitle>Web3 Transparency Layer</FeatureTitle>
              <FeatureText>Decentralized verification ensures complete transparency in all processes</FeatureText>
            </FeatureItem>
          </FeaturesGrid>
        </FeaturesSection>



        {/* Footer */}
        <Footer>
          <FooterContent>
            <FooterSection>
              <FooterTitle>JusticeChain AI</FooterTitle>
              <p>Revolutionizing justice through AI and blockchain technology</p>
            </FooterSection>
            <FooterSection>
              <FooterTitle>Quick Links</FooterTitle>
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/services">Services</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
              <FooterLink to="/support">Support</FooterLink>
            </FooterSection>
            <FooterSection>
              <FooterTitle>Legal</FooterTitle>
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
              <FooterLink to="/terms">Terms of Service</FooterLink>
              <FooterLink to="/faq">FAQ</FooterLink>
            </FooterSection>
            <FooterSection>
              <FooterTitle>Connect</FooterTitle>
              <p>Follow us for updates on justice technology</p>
              <div style={{ marginTop: '10px' }}>
                <span style={{ marginRight: '15px', fontSize: '1.5rem' }}>📘</span>
                <span style={{ marginRight: '15px', fontSize: '1.5rem' }}>🐦</span>
                <span style={{ marginRight: '15px', fontSize: '1.5rem' }}>💼</span>
              </div>
            </FooterSection>
          </FooterContent>
          <FooterBottom>
            <p>&copy; 2024 JusticeChain AI. All rights reserved.</p>
          </FooterBottom>
        </Footer>
      </Container>
    );
  };

export default Home;