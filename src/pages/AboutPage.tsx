import React, {useState} from 'react';
import styled, {keyframes, createGlobalStyle} from 'styled-components';

const AboutFontStyle = createGlobalStyle`
  @font-face {
    font-family: 'AboutCustomFont';
    src: url('/fonts/PlaypenSans-VariableFont_wght.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const pulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  50% {
    box-shadow: 0 0 0 20px rgba(59, 130, 246, 0);
  }
`;

const AboutContainer = styled.div`
  font-family: 'AboutCustomFont', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({theme}) => theme.spacing.md};
  min-height: 100vh;
  background: ${({theme}) => theme.gradients.contentBackground};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 50%, ${({theme}) => `${theme.colors.primary}20`} 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, ${({theme}) => `${theme.colors.purple}20`} 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, ${({theme}) => `${theme.colors.emerald}20`} 0%, transparent 50%);
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: ${({theme}) => theme.spacing.sm};
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const AboutHeader = styled.header`
  text-align: center;
  margin-bottom: ${({theme}) => theme.spacing.lg};
  padding: ${({theme}) => theme.spacing.lg};
  background: ${({theme}) => `${theme.colors.background}E6`};
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid ${({theme}) => `${theme.colors.primary}30`};
  box-shadow: 0 8px 32px ${({theme}) => `${theme.colors.primary}15`},
  inset 0 1px 0 ${({theme}) => `${theme.colors.primary}20`};
  animation: ${fadeInUp} 0.8s ease-out;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg,
    transparent,
    ${({theme}) => `${theme.colors.primary}10`},
    transparent);
    animation: ${shimmer} 3s infinite;
  }

  @media (max-width: 768px) {
    padding: ${({theme}) => theme.spacing.md};
    margin-bottom: ${({theme}) => theme.spacing.md};
  }
`;

const ProfileImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${({theme}) => theme.gradients.seaGradient};
  margin: 0 auto ${({theme}) => theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 40px ${({theme}) => `${theme.colors.primary}30`},
  0 0 0 4px ${({theme}) => `${theme.colors.primary}30`},
  0 0 100px ${({theme}) => `${theme.colors.primary}25`};
  overflow: hidden;
  position: relative;
  animation: ${float} 6s ease-in-out infinite;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg,
    transparent,
    ${({theme}) => `${theme.colors.primary}10`},
    transparent);
    animation: ${shimmer} 4s infinite;
  }

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

const Name = styled.h1`
  color: ${({theme}) => theme.colors.text};
  margin-bottom: ${({theme}) => theme.spacing.md};
  font-size: 2rem;
  font-weight: 700;
  text-shadow: 0 2px 10px ${({theme}) => `${theme.colors.primary}30`};

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const InterestsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({theme}) => theme.spacing.md};
  margin-top: ${({theme}) => theme.spacing.sm};
`;

const InterestGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({theme}) => theme.spacing.xs};
`;

const InterestLabel = styled.span`
  color: ${({theme}) => theme.colors.primary};
  font-weight: 600;
  margin-bottom: ${({theme}) => theme.spacing.xs};
`;

const PrimaryInterestLabel = styled(InterestLabel)`
  font-size: 1.1rem;
`;

const SecondaryInterestLabel = styled(InterestLabel)`
  font-size: 0.95rem;
  color: ${({theme}) => theme.colors.secondary};
  font-weight: 500;
`;

const InterestTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({theme}) => theme.spacing.xs};
  justify-content: center;
`;

const InterestTag = styled.span`
  background: ${({theme}) => `${theme.colors.primary}20`};
  color: ${({theme}) => theme.colors.text};
  padding: ${({theme}) => theme.spacing.xs} ${({theme}) => theme.spacing.sm};
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid ${({theme}) => `${theme.colors.primary}30`};
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: ${({theme}) => `${theme.colors.primary}30`};
    transform: translateY(-1px);
  }
`;

const PrimaryInterestTags = styled(InterestTags)``;

const SecondaryInterestTags = styled(InterestTags)``;

const SecondaryInterestTag = styled(InterestTag)`
  background: ${({theme}) => `${theme.colors.secondary}15`};
  border: 1px solid ${({theme}) => `${theme.colors.secondary}25`};
  font-size: 0.8rem;

  &:hover {
    background: ${({theme}) => `${theme.colors.secondary}25`};
  }
