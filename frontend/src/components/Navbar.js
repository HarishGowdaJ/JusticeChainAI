import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from './SocketProvider';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: #191919;
  padding: 15px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  color: #F8B742;
  text-transform: uppercase;
  font-family: 'Montserrat', sans-serif;

  @media (max-width: 768px) {
    font-size: 18px;
    gap: 8px;
  }
`;

const JusticeIcon = styled.svg`
  width: 32px;
  height: 32px;

  @media (max-width: 768px) {
    width: 24px;
    height: 24px;
  }
`;

const JusticeIconComponent = () => (
  <JusticeIcon viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L14 8H18L15 11L16 17L12 14L8 17L9 11L6 8H10L12 2Z" fill="#F8B742" stroke="#F8B742" strokeWidth="1"/>
    <path d="M7 21H17V19H7V21Z" fill="#F8B742"/>
  </JusticeIcon>
);

const NavList = styled.ul`
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0;
  align-items: center;

  @media (max-width: 1024px) {
    gap: 15px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled.li``;

const NavLink = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s ease;
  font-family: 'Open Sans', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    color: #191919;
    background: #F8B742;
    transform: translateY(-1px);
  }

  ${props => props.active && `
    color: #191919;
    background: #F8B742;
    font-weight: 600;
  `}
`;


const UserStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-left: 20px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const StatusIcon = styled.div`
  font-size: 18px;
  color: ${props => props.active ? '#F8B742' : '#888'};
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-right: 15px;
`;

const UserName = styled.span`
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
`;

const LogoutButton = styled.button`
  background: transparent;
  color: #ff6b6b;
  border: 1px solid #ff6b6b;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #ff6b6b;
    color: white;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: #F8B742;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenuOverlay = styled.div`
  display: ${props => props.isOpen ? 'block' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 999;
`;

const MobileMenuPanel = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100vh;
  background: #191919;
  padding: 80px 20px 20px;
  transform: translateX(${props => props.isOpen ? '0' : '100%'});
  transition: transform 0.3s ease;
  z-index: 1000;
  overflow-y: auto;
`;

const MobileNavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MobileNavItem = styled.li`
  margin: 0;
`;

const MobileNavLink = styled(Link)`
  display: block;
  color: #ffffff;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  padding: 15px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-family: 'Open Sans', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    color: #191919;
    background: #F8B742;
  }

  ${props => props.active && `
    color: #191919;
    background: #F8B742;
    font-weight: 600;
  `}
`;

const MobileUserSection = styled.div`
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const MobileUserInfo = styled.div`
  color: #ffffff;
  padding: 15px 20px;
  margin-bottom: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
`;

const MobileLogoutButton = styled.button`
  width: 100%;
  background: transparent;
  color: #ff6b6b;
  border: 1px solid #ff6b6b;
  padding: 15px 20px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #ff6b6b;
    color: white;
  }
`;

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { socket } = useSocket();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    // For public routes, check exact match or if it's a public route
    if (['/ai-summarizer', '/nlp-translation', '/upload-evidence', '/delay-predictor'].includes(path)) {
      return location.pathname === path || location.pathname.startsWith(path);
    }
    return location.pathname.startsWith(path);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleMobileLogout = () => {
    logout();
    navigate('/');
    closeMobileMenu();
  };

  return (
    <>
      <Nav>
        <Logo>
          <JusticeIconComponent />
          JusticeChain AI
        </Logo>
        <NavList>
          <NavItem>
            <NavLink to="/" active={isActive('/') ? 'true' : undefined}>
              Home
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/police/manage-firs" active={isActive('/police/manage-firs') ? 'true' : undefined}>
              Police Portal
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/court/portal" active={isActive('/court/portal') ? 'true' : undefined}>
              Court Portal
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/citizen/file-complaint" active={isActive('/citizen/file-complaint') ? 'true' : undefined}>
              Citizen Portal
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/ai-summarizer" active={isActive('/ai-summarizer') ? 'true' : undefined}>
              AI Features
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/nlp-translation" active={isActive('/nlp-translation') ? 'true' : undefined}>
              Support
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/upload-evidence" active={isActive('/upload-evidence') ? 'true' : undefined}>
              About
            </NavLink>
          </NavItem>
          {!user && (
            <NavItem>
              <NavLink to="/login" active={isActive('/login') ? 'true' : undefined}>
                Login
              </NavLink>
            </NavItem>
          )}
        </NavList>

        {user && (
          <LogoutButton onClick={() => { logout(); navigate('/'); }}>
            Logout
          </LogoutButton>
        )}

        <MobileMenuButton onClick={toggleMobileMenu}>
          ☰
        </MobileMenuButton>
      </Nav>

      {/* Mobile Menu Overlay */}
      <MobileMenuOverlay isOpen={isMobileMenuOpen} onClick={closeMobileMenu} />
      
      {/* Mobile Menu Panel */}
      <MobileMenuPanel isOpen={isMobileMenuOpen}>
        <MobileNavList>
          <MobileNavItem>
            <MobileNavLink to="/" active={isActive('/') ? 'true' : undefined} onClick={closeMobileMenu}>
              Home
            </MobileNavLink>
          </MobileNavItem>
          <MobileNavItem>
            <MobileNavLink to="/police/manage-firs" active={isActive('/police/manage-firs') ? 'true' : undefined} onClick={closeMobileMenu}>
              Police Portal
            </MobileNavLink>
          </MobileNavItem>
          <MobileNavItem>
            <MobileNavLink to="/court/portal" active={isActive('/court/portal') ? 'true' : undefined} onClick={closeMobileMenu}>
              Court Portal
            </MobileNavLink>
          </MobileNavItem>
          <MobileNavItem>
            <MobileNavLink to="/citizen/file-complaint" active={isActive('/citizen/file-complaint') ? 'true' : undefined} onClick={closeMobileMenu}>
              Citizen Portal
            </MobileNavLink>
          </MobileNavItem>
          <MobileNavItem>
            <MobileNavLink to="/ai-summarizer" active={isActive('/ai-summarizer') ? 'true' : undefined} onClick={closeMobileMenu}>
              AI Features
            </MobileNavLink>
          </MobileNavItem>
          <MobileNavItem>
            <MobileNavLink to="/nlp-translation" active={isActive('/nlp-translation') ? 'true' : undefined} onClick={closeMobileMenu}>
              Support
            </MobileNavLink>
          </MobileNavItem>
          <MobileNavItem>
            <MobileNavLink to="/upload-evidence" active={isActive('/upload-evidence') ? 'true' : undefined} onClick={closeMobileMenu}>
              About
            </MobileNavLink>
          </MobileNavItem>
          {!user && (
            <MobileNavItem>
              <MobileNavLink to="/login" active={isActive('/login') ? 'true' : undefined} onClick={closeMobileMenu}>
                Login
              </MobileNavLink>
            </MobileNavItem>
          )}
        </MobileNavList>

        {user && (
          <MobileUserSection>
            <MobileUserInfo>
              Welcome, {user.name}
            </MobileUserInfo>
            <MobileLogoutButton onClick={handleMobileLogout}>
              Logout
            </MobileLogoutButton>
          </MobileUserSection>
        )}
      </MobileMenuPanel>
    </>
  );
};

export default Navbar;