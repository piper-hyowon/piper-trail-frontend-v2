import React, {useCallback} from 'react';
import styled, {keyframes} from 'styled-components';
import {useParams, useNavigate, Link} from 'react-router-dom';
import {
    IoArrowBack,
    IoBookOutline,
    IoTimeOutline,
    IoCalendarOutline,
    IoEyeOutline
} from 'react-icons/io5';
import {useLanguage} from '../context/LanguageContext';
import TagList from '../components/ui/TagList';
import {useSeriesDetail} from '../hooks/useApi';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({theme}) => theme.spacing.lg};
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) {
    padding: ${({theme}) => theme.spacing.md};
  }
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({theme}) => theme.spacing.xs};
  color: ${({theme}) => theme.colors.primary};
  text-decoration: none;
  font-weight: 500;
  font-size: ${({theme}) => theme.fontSizes.small};
  margin-bottom: ${({theme}) => theme.spacing.lg};
  transition: ${({theme}) => theme.transitions.default};

  &:hover {
    color: ${({theme}) => theme.colors.secondary};
    transform: translateX(-4px);
  }
`;

const SeriesHero = styled.div`
  background: ${({theme}) => theme.gradients.seriesGradient};
  color: white;
  padding: ${({theme}) => theme.spacing.lg} ${({theme}) => theme.spacing.md};
  border-radius: 24px;
  text-align: center;
  margin-bottom: ${({theme}) => theme.spacing.xl};
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px ${({theme}) => theme.colors.series.primary}30;

  @media (min-width: 768px) {
    padding: ${({theme}) => theme.spacing.xl} ${({theme}) => theme.spacing.lg};
  }

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: ${({theme}) => theme.gradients.seriesAccent};
    opacity: 0.1;
    border-radius: 50%;
    animation: rotate 20s linear infinite;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const SeriesTitle = styled.h1`
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 800;
  margin-bottom: ${({theme}) => theme.spacing.sm};
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

const SeriesDescription = styled.p`
  font-size: ${({theme}) => theme.fontSizes.medium};
  opacity: 0.95;
  margin-bottom: ${({theme}) => theme.spacing.lg};
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  position: relative;
  z-index: 1;

  @media (min-width: 768px) {
    font-size: ${({theme}) => theme.fontSizes.large};
    margin-bottom: ${({theme}) => theme.spacing.xl};
  }
`;

const SeriesStats = styled.div`
  display: flex;
  gap: ${({theme}) => theme.spacing.lg};
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
  margin-bottom: ${({theme}) => theme.spacing.md};

  @media (min-width: 768px) {
    gap: ${({theme}) => theme.spacing.xl};
    margin-bottom: ${({theme}) => theme.spacing.lg};
  }
