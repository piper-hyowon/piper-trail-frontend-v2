import React, {useState} from 'react';
import styled, {keyframes} from 'styled-components';

const wobble = keyframes`
  0%, 100% { transform: rotate(-1deg); }
  50% { transform: rotate(1deg); }
`;

const PageWrapper = styled.div`
  padding: 2rem 1rem 4rem;
  max-width: 900px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: ${({theme}) => theme.fontSizes.xxlarge};
  font-weight: 700;
  color: ${({theme}) => theme.colors.bbosong.text};
  text-align: center;
  margin-bottom: 0.25rem;
  letter-spacing: -0.5px;
`;

const PageSubtitle = styled.p`
  text-align: center;
  color: ${({theme}) => theme.colors.bbosong.textSoft};
  font-size: ${({theme}) => theme.fontSizes.small};
  margin-bottom: 3rem;
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;

  @media (min-width: 700px) {
    flex-direction: row;
    align-items: flex-start;
    gap: 2rem;
  }
`;

/* ── 프로필 카드 ── */
const ProfileCard = styled.div`
  background: ${({theme}) => theme.colors.bbosong.cardBg};
  border: 1.5px dashed ${({theme}) => theme.colors.bbosong.border};
  border-radius: 20px;
  padding: 1.5rem 1.25rem;
  width: 100%;
  flex-shrink: 0;
  position: relative;
  box-shadow: ${({theme}) => theme.shadows.bbosongSoft};

  @media (min-width: 700px) {
    width: 220px;
  }

  &::before {
    content: '🐾';
    position: absolute;
    top: -14px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 1.6rem;
  }
`;

