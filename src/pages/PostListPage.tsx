import React, {useState, useCallback, useEffect, useMemo} from 'react';
import styled, {keyframes} from 'styled-components';
import {useParams, useLocation, useNavigate} from 'react-router-dom';
import {Card, CardTitle, CardContent, CardFooter} from '../components/ui/Card';
import TagList from '../components/ui/TagList';
import Pagination from '../components/ui/Pagination';
import SortSelector from '../components/ui/SortSelector';
import AuthModal from '../components/ui/AuthModal';
import PostForm from "../components/ui/PostForm.tsx";
import {IoAddCircleOutline, IoEyeOutline, IoCalendarOutline, IoFolderOpenOutline} from "react-icons/io5";
import {usePostsByCategory, usePostsByTag, useSearchPosts, useCreatePost} from '../hooks/useApi';
import {LoginCredentials, useApi} from '../context/ApiContext';
import {useLanguage} from '../context/LanguageContext';

const PAGE_SIZE = 4;
const DEFAULT_SORT = 'createdAt,desc';

const SORT_OPTIONS = [
    {value: 'createdAt,desc', label: 'Latest'},
    {value: 'createdAt,asc', label: 'Oldest'},
    {value: 'viewCount,desc', label: 'Most Viewed'},
    {value: 'title,asc', label: 'Title A-Z'},
    {value: 'title,desc', label: 'Title Z-A'},
];

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

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const PostListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({theme}) => theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({theme}) => theme.spacing.lg};
  animation: ${fadeIn} 0.6s ease-out;
`;

const PostListHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({theme}) => theme.spacing.lg};
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({theme}) => theme.spacing.md};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({theme}) => theme.spacing.sm};
  }
`;

const PostListTitleSection = styled.div`
  flex: 1;
  min-width: 0;
`;

const PostListTitle = styled.h1`
  background: ${({theme}) => theme.gradients.techGradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 ${({theme}) => theme.spacing.xs} 0;
  animation: ${slideIn} 0.8s ease-out;
`;

const PostCount = styled.p`
  margin: 0;
  color: ${({theme}) => theme.colors.text};
  opacity: 0.7;
  font-size: ${({theme}) => theme.fontSizes.medium};
  font-weight: 500;
`;

const CreatePostButton = styled.button`
  background: ${({theme}) => theme.gradients.purpleGradient};
  color: white;
  font-weight: 600;
  padding: ${({theme}) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border: none;
  border-radius: 25px;
  display: flex;
  align-items: center;
  gap: ${({theme}) => theme.spacing.xs};
  cursor: pointer;
  transition: all ${({theme}) => theme.transitions.default};
  white-space: nowrap;
  height: fit-content;
  box-shadow: 0 4px 15px rgba(46, 139, 87, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(46, 139, 87, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({theme}) => theme.spacing.md};
  background: ${({theme}) => `${theme.colors.secondaryBackground}50`};
  padding: ${({theme}) => theme.spacing.lg};
  border-radius: 16px;
  border: 1px solid ${({theme}) => `${theme.colors.primary}10`};

  @media (min-width: 769px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
`;

const TagFilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({theme}) => theme.spacing.sm};
  flex: 1;
  min-width: 0;

  h4 {
    margin: 0;
    color: ${({theme}) => theme.colors.primary};
    font-size: ${({theme}) => theme.fontSizes.medium};
    font-weight: 600;
  }
`;

const SortContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({theme}) => theme.spacing.xs};
  min-width: 200px;

  @media (max-width: 768px) {
    min-width: auto;
    width: 100%;
  }
`;

const SortLabel = styled.label`
  font-size: ${({theme}) => theme.fontSizes.small};
  color: ${({theme}) => theme.colors.primary};
  font-weight: 600;
  margin: 0;
`;

const StyledCard = styled(Card)`
  background: ${({theme}) => theme.colors.background};
  border: 1px solid ${({theme}) => `${theme.colors.primary}10`};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all ${({theme}) => theme.transitions.default};
  cursor: pointer;
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease-out;
  animation-fill-mode: both;

  &:nth-child(1) {
    animation-delay: 0.1s;
  }

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.3s;
  }

  &:nth-child(4) {
    animation-delay: 0.4s;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    border-color: ${({theme}) => `${theme.colors.primary}30`};
  }
`;

const StyledCardTitle = styled(CardTitle)`
  font-size: ${({theme}) => theme.fontSizes.large};
  font-weight: 700;
  color: ${({theme}) => theme.colors.text};
  margin-bottom: ${({theme}) => theme.spacing.xs};
  transition: color ${({theme}) => theme.transitions.default};

  ${StyledCard}:hover & {
    color: ${({theme}) => theme.colors.primary};
  }
`;