`;

const StatItem = styled.div`
  text-align: center;
  background: rgba(255, 255, 255, 0.25);
  padding: ${({theme}) => theme.spacing.md} ${({theme}) => theme.spacing.lg};
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
  transition: all ${({theme}) => theme.transitions.default};

  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.35);
  }

  .value {
    font-size: 2.5rem;
    font-weight: 800;
    display: block;
    margin-bottom: 4px;
    background: linear-gradient(to right, #fff, #fff3cd);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 2px 10px rgba(255, 255, 255, 0.3);
  }

  .label {
    font-size: ${({theme}) => theme.fontSizes.small};
    opacity: 0.95;
    display: flex;
    align-items: center;
    gap: 6px;
    justify-content: center;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
  }
`;

const TagsSection = styled.div`
  margin-top: ${({theme}) => theme.spacing.lg};
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 1;
`;

const PostsSection = styled.div`
  margin-top: ${({theme}) => theme.spacing.xl};
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${({theme}) => theme.spacing.md};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PostCard = styled.div<{ $isLatest?: boolean }>`
  background: ${({theme}) => theme.colors.background};
  border: 2px solid ${({theme}) =>
          theme.colors.series.primary}${props => props.$isLatest ? '30' : '10'};
  border-radius: 16px;
  padding: ${({theme}) => theme.spacing.lg};
  position: relative;
  transition: all ${({theme}) => theme.transitions.default};
  cursor: pointer;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({theme}) => theme.gradients.seriesGradient};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform ${({theme}) => theme.transitions.default};
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px ${({theme}) => theme.colors.series.primary}15;

    &::before {
      transform: scaleX(1);
    }
  }

  ${props => props.$isLatest && `
    background: ${props.theme.colors.series.card};
    box-shadow: 0 4px 16px ${props.theme.colors.series.primary}20;
  `}
`;

const PostOrder = styled.div<{ $isLatest?: boolean }>`
  position: absolute;
  top: ${({theme}) => theme.spacing.md};
  right: ${({theme}) => theme.spacing.md};
  width: 48px;
  height: 48px;
  background: ${({theme, $isLatest}) =>
          $isLatest
                  ? theme.gradients.seriesAccent
                  : theme.colors.series.primary
  };
  color: white;
  border-radius: ${({$isLatest}) => $isLatest ? '50%' : '12px'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: ${({theme}) => theme.fontSizes.large};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  ${props => props.$isLatest && `
    animation: pulse 2s infinite;
  `}
`;

const PostTitle = styled.h3`
  color: ${({theme}) => theme.colors.text};
  font-size: ${({theme}) => theme.fontSizes.large};
  font-weight: 700;
  margin-bottom: ${({theme}) => theme.spacing.sm};
  line-height: 1.4;
  padding-right: 60px;
`;

const PostSubtitle = styled.p`
  color: ${({theme}) => theme.colors.text};
  opacity: 0.7;
  font-size: ${({theme}) => theme.fontSizes.medium};
  margin-bottom: ${({theme}) => theme.spacing.md};
  line-height: 1.5;
`;

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({theme}) => theme.spacing.md};
  font-size: ${({theme}) => theme.fontSizes.small};
  color: ${({theme}) => theme.colors.series.primary};
  font-weight: 600;

  span {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

const LatestBadge = styled.span`
  background: ${({theme}) => theme.gradients.seriesAccent};
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: ${({theme}) => theme.fontSizes.xsmall};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: ${({theme}) => theme.fontSizes.large};
  color: ${({theme}) => theme.colors.text};
  opacity: 0.6;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: ${({theme}) => theme.spacing.xl};

  h2 {
    color: ${({theme}) => theme.colors.error};
    margin-bottom: ${({theme}) => theme.spacing.md};
  }

  p {
    color: ${({theme}) => theme.colors.text};
    opacity: 0.7;
  }
`;

const SeriesHomePage: React.FC = () => {
    const {slug} = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const {t, language} = useLanguage();

    const {data: series, isLoading, error} = useSeriesDetail(slug!);

    const handlePostClick = useCallback((post: any) => {
        navigate(`/${series?.category || 'uncategorized'}/${post.slug}`);
    }, [navigate, series]);

    const handleTagClick = useCallback((tag: string) => {
        navigate(`/tag/${tag}`);
    }, [navigate]);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString(
            language === 'ko' ? 'ko-KR' : 'en-US',
            {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }
        );
    };

    const calculateTotalReadTime = () => {
        if (!series?.posts) return 0;
        return series.posts.length * 5;
    };

    const calculateDaysAgo = (date: string) => {
        return Math.floor((new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    };

    if (isLoading) {
        return (
            <Container>
                <LoadingContainer>{t('series.home.loading' as any)}</LoadingContainer>
            </Container>
        );
    }

    if (error || !series) {
        return (
            <Container>
                <ErrorContainer>
                    <h2>{t('series.home.notFound' as any)}</h2>
                    <p>{t('series.home.notFoundDetail' as any)}</p>
                    <BackButton to="/">← {t('series.home.backToHome' as any)}</BackButton>
                </ErrorContainer>
            </Container>
        );
    }

    const posts = series.posts || [];
    const totalReadTime = calculateTotalReadTime();

    return (
        <Container>
            <BackButton to="/">
                <IoArrowBack/> {t('series.home.backToHome' as any)}
            </BackButton>

            <SeriesHero>
                <SeriesTitle>
                    {language === 'ko' ? series.title : (series.titleEn || series.title)}
                </SeriesTitle>
                {series.description && (
                    <SeriesDescription>
                        {language === 'ko'
                            ? series.description
                            : (series.descriptionEn || series.description)}
                    </SeriesDescription>
                )}

                <SeriesStats>
                    <StatItem>
                        <span className="value">{series.totalCount}</span>
                        <span className="label">
                            <IoBookOutline/> {t('series.home.stats.totalPosts' as any)}
                        </span>
                    </StatItem>

                    <StatItem>
                        <span className="value">{totalReadTime}</span>
                        <span className="label">
                            <IoTimeOutline/> {t('series.home.stats.minRead' as any)}
                        </span>
                    </StatItem>

                    {series.createdAt && (
                        <StatItem>
                            <span className="value">
                                {calculateDaysAgo(series.createdAt)}
                            </span>
                            <span className="label">
                                <IoCalendarOutline/> {t('series.home.stats.daysAgo' as any)}
                            </span>
                        </StatItem>
                    )}
                </SeriesStats>

                {series.tags && series.tags.length > 0 && (
                    <TagsSection>
                        <TagList
                            tags={series.tags}
                            onTagClick={handleTagClick}
                            // variant="light"
                        />
                    </TagsSection>
                )}
            </SeriesHero>

            <PostsSection>
                <PostsGrid>
                    {posts.map((post) => {
                        const isLatest = post.order === series.totalCount;

                        return (
                            <PostCard
                                key={post.id}
                                $isLatest={isLatest}
                                onClick={() => handlePostClick(post)}
                            >
                                <PostOrder $isLatest={isLatest}>
                                    {post.order}
                                </PostOrder>
                                {isLatest && (
                                    <LatestBadge style={{position: 'absolute', top: 16, left: 16}}>
                                        {t('series.home.latest' as any)}
                                    </LatestBadge>
                                )}

                                <div style={{paddingRight: '80px'}}>
                                    <PostTitle>{post.title}</PostTitle>
                                    {post.subtitle && (
                                        <PostSubtitle>{post.subtitle}</PostSubtitle>
                                    )}
                                    <PostMeta>
                                        <span>
                                            <IoCalendarOutline/> {formatDate(post.createdAt)}
                                        </span>
                                        <span>
                                            <IoEyeOutline/> {post.viewCount} {t('series.home.views' as any)}
                                        </span>
                                    </PostMeta>
                                </div>
                            </PostCard>
                        );
                    })}
                </PostsGrid>
            </PostsSection>
        </Container>
    );
};

export default SeriesHomePage;