`;

const TechSection = styled.section`
  margin-bottom: ${({theme}) => theme.spacing.lg};
  padding: ${({theme}) => theme.spacing.lg};
  background: ${({theme}) => `${theme.colors.background}E6`};
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid ${({theme}) => `${theme.colors.purple}30`};
  box-shadow: 0 8px 32px ${({theme}) => `${theme.colors.purple}15`};
  animation: ${fadeInUp} 0.8s ease-out;
  animation-fill-mode: both;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  animation-delay: 0.1s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px ${({theme}) => `${theme.colors.purple}25`};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: ${({theme}) => theme.gradients.purpleGradient};
    opacity: 0.1;
    animation: ${shimmer} 4s infinite;
  }

  @media (max-width: 768px) {
    padding: ${({theme}) => theme.spacing.md};
    margin-bottom: ${({theme}) => theme.spacing.md};
  }
`;

const LinksSection = styled.section`
  margin-bottom: ${({theme}) => theme.spacing.lg};
  padding: ${({theme}) => theme.spacing.lg};
  background: ${({theme}) => `${theme.colors.background}E6`};
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid ${({theme}) => `${theme.colors.emerald}30`};
  box-shadow: 0 8px 32px ${({theme}) => `${theme.colors.emerald}15`};
  animation: ${fadeInUp} 0.8s ease-out;
  animation-fill-mode: both;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  animation-delay: 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px ${({theme}) => `${theme.colors.emerald}25`};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: ${({theme}) => theme.gradients.socialGradient};
    opacity: 0.1;
    animation: ${shimmer} 5s infinite;
  }

  @media (max-width: 768px) {
    padding: ${({theme}) => theme.spacing.md};
    margin-bottom: ${({theme}) => theme.spacing.md};
  }
`;

const SectionTitle = styled.h3`
  color: ${({theme}) => theme.colors.text};
  margin-bottom: ${({theme}) => theme.spacing.md};
  padding-bottom: ${({theme}) => theme.spacing.xs};
  border-bottom: 2px solid ${({theme}) => `${theme.colors.purple}30`};
  font-size: 1.3rem;
  font-weight: 600;
  text-shadow: 0 2px 5px ${({theme}) => `${theme.colors.purple}20`};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 50px;
    height: 2px;
    background: ${({theme}) => theme.colors.purple};
  }
`;

const LinksSectionTitle = styled(SectionTitle)`
  border-bottom: 2px solid ${({theme}) => `${theme.colors.emerald}30`};
  text-shadow: 0 2px 5px ${({theme}) => `${theme.colors.emerald}20`};

  &::after {
    background: ${({theme}) => theme.colors.emerald};
  }
`;

const SkillGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({theme}) => theme.spacing.md};
  margin-top: ${({theme}) => theme.spacing.md};

  @media (max-width: 768px) {
    gap: ${({theme}) => theme.spacing.sm};
  }
`;

const BackendSkillCategory = styled.div`
  padding: ${({theme}) => theme.spacing.md};
  background: ${({theme}) => `${theme.colors.background}B3`};
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid ${({theme}) => `${theme.colors.indigo}30`};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 15px 30px ${({theme}) => `${theme.colors.indigo}25`};
    background: ${({theme}) => `${theme.colors.background}CC`};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({theme}) => theme.gradients.techGradient};
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  @media (max-width: 768px) {
    padding: ${({theme}) => theme.spacing.sm};
  }
`;

const DatabaseSkillCategory = styled(BackendSkillCategory)`
  border: 1px solid ${({theme}) => `${theme.colors.orange}30`};

  &:hover {
    box-shadow: 0 15px 30px ${({theme}) => `${theme.colors.orange}25`};
  }

  &::before {
    background: ${({theme}) => theme.gradients.orangeGradient};
  }
`;

