import React from 'react';
import styled from 'styled-components';
import {useNavigate, useLocation} from 'react-router-dom';

const FooterContainer = styled.footer`
  padding: ${({theme}) => theme.spacing.xs} ${({theme}) => theme.spacing.sm};
  background: ${({theme}) => theme.gradients.seaGradient};
  border-top: 1px solid rgba(64, 224, 208, 0.3);
  position: relative;
  z-index: 1;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.9);
  padding: ${({theme}) => theme.spacing.xs};
  border-radius: ${({theme}) => theme.borderRadius};
  backdrop-filter: blur(10px);
`;

const FooterNav = styled.div`
  display: flex;
  gap: ${({theme}) => theme.spacing.xs};
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const FooterLink = styled.div<{ $active: boolean }>`
  padding: ${({theme}) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  background-color: ${({theme, $active}) =>
          $active ? theme.colors.primary : 'rgba(255, 255, 255, 0.8)'
  };
  color: ${({$active, theme}) =>
          $active ? '#ffffff' : theme.colors.text
  };
  border-radius: ${({theme}) => theme.borderRadius};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${({theme}) => theme.spacing.xs};
  font-size: ${({theme}) => theme.fontSizes.small};
  box-shadow: 0 1px 2px rgba(64, 224, 208, 0.2);
  border: 1px solid ${({theme, $active}) =>
          $active ? theme.colors.primary : 'rgba(64, 224, 208, 0.3)'
  };
  transition: ${({theme}) => theme.transitions.default};

  &:hover {
    background-color: ${({theme, $active}) =>
            $active ? theme.colors.primary : theme.colors.secondary
    };
    color: #ffffff;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(64, 224, 208, 0.3);
  }

  @media (max-width: 768px) {
    padding: ${({theme}) => theme.spacing.xs};

    span:last-child {
      display: none;
    }

    span:first-child {
      font-size: 18px;
    }
  }
`;

const FooterLinks: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname;

    const links = [
        {path: '/', icon: '🏠', label: 'Home'},
        {path: '/tech', icon: '📝', label: 'Tech'},
        {path: '/food', icon: '🍔', label: 'Food'},
        {path: '/about', icon: '👤', label: 'About'},
        {path: '/projects', icon: '🚀', label: 'Projects'},
        {path: '/postcards', icon: '💌', label: 'Postcards'},
    ];

    return (
        <FooterContainer>
            <FooterContent>
                <FooterNav>
                    {links.map(link => (
                        <FooterLink
                            key={link.path}
                            $active={path === link.path}
                            onClick={() => navigate(link.path)}
                        >
                            <span role="img" aria-label={link.label}>{link.icon}</span>
                            <span>{link.label}</span>
                        </FooterLink>
                    ))}
                </FooterNav>
            </FooterContent>
        </FooterContainer>
    );
};

export default FooterLinks;