const PawStamp = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${({theme}) => theme.colors.bbosong.soft};
  border: 2px solid ${({theme}) => theme.colors.bbosong.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin: 0.5rem auto 1rem;
`;

const ProfileName = styled.p`
  font-size: ${({theme}) => theme.fontSizes.large};
  font-weight: 700;
  text-align: center;
  color: ${({theme}) => theme.colors.bbosong.text};
  margin: 0 0 0.25rem;
`;

const ProfileTagline = styled.p`
  font-size: ${({theme}) => theme.fontSizes.xsmall};
  text-align: center;
  color: ${({theme}) => theme.colors.bbosong.textSoft};
  margin: 0 0 1.25rem;
  font-style: italic;
`;

const ProfileDivider = styled.hr`
  border: none;
  border-top: 1px dashed ${({theme}) => theme.colors.bbosong.border};
  margin: 0.75rem 0;
`;

const ProfileRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({theme}) => theme.fontSizes.xsmall};
  padding: 0.25rem 0;
  color: ${({theme}) => theme.colors.bbosong.text};
`;

const ProfileLabel = styled.span`
  color: ${({theme}) => theme.colors.bbosong.textSoft};
`;

const WobblyTag = styled.span`
  display: inline-block;
  background: ${({theme}) => theme.colors.bbosong.tag};
  border: 1px solid ${({theme}) => theme.colors.bbosong.border};
  border-radius: 999px;
  padding: 2px 10px;
  font-size: ${({theme}) => theme.fontSizes.xsmall};
  color: ${({theme}) => theme.colors.bbosong.accent};
  animation: ${wobble} 3s ease-in-out infinite;
  cursor: default;
`;

/* ── 다이어리 목록 ── */
const DiarySection = styled.div`
  flex: 1;
  min-width: 0;
`;

const SectionLabel = styled.p`
  font-size: ${({theme}) => theme.fontSizes.xsmall};
  color: ${({theme}) => theme.colors.bbosong.textSoft};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
`;

const DiaryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DiaryItem = styled.div`
  display: flex;
  gap: 1rem;
  background: ${({theme}) => theme.colors.bbosong.cardBg};
  border: 1px solid ${({theme}) => theme.colors.bbosong.border};
  border-radius: 16px;
  padding: 0.9rem 1rem;
  cursor: pointer;
  transition: ${({theme}) => theme.transitions.default};
  box-shadow: ${({theme}) => theme.shadows.bbosongSoft};

  &:hover {
    transform: translateY(-2px) rotate(0.3deg);
    box-shadow: 0 6px 20px ${({theme}) => theme.colors.bbosong.muted}33;
  }

  &:nth-child(even) {
    transform: rotate(-0.4deg);
    &:hover {
      transform: translateY(-2px) rotate(0.2deg);
    }
  }
`;

const DiaryThumbnail = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background: ${({theme}) => theme.colors.bbosong.soft};
  flex-shrink: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const DiaryMeta = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.25rem;
  min-width: 0;
`;

const DiaryDate = styled.span`
  font-size: ${({theme}) => theme.fontSizes.xsmall};
  color: ${({theme}) => theme.colors.bbosong.textSoft};
  font-family: 'Courier New', monospace;
`;

const DiaryTitle = styled.p`
  font-size: ${({theme}) => theme.fontSizes.medium};
  font-weight: 600;
  color: ${({theme}) => theme.colors.bbosong.text};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DiarySnippet = styled.p`
  font-size: ${({theme}) => theme.fontSizes.small};
  color: ${({theme}) => theme.colors.bbosong.textSoft};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${({theme}) => theme.colors.bbosong.textSoft};
  font-size: ${({theme}) => theme.fontSizes.small};
  line-height: 2;
`;

/* ── 타입 ── */
interface DiaryEntry {
    id: string;
    date: string;
    title: string;
    snippet: string;
    thumbnail?: string;
    emoji?: string;
}

const DUMMY_ENTRIES: DiaryEntry[] = [
    {
        id: '1',
        date: '2025.03.12',
        title: '오늘 산책 갔다 왔어',
        snippet: '오늘은 바람이 많이 불었는데도 좋았어. 다람쥐 봤음.',
        emoji: '🌸',
    },
    {
        id: '2',
        date: '2025.02.28',
        title: '낮잠 진짜 많이 잔 날',
        snippet: '해가 들어오는 자리에서 네 번 위치 바꾸며 잠.',
        emoji: '☀️',
    },
    {
        id: '3',
        date: '2025.01.15',
        title: '간식 새로 생긴 날',
        snippet: '처음엔 냄새만 맡았는데 결국 다 먹었어.',
        emoji: '🦴',
    },
];

/* ── 컴포넌트 ── */
interface BbosongDiaryPageProps {
    entries?: DiaryEntry[];
    onEntryClick?: (id: string) => void;
}

const BbosongDiaryPage: React.FC<BbosongDiaryPageProps> = ({
    entries = DUMMY_ENTRIES,
    onEntryClick,
}) => {
    return (
        <PageWrapper>
            <PageTitle>🏝️ Isle of Ppossong</PageTitle>
            <PageSubtitle>뽀송이의 작은 섬에 오신 것을 환영합니다</PageSubtitle>

            <ContentArea>
                {/* 프로필 카드 */}
                <ProfileCard>
                    <PawStamp>🐶</PawStamp>
                    <ProfileName>뽀송이</ProfileName>
                    <ProfileTagline>혼자 쓰는 일기, 같이 보는 일기</ProfileTagline>
                    <ProfileDivider />
                    <ProfileRow>
                        <ProfileLabel>이름</ProfileLabel>
                        <span>뽀송이</span>
                    </ProfileRow>
                    <ProfileRow>
                        <ProfileLabel>종류</ProfileLabel>
                        <span>믹스견</span>
                    </ProfileRow>
                    <ProfileRow>
                        <ProfileLabel>생년</ProfileLabel>
                        <span>2016.01 ~</span>
                    </ProfileRow>
                    <ProfileRow>
                        <ProfileLabel>상태</ProfileLabel>
                        <WobblyTag>현역 노견 🌟</WobblyTag>
                    </ProfileRow>
                    <ProfileDivider />
                    <ProfileRow>
                        <ProfileLabel>좋아하는 것</ProfileLabel>
                        <span>산책, 낮잠</span>
                    </ProfileRow>
                    <ProfileRow>
                        <ProfileLabel>싫어하는 것</ProfileLabel>
                        <span>목욕, 천둥</span>
                    </ProfileRow>
                </ProfileCard>

                {/* 다이어리 목록 */}
                <DiarySection>
                    <SectionLabel>📖 뽀송이 일기</SectionLabel>
                    {entries.length === 0 ? (
                        <EmptyState>
                            아직 일기가 없어요<br />
                            첫 번째 일기를 써보세요 🐾
                        </EmptyState>
                    ) : (
                        <DiaryList>
                            {entries.map((entry) => (
                                <DiaryItem
                                    key={entry.id}
                                    onClick={() => onEntryClick?.(entry.id)}
                                >
                                    <DiaryThumbnail>
                                        {entry.thumbnail ? (
                                            <img src={entry.thumbnail} alt={entry.title} />
                                        ) : (
                                            entry.emoji ?? '🐾'
                                        )}
                                    </DiaryThumbnail>
                                    <DiaryMeta>
                                        <DiaryDate>{entry.date}</DiaryDate>
                                        <DiaryTitle>{entry.title}</DiaryTitle>
                                        <DiarySnippet>{entry.snippet}</DiarySnippet>
                                    </DiaryMeta>
                                </DiaryItem>
                            ))}
                        </DiaryList>
                    )}
                </DiarySection>
            </ContentArea>
        </PageWrapper>
    );
};

export default BbosongDiaryPage;