const CardSubtitle = styled.div`
  color: ${({theme}) => theme.colors.text};
  opacity: 0.6;
  font-size: ${({theme}) => theme.fontSizes.small};
  margin-bottom: ${({theme}) => theme.spacing.sm};
  font-style: italic;
`;

const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  gap: ${({theme}) => theme.spacing.sm};
`;

const StyledCardFooter = styled(CardFooter)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${({theme}) => theme.spacing.sm};
  border-top: 1px solid ${({theme}) => `${theme.colors.primary}05`};
  margin-top: auto;
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({theme}) => theme.spacing.md};
  font-size: ${({theme}) => theme.fontSizes.small};
  color: ${({theme}) => theme.colors.text};
  opacity: 0.6;

  span {
    display: flex;
    align-items: center;
    gap: ${({theme}) => theme.spacing.xs};
  }
`;

const PostDate = styled.span`
  color: ${({theme}) => theme.colors.text};
  opacity: 0.5;
  font-size: ${({theme}) => theme.fontSizes.small};
  display: flex;
  align-items: center;
  gap: ${({theme}) => theme.spacing.xs};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({theme}) => theme.spacing.xl};
  text-align: center;

  h2 {
    background: ${({theme}) => theme.gradients.purpleGradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const ErrorContainer = styled.div`
  background: ${({theme}) => `${theme.colors.error}10`};
  border: 1px solid ${({theme}) => `${theme.colors.error}30`};
  border-radius: 16px;
  padding: ${({theme}) => theme.spacing.xl};
  margin: ${({theme}) => theme.spacing.xl} auto;
  max-width: 600px;
  text-align: center;

  h2 {
    color: ${({theme}) => theme.colors.error};
    margin-bottom: ${({theme}) => theme.spacing.md};
  }

  button {
    background: ${({theme}) => theme.colors.error};
    color: white;
    border: none;
    padding: ${({theme}) => `${theme.spacing.sm} ${theme.spacing.lg}`};
    border-radius: 20px;
    font-weight: 600;
    cursor: pointer;
    transition: all ${({theme}) => theme.transitions.default};
    margin-top: ${({theme}) => theme.spacing.md};

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
    }
  }
`;

const PostsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({theme}) => theme.spacing.lg};
`;

const NoPostsMessage = styled.div`
  text-align: center;
  padding: ${({theme}) => theme.spacing.xl};
  background: ${({theme}) => theme.colors.background};
  border-radius: 16px;
  border: 2px dashed ${({theme}) => `${theme.colors.primary}20`};
  color: ${({theme}) => theme.colors.text};

  p {
    font-size: ${({theme}) => theme.fontSizes.medium};
    margin: 0;
    opacity: 0.7;

    &:first-child {
      font-size: ${({theme}) => theme.fontSizes.large};
      font-weight: 600;
      margin-bottom: ${({theme}) => theme.spacing.sm};
      opacity: 0.9;
    }
  }
`;

const FormModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: ${({theme}) => theme.colors.background};
  padding: ${({theme}) => theme.spacing.lg};
  border-radius: ${({theme}) => theme.borderRadius};
  max-width: 1000px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({theme}) => theme.spacing.md};
  padding-bottom: ${({theme}) => theme.spacing.md};
  border-bottom: 1px solid ${({theme}) => `${theme.colors.text}20`};
