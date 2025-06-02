import React, {useState} from 'react';
import styled, {keyframes} from 'styled-components';

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
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({theme}) => theme.spacing.lg};
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
    radial-gradient(circle at 80% 20%, ${({theme}) => `${theme.colors.secondary}20`} 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, ${({theme}) => `${theme.colors.accent}20`} 0%, transparent 50%);
    pointer-events: none;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const AboutHeader = styled.header`
  text-align: center;
  margin-bottom: ${({theme}) => theme.spacing.xl};
  padding: ${({theme}) => theme.spacing.xl};
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
`;

const ProfileImage = styled.div`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: ${({theme}) => theme.gradients.seaGradient};
  margin: 0 auto ${({theme}) => theme.spacing.lg};
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
`;

const Name = styled.h1`
  color: ${({theme}) => theme.colors.text};
  margin-bottom: ${({theme}) => theme.spacing.lg};
  font-size: 2.5rem;
  font-weight: 700;
  text-shadow: 0 2px 10px ${({theme}) => `${theme.colors.primary}30`};
`;

const InterestsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({theme}) => theme.spacing.lg};
  margin-top: ${({theme}) => theme.spacing.md};
`;

const InterestGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({theme}) => theme.spacing.sm};
`;

const InterestLabel = styled.span`
  color: ${({theme}) => theme.colors.primary};
  font-weight: 600;
  margin-bottom: ${({theme}) => theme.spacing.xs};
`;

const PrimaryInterestLabel = styled(InterestLabel)`
  font-size: 1.2rem;
`;

const SecondaryInterestLabel = styled(InterestLabel)`
  font-size: 1rem;
  color: ${({theme}) => `${theme.colors.primary}CC`};
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
  font-size: 0.9rem;
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
  font-size: 0.85rem;

  &:hover {
    background: ${({theme}) => `${theme.colors.secondary}25`};
  }
`;

const Section = styled.section`
  margin-bottom: ${({theme}) => theme.spacing.xl};
  padding: ${({theme}) => theme.spacing.xl};
  background: ${({theme}) => `${theme.colors.background}E6`};
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid ${({theme}) => `${theme.colors.primary}30`};
  box-shadow: 0 8px 32px ${({theme}) => `${theme.colors.primary}15`};
  animation: ${fadeInUp} 0.8s ease-out;
  animation-fill-mode: both;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px ${({theme}) => `${theme.colors.primary}20`};
  }

  &:nth-child(2) {
    animation-delay: 0.1s;
  }

  &:nth-child(3) {
    animation-delay: 0.2s;
  }

  &:nth-child(4) {
    animation-delay: 0.3s;
  }
`;

const SectionTitle = styled.h3`
  color: ${({theme}) => theme.colors.text};
  margin-bottom: ${({theme}) => theme.spacing.lg};
  padding-bottom: ${({theme}) => theme.spacing.sm};
  border-bottom: 2px solid ${({theme}) => `${theme.colors.primary}30`};
  font-size: 1.5rem;
  font-weight: 600;
  text-shadow: 0 2px 5px ${({theme}) => `${theme.colors.primary}20`};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 50px;
    height: 2px;
    background: ${({theme}) => theme.colors.primary};
  }
`;

const SkillGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({theme}) => theme.spacing.lg};
  margin-top: ${({theme}) => theme.spacing.lg};
`;

const SkillCategory = styled.div`
  padding: ${({theme}) => theme.spacing.lg};
  background: ${({theme}) => `${theme.colors.background}B3`};
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid ${({theme}) => `${theme.colors.primary}30`};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 15px 30px ${({theme}) => `${theme.colors.primary}20`};
    background: ${({theme}) => `${theme.colors.background}CC`};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({theme}) => theme.gradients.seaGradient};
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const SkillTitle = styled.h4`
  color: ${({theme}) => theme.colors.text};
  margin-bottom: ${({theme}) => theme.spacing.md};
  font-size: 1.2rem;
  font-weight: 600;
  text-shadow: 0 1px 3px ${({theme}) => `${theme.colors.primary}30`};
`;

const SkillList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SkillItem = styled.li`
  padding: ${({theme}) => theme.spacing.sm} 0;
  color: ${({theme}) => `${theme.colors.text}E6`};
  display: flex;
  align-items: center;
  font-weight: 400;
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
  gap: ${({theme}) => theme.spacing.lg};
  margin-top: ${({theme}) => theme.spacing.lg};
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({theme}) => theme.spacing.md};
  padding: ${({theme}) => theme.spacing.lg};
  background: ${({theme}) => `${theme.colors.background}B3`};
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid ${({theme}) => `${theme.colors.primary}30`};
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px ${({theme}) => `${theme.colors.primary}20`};
    background: ${({theme}) => `${theme.colors.background}CC`};
  }
`;

const ContactIcon = styled.div`
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({theme}) => `${theme.colors.primary}20`};
  border-radius: 12px;
  backdrop-filter: blur(10px);
`;

const ContactText = styled.div`
  color: ${({theme}) => `${theme.colors.text}E6`};
  flex: 1;

  strong {
    color: ${({theme}) => theme.colors.text};
    font-weight: 600;
    display: block;
    margin-bottom: 4px;
    text-shadow: 0 1px 3px ${({theme}) => `${theme.colors.primary}30`};
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: all 0.2s ease;

    &:hover {
      color: ${({theme}) => theme.colors.primary};
    }
  }
`;

const CopyButton = styled.button`
  background: ${({theme}) => theme.gradients.seaGradient};
  color: ${({theme}) => theme.colors.background};
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px ${({theme}) => `${theme.colors.primary}30`};
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${({theme}) => `${theme.colors.primary}40`};
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
    ${({theme}) => `${theme.colors.background}20`},
    transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
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
        <AboutContainer>
            <ContentWrapper>
                <AboutHeader>
                    <ProfileImage>
                        <img width={180} src={'/images/profile.PNG'} alt="Profile Image"/>
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

                <Section>
                    <SectionTitle>🚀 Tech Stack</SectionTitle>
                    <SkillGrid>
                        <SkillCategory>
                            <SkillTitle>Backend</SkillTitle>
                            <SkillList>
                                <SkillItem>Go</SkillItem>
                                <SkillItem>TypeScript / Node.js / NestJS</SkillItem>
                                <SkillItem>Java / Spring Boot</SkillItem>
                            </SkillList>
                        </SkillCategory>
                        <SkillCategory>
                            <SkillTitle>Database</SkillTitle>
                            <SkillList>
                                <SkillItem>PostgreSQL</SkillItem>
                                <SkillItem>MongoDB</SkillItem>
                                <SkillItem>Redis</SkillItem>
                            </SkillList>
                        </SkillCategory>
                        <SkillCategory>
                            <SkillTitle>DevOps</SkillTitle>
                            <SkillList>
                                <SkillItem>Kubernetes</SkillItem>
                                <SkillItem>AWS / DigitalOcean</SkillItem>
                            </SkillList>
                        </SkillCategory>
                        <SkillCategory>
                            <SkillTitle>Others</SkillTitle>
                            <SkillList>
                                <SkillItem>Frontend - TypeScript, React</SkillItem>
                            </SkillList>
                        </SkillCategory>
                    </SkillGrid>
                </Section>

                <Section>
                    <SectionTitle>🔗 Links</SectionTitle>
                    <ContactInfo>
                        <ContactItem>
                            <CopyFeedback $show={copiedStates['github'] || false}>Copied!</CopyFeedback>
                            <ContactIcon>🐙</ContactIcon>
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
                </Section>
            </ContentWrapper>
        </AboutContainer>
    );
};

export default AboutPage;