const DevOpsSkillCategory = styled(BackendSkillCategory)`
  border: 1px solid ${({theme}) => `${theme.colors.rose}30`};

  &:hover {
    box-shadow: 0 15px 30px ${({theme}) => `${theme.colors.rose}25`};
  }

  &::before {
    background: ${({theme}) => theme.gradients.pinkGradient};
  }
`;

const OthersSkillCategory = styled(BackendSkillCategory)`
  border: 1px solid ${({theme}) => `${theme.colors.emerald}30`};

  &:hover {
    box-shadow: 0 15px 30px ${({theme}) => `${theme.colors.emerald}25`};
  }

  &::before {
    background: ${({theme}) => theme.gradients.socialGradient};
  }
`;

const SkillTitle = styled.h4`
  color: ${({theme}) => theme.colors.text};
  margin-bottom: ${({theme}) => theme.spacing.sm};
  font-size: 1.1rem;
  font-weight: 600;
  text-shadow: 0 1px 3px ${({theme}) => `${theme.colors.primary}30`};
`;

const SkillList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SkillItem = styled.li`
  padding: ${({theme}) => theme.spacing.xs} 0;
  color: ${({theme}) => `${theme.colors.text}E6`};
  display: flex;
  align-items: center;
  font-weight: 400;
  font-size: 0.95rem;
  transition: all 0.2s ease;

  &:hover {
    color: ${({theme}) => theme.colors.text};
    transform: translateX(5px);
  }

  &::before {
    content: '◆';
    margin-right: ${({theme}) => theme.spacing.sm};
    color: ${({theme}) => theme.colors.secondary};
    font-size: 0.8rem;
    transition: all 0.2s ease;
  }

  &:hover::before {
    color: ${({theme}) => theme.colors.primary};
    transform: scale(1.2);
  }
`;

const ContactInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({theme}) => theme.spacing.md};
  margin-top: ${({theme}) => theme.spacing.md};
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({theme}) => theme.spacing.sm};
  padding: ${({theme}) => theme.spacing.md};
  background: ${({theme}) => `${theme.colors.background}B3`};
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid ${({theme}) => `${theme.colors.emerald}30`};
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px ${({theme}) => `${theme.colors.emerald}25`};
    background: ${({theme}) => `${theme.colors.background}CC`};
  }

  @media (max-width: 768px) {
    padding: ${({theme}) => theme.spacing.sm};
  }