`;

const ModalTitle = styled.h2`
  color: ${({theme}) => theme.colors.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${({theme}) => theme.colors.text};
  opacity: 0.5;
  transition: opacity ${({theme}) => theme.transitions.default};

  &:hover {
    opacity: 1;
  }
`;

const PostListPage: React.FC = () => {
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // ApiContext에서 인증 상태와 함수들 가져오기
    const {isAuthenticated, login} = useApi();
    const {t, language} = useLanguage();

    const isTagRoute = location.pathname.startsWith('/tag/');
    const isSearchRoute = location.pathname.startsWith('/search');
    const pathSegments = location.pathname.split('/').filter(Boolean);
    let currentCategory: string = pathSegments[0];

    const searchParams = new URLSearchParams(location.search);
    const currentPage = parseInt(searchParams.get('page') || '0');
    const currentSort = searchParams.get('sort') || DEFAULT_SORT;
    const selectedTags = (searchParams.get('tags') ?? '').split(',').filter(Boolean);

    // 검색 관련 파라미터
    const searchQuery = searchParams.get('q') || '';
    const searchCategory = searchParams.get('category') || '';

    // 모달 상태 관리
    const [showPostForm, setShowPostForm] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMessage, setAuthMessage] = useState('');
    const [formData, setFormData] = useState<any>(null);

    const createPostMutation = useCreatePost();

    const formatMessage = (key: string, params: Record<string, any> = {}): string => {
        let message = t(key as any);
        Object.entries(params).forEach(([param, value]) => {
            message = message.replace(`{${param}}`, String(value));
        });
        return message;
    };

    // API 호출
    let postsQuery;
    if (isSearchRoute) {
        const [sortBy, sortDirection] = currentSort.split(',');
        postsQuery = useSearchPosts({
            keyword: searchQuery,
            category: searchCategory || undefined,
            tags: selectedTags.length > 0 ? selectedTags : undefined,
            page: currentPage,
            size: PAGE_SIZE,
            sortBy: sortBy,
            sortDirection: (sortDirection as 'asc' | 'desc') || 'desc'
        });
    } else if (isTagRoute && params.tagName) {
        postsQuery = usePostsByTag(params.tagName, {
            page: currentPage,
            size: PAGE_SIZE,
            sort: currentSort
        });
    } else if (currentCategory) {
        const actualCategory = currentCategory === 'null' ? null : currentCategory;
        postsQuery = usePostsByCategory(actualCategory, {
            page: currentPage,
            size: PAGE_SIZE,
            sort: currentSort
        });
    } else {
        postsQuery = {data: null, isLoading: false, error: new Error('Category not found')};
    }

    const {data: postsData, isLoading, error} = postsQuery;

    const availableTags = useMemo(() => {
        if (!postsData?.content) return [];

        const tagSet = new Set<string>();
        postsData.content.forEach((post: any) => {
            post.tags?.forEach((tag: string) => tagSet.add(tag));
        });

        return Array.from(tagSet).sort();
    }, [postsData]);

    const pageTitle = useMemo(() => {
        if (isSearchRoute) {
            if (searchQuery) {
                return searchCategory
                    ? formatMessage('post.list.title.searchWithCategory', {
                        query: searchQuery,
                        category: searchCategory
                    })
                    : formatMessage('post.list.title.searchWithQuery', {query: searchQuery});
            }
            return t('post.list.title.search' as any);
        }
        if (isTagRoute && params.tagName) return formatMessage('post.list.title.tag', {tag: params.tagName});
        if (currentCategory) {
            if (currentCategory === 'null') return t('post.list.title.uncategorized' as any);
            return currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);
        }
        return 'Category Not Found';
    }, [currentCategory, params.tagName, isTagRoute, isSearchRoute, searchQuery, searchCategory, t, formatMessage]);

    const getCategoryName = (category: string): string => {
        if (isSearchRoute) return t('post.list.title.search' as any);
        if (isTagRoute) return pageTitle;
        switch (category) {
            case 'tech':
                return t('post.categories.tech' as any);
            case 'food':
                return t('post.categories.food' as any);
            case 'null':
                return t('post.categories.uncategorized' as any);
            default:
                return category?.charAt(0).toUpperCase() + category?.slice(1) || 'Unknown';
        }
    };

    const createPost = useCallback(async (postData: any) => {
        try {
            await createPostMutation.mutateAsync({
                title: postData.title,
                titleEn: postData.titleEn,
                subtitle: postData.subtitle,
                subtitleEn: postData.subtitleEn,
                markdownContent: postData.content,
                markdownContentEn: postData.contentEn,
                category: currentCategory || 'null',
                tags: postData.tags || []
            });

            setShowPostForm(false);
            setFormData(null);
            alert(t('post.form.success.created' as any));
            window.open(window.location.href, '_self'); // TODO:

        } catch (error: any) {
            console.error('포스트 생성 실패:', error);
            alert(formatMessage('post.form.errors.createFailed', {error: error.message}));
        }
    }, [createPostMutation, currentCategory, t, formatMessage]);

    useEffect(() => {
        if (!searchParams.has('page')) {
            const newParams = new URLSearchParams(location.search);
            newParams.set('page', '0');
            navigate(`${location.pathname}?${newParams.toString()}`, {replace: true});
        }
    }, [location.pathname, location.search, navigate, searchParams]);

    const handlePageChange = useCallback((page: number) => {
        const params = new URLSearchParams(location.search);
        params.set('page', page.toString());
        navigate(`${location.pathname}?${params.toString()}`);
    }, [location, navigate]);

    const handleSortChange = useCallback((sort: string) => {
        const params = new URLSearchParams(location.search);
        params.set('sort', sort);
        params.set('page', '0');
        navigate(`${location.pathname}?${params.toString()}`);
    }, [location, navigate]);

    const handleTagFilterClick = useCallback((tag: string) => {
        const params = new URLSearchParams(location.search);
        const currentTags = (params.get('tags') ?? '').split(',').filter(Boolean);

        const newTags = currentTags.includes(tag)
            ? currentTags.filter(t => t !== tag)
            : [...currentTags, tag];

        if (newTags.length > 0) {
            params.set('tags', newTags.join(','));
        } else {
            params.delete('tags');
        }

        params.set('page', '0');
        navigate(`${location.pathname}?${params.toString()}`);
    }, [location, navigate]);

    const handlePostTagClick = useCallback((tag: string) => {
        navigate(`/tag/${tag}`);
    }, [navigate]);

    const handleCardClick = useCallback((post: any) => {
        navigate(`/${post.category || 'uncategorized'}/${post.slug}`);
    }, [navigate]);

    const handleCreatePostClick = useCallback(() => {
        setShowPostForm(true);
    }, []);

    const handleFormSubmit = useCallback(async (formData: any) => {
        try {
            if (!isAuthenticated) {
                // 인증되지 않았으면 폼 데이터 저장하고 인증 모달 표시
                setFormData(formData);
                setShowPostForm(false);
                setAuthMessage(formatMessage('post.auth.required', {
                    action: t('post.auth.actions.create' as any),
                    category: getCategoryName(currentCategory || '')
                }));
                setShowAuthModal(true);
                return;
            }

            // 인증되어 있으면 바로 포스트 생성
            await createPost(formData);
        } catch (error) {
            console.error(t('post.form.errors.formSubmission' as any), error);
        }
    }, [isAuthenticated, currentCategory, createPost, formatMessage, t, getCategoryName]);

    const handleLogin = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
        try {
            const success = await login(credentials);

            if (success) {
                setShowAuthModal(false);

                // 저장된 폼 데이터가 있으면 바로 포스트 생성
                if (formData) {
                    await createPost(formData);
                } else {
                    setShowPostForm(true);
                }

                return true;
            }

            return false;
        } catch (error: any) {
            console.error(t('post.form.errors.loginFailed' as any), error);
            return false;
        }
    }, [login, formData, createPost, t]);

    const handleAuthCancel = () => {
        setShowAuthModal(false);
        setFormData(null);
    };

    const handleFormCancel = () => {
        setShowPostForm(false);
        setFormData(null);
    };

    if (isLoading) {
        return (
            <LoadingContainer>
                <h2>{formatMessage('post.list.loading', {title: pageTitle})}</h2>
                <p>{t('post.list.loadingSubtext' as any)}</p>
            </LoadingContainer>
        );
    }

    if (error) {
        return (
            <ErrorContainer>
                <h2>{t('post.list.error' as any)}</h2>
                <p>{error.message}</p>
                <button onClick={() => window.location.reload()}>
                    {t('post.list.tryAgain' as any)}
                </button>
            </ErrorContainer>
        );
    }

    if (!postsData) {
        return (
            <ErrorContainer>
                <h2>{t('post.list.noData' as any)}</h2>
                <p>{formatMessage('post.list.noDataDetail', {title: pageTitle})}</p>
            </ErrorContainer>
        );
    }

    const posts = postsData?.content || [];
    const totalPages = postsData?.total ? Math.ceil(postsData.total / postsData.size) : 0;

    return (
        <PostListContainer>
            <PostListHeader>
                <TitleRow>
                    <PostListTitleSection>
                        <PostListTitle>{pageTitle}</PostListTitle>
                        <PostCount>{formatMessage('post.list.count', {count: postsData.total || 0})}</PostCount>
                    </PostListTitleSection>

                    {/* 검색 라우트가 아닐 때만 글 작성 버튼 표시 */}
                    {!isSearchRoute && (
                        <CreatePostButton
                            onClick={handleCreatePostClick}
                            disabled={createPostMutation.isPending}
                        >
                            <IoAddCircleOutline size={18}/>
                            {createPostMutation.isPending ? t('post.list.creating' as any) : t('post.list.createButton' as any)}
                        </CreatePostButton>
                    )}
                </TitleRow>

                <FilterContainer>
                    {availableTags.length > 0 && !isSearchRoute && (
                        <TagFilterSection>
                            <h4>{t('post.list.filters.tagFilter' as any)}</h4>
                            <TagList
                                tags={availableTags}
                                selectedTags={selectedTags}
                                onTagClick={handleTagFilterClick}
                            />
                        </TagFilterSection>
                    )}

                    {isSearchRoute && availableTags.length > 0 && (
                        <TagFilterSection>
                            <h4>{formatMessage('post.list.filters.searchResults', {query: searchQuery})}</h4>
                            {searchCategory && (
                                <p style={{margin: '0 0 8px 0', fontSize: '0.9rem', opacity: 0.8}}>
                                    {formatMessage('post.list.filters.categoryFilter', {category: searchCategory})}
                                </p>
                            )}
                            <div style={{marginTop: '12px'}}>
                                <span style={{
                                    fontSize: '0.9rem',
                                    fontWeight: 600
                                }}>{t('post.list.filters.tagFilter' as any)}</span>
                                <div style={{marginTop: '4px'}}>
                                    <TagList
                                        tags={availableTags}
                                        selectedTags={selectedTags}
                                        onTagClick={handleTagFilterClick}
                                    />
                                </div>
                            </div>
                        </TagFilterSection>
                    )}

                    {/* 검색 페이지에서 검색어만 있고 태그가 없는 경우 */}
                    {isSearchRoute && availableTags.length === 0 && searchQuery && (
                        <TagFilterSection>
                            <h4>{formatMessage('post.list.filters.searchResults', {query: searchQuery})}</h4>
                            {searchCategory && (
                                <p style={{margin: 0, fontSize: '0.9rem', opacity: 0.8}}>
                                    {formatMessage('post.list.filters.categoryFilter', {category: searchCategory})}
                                </p>
                            )}
                        </TagFilterSection>
                    )}

                    <SortContainer>
                        <SortLabel>{t('post.list.filters.sortBy' as any)}</SortLabel>
                        <SortSelector
                            options={SORT_OPTIONS}
                            currentSort={currentSort}
                            onSortChange={handleSortChange}
                        />
                    </SortContainer>
                </FilterContainer>
            </PostListHeader>

            <PostsGrid>
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <StyledCard key={post.id} onClick={() => handleCardClick(post)}>
                            <StyledCardTitle>{post.title}</StyledCardTitle>
                            {post.subtitle && (
                                <CardSubtitle>{post.subtitle}</CardSubtitle>
                            )}
                            <StyledCardContent>
                                {post.tags && post.tags.length > 0 && (
                                    <TagList
                                        tags={post.tags}
                                        onTagClick={handlePostTagClick}
                                    />
                                )}
                            </StyledCardContent>
                            <StyledCardFooter>
                                <CardMeta>
                                    {post.category && (
                                        <span>
                                            <IoFolderOpenOutline/>
                                            {post.category}
                                        </span>
                                    )}
                                    <span>
                                        <IoEyeOutline/>
                                        {post.viewCount || 0}
                                    </span>
                                </CardMeta>
                                <PostDate>
                                    <IoCalendarOutline/>
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </PostDate>
                            </StyledCardFooter>
                        </StyledCard>
                    ))
                ) : (
                    <NoPostsMessage>
                        <p>
                            {isSearchRoute
                                ? formatMessage('post.list.noResults.search', {
                                    query: searchQuery,
                                    category: searchCategory ? ` in ${searchCategory}` : ''
                                })
                                : selectedTags.length > 0
                                    ? t('post.list.noResults.filtered' as any)
                                    : t('post.list.noResults.empty' as any)
                            }
                        </p>
                        {isSearchRoute && (
                            <p style={{marginTop: '0.5rem'}}>
                                {t('post.list.noResults.searchTip' as any)}
                            </p>
                        )}
                    </NoPostsMessage>
                )}
            </PostsGrid>

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}

            {/* 포스트 작성 모달 (검색 라우트가 아닐 때만) */}
            {showPostForm && !isSearchRoute && (
                <FormModal>
                    <ModalContent>
                        <ModalHeader>
                            <ModalTitle>{formatMessage('post.form.titles.create', {category: getCategoryName(currentCategory || '')})}</ModalTitle>
                            <CloseButton onClick={handleFormCancel}>×</CloseButton>
                        </ModalHeader>
                        <PostForm
                            category={currentCategory}
                            onSubmit={handleFormSubmit}
                            onCancel={handleFormCancel}
                        />
                    </ModalContent>
                </FormModal>
            )}

            {/* 인증 모달 */}
            {showAuthModal && (
                <AuthModal
                    onLogin={handleLogin}
                    onCancel={handleAuthCancel}
                    message={authMessage}
                />
            )}
        </PostListContainer>
    );
};

export default PostListPage;