`;

const ContactIcon = styled.div`
  font-size: 1.5rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({theme}) => theme.gradients.socialGradient};
  border-radius: 12px;
  backdrop-filter: blur(10px);
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
`;

const ContactText = styled.div`
  color: ${({theme}) => `${theme.colors.text}E6`};
  flex: 1;
  font-size: 0.95rem;

  strong {
    color: ${({theme}) => theme.colors.text};
    font-weight: 600;
    display: block;
    margin-bottom: 2px;
    text-shadow: 0 1px 3px ${({theme}) => `${theme.colors.emerald}30`};
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: all 0.2s ease;

    &:hover {
      color: ${({theme}) => theme.colors.emerald};
    }
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const CopyButton = styled.button`
  background: ${({theme}) => theme.gradients.socialGradient};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px ${({theme}) => `${theme.colors.emerald}30`};
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${({theme}) => `${theme.colors.emerald}40`};
    animation: ${pulse} 2s infinite;
  }

  &:active {
    transform: translateY(0);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
`;

const CopyFeedback = styled.div<{ $show: boolean }>`
  position: absolute;
  top: -40px;
  right: 0;
  background: ${({theme}) => theme.colors.success};
  color: ${({theme}) => theme.colors.background};
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
  opacity: ${({$show}) => $show ? 1 : 0};
  transform: ${({$show}) => $show ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.8)'};
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  pointer-events: none;
  z-index: 10;
  box-shadow: 0 4px 15px ${({theme}) => `${theme.colors.success}30`};

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    right: 20px;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid ${({theme}) => theme.colors.success};
  }
`;

const AboutPage: React.FC = () => {
    const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

    const handleCopy = async (text: string, key: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedStates(prev => ({...prev, [key]: true}));
            setTimeout(() => {
                setCopiedStates(prev => ({...prev, [key]: false}));
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <>
            <AboutFontStyle/>
            <AboutContainer>
                <ContentWrapper>
                    <AboutHeader>
                        <ProfileImage>
                            <img width={120} src={'/images/profile.PNG'} alt="Profile Image"/>
                        </ProfileImage>
                        <Name>Backend Developer</Name>

                        <InterestsContainer>
                            <InterestGroup>
                                <PrimaryInterestLabel>Professional Focus</PrimaryInterestLabel>
                                <PrimaryInterestTags>
                                    <InterestTag>Backend Architecture</InterestTag>
                                    <InterestTag>XaaS</InterestTag>
                                    <InterestTag>Blockchain</InterestTag>
                                    <InterestTag>Secure Coding</InterestTag>
                                </PrimaryInterestTags>
                            </InterestGroup>

                            <InterestGroup>
                                <SecondaryInterestLabel>Personal Interests</SecondaryInterestLabel>
                                <SecondaryInterestTags>
                                    <SecondaryInterestTag>3D Modeling</SecondaryInterestTag>
                                    <SecondaryInterestTag>Q#</SecondaryInterestTag>
                                    <SecondaryInterestTag>Table tennis 🏓</SecondaryInterestTag>
                                </SecondaryInterestTags>
                            </InterestGroup>
                        </InterestsContainer>
                    </AboutHeader>

                    <TechSection>
                        <SectionTitle>Tech Stack</SectionTitle>
                        <SkillGrid>
                            <BackendSkillCategory>
                                <SkillTitle>Backend</SkillTitle>
                                <SkillList>
                                    <SkillItem>Go</SkillItem>
                                    <SkillItem>TypeScript / Node.js / NestJS</SkillItem>
                                    <SkillItem>Java / Spring Boot</SkillItem>
                                </SkillList>
                            </BackendSkillCategory>
                            <DatabaseSkillCategory>
                                <SkillTitle>Database</SkillTitle>
                                <SkillList>
                                    <SkillItem>PostgreSQL</SkillItem>
                                    <SkillItem>MongoDB</SkillItem>
                                    <SkillItem>Redis</SkillItem>
                                </SkillList>
                            </DatabaseSkillCategory>
                            <DevOpsSkillCategory>
                                <SkillTitle>DevOps</SkillTitle>
                                <SkillList>
                                    <SkillItem>Kubernetes</SkillItem>
                                    <SkillItem>AWS / DigitalOcean</SkillItem>
                                </SkillList>
                            </DevOpsSkillCategory>
                            <OthersSkillCategory>
                                <SkillTitle>Others</SkillTitle>
                                <SkillList>
                                    <SkillItem>React</SkillItem>
                                </SkillList>
                            </OthersSkillCategory>
                        </SkillGrid>
                    </TechSection>

                    <LinksSection>
                        <LinksSectionTitle>🔗 Links</LinksSectionTitle>
                        <ContactInfo>
                            <ContactItem>
                                <CopyFeedback $show={copiedStates['github'] || false}>Copied!</CopyFeedback>
                                <ContactIcon>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <path
                                            d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                                    </svg>
                                </ContactIcon>
                                <ContactText>
                                    <strong>GitHub</strong>
                                    <a href="https://github.com/piper-hyowon" target="_blank" rel="noopener noreferrer">
                                        github.com/piper-hyowon
                                    </a>
                                </ContactText>
                                <CopyButton onClick={() => handleCopy('https://github.com/piper-hyowon', 'github')}>
                                    Copy
                                </CopyButton>
                            </ContactItem>
                            <ContactItem>
                                <CopyFeedback $show={copiedStates['blog'] || false}>Copied!</CopyFeedback>
                                <ContactIcon>📝</ContactIcon>
                                <ContactText>
                                    <strong>Blog</strong>
                                    <a href="https://piper-trail.com/tech" target="_blank" rel="noopener noreferrer">
                                        piper-trail.com/tech
                                    </a>
                                </ContactText>
                                <CopyButton onClick={() => handleCopy('https://piper-trail.com/tech', 'blog')}>
                                    Copy
                                </CopyButton>
                            </ContactItem>
                        </ContactInfo>
                    </LinksSection>
                </ContentWrapper>
            </AboutContainer>
        </>
    );
};

export default AboutPage;