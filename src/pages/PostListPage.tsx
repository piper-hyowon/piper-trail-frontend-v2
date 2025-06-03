import React, {useState, useCallback, useEffect, useMemo} from 'react';
import styled from 'styled-components';
import {useParams, useLocation, useNavigate} from 'react-router-dom';
import {Card, CardTitle, CardContent, CardFooter} from '../components/ui/Card';
import TagList from '../components/ui/TagList';
import Pagination from '../components/ui/Pagination';
import SortSelector from '../components/ui/SortSelector';
import AuthModal from '../components/ui/AuthModal';
import PostForm from "../components/ui/PostForm.tsx";
import {IoAddCircleOutline} from "react-icons/io5";
import {usePostsByCategory, usePostsByTag, useSearchPosts, useCreatePost} from '../hooks/useApi';
import {LoginCredentials, useApi} from '../context/ApiContext';

const PAGE_SIZE = 4;
const DEFAULT_SORT = 'createdAt,desc';

const SORT_OPTIONS = [
    {value: 'createdAt,desc', label: 'Latest'},
    {value: 'createdAt,asc', label: 'Oldest'},
    {value: 'viewCount,desc', label: 'Most Viewed'},
    {value: 'title,asc', label: 'Title A-Z'},
    {value: 'title,desc', label: 'Title Z-A'},
];

const PostListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({theme}) => theme.spacing.lg};
  max-width: 1000px;
  margin: 0 auto;
`;

const PostListHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({theme}) => theme.spacing.md};
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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
  color: ${({theme}) => theme.colors.primary};
  margin: 0 0 ${({theme}) => theme.spacing.xs} 0;
`;

const PostCount = styled.p`
  margin: 0;
  color: ${({theme}) => theme.colors.text}80;
  font-size: ${({theme}) => theme.fontSizes.small};
`;

const CreatePostButton = styled.button`
  background-color: ${({theme}) => theme.colors.success};
  color: white;
  font-weight: bold;
  padding: ${({theme}) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border: none;
  border-radius: ${({theme}) => theme.borderRadius};
  display: flex;
  align-items: center;
  gap: ${({theme}) => theme.spacing.xs};
  cursor: pointer;
  transition: ${({theme}) => theme.transitions.default};
  white-space: nowrap;
  height: fit-content;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    align-self: flex-start;
    padding: ${({theme}) => `${theme.spacing.xs} ${theme.spacing.md}`};
    font-size: ${({theme}) => theme.fontSizes.small};
  }
`;

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({theme}) => theme.spacing.md};
  background: ${({theme}) => `${theme.colors.background}F0`};
  padding: ${({theme}) => theme.spacing.md};
  border-radius: ${({theme}) => theme.borderRadius};
  border: 1px solid ${({theme}) => `${theme.colors.primary}20`};

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
    font-size: ${({theme}) => theme.fontSizes.small};
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
  }
`;

const SortLabel = styled.label`
  font-size: ${({theme}) => theme.fontSizes.small};
  color: ${({theme}) => theme.colors.primary};
  font-weight: 600;
  margin: 0;
`;

const PostDate = styled.span`
  color: ${({theme}) => theme.colors.text}80;
  font-size: ${({theme}) => theme.fontSizes.small};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({theme}) => theme.spacing.xl};
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
`;

const ErrorContainer = styled.div`
  background-color: ${({theme}) => `${theme.colors.error}10`};
  border: 1px solid ${({theme}) => theme.colors.error};
  border-radius: ${({theme}) => theme.borderRadius};
  padding: ${({theme}) => theme.spacing.lg};
  margin: ${({theme}) => theme.spacing.lg} 0;
  max-width: 600px;
  margin: ${({theme}) => theme.spacing.lg} auto;
`;

const PostsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({theme}) => theme.spacing.lg};
`;

const NoPostsMessage = styled.div`
  text-align: center;
  padding: ${({theme}) => theme.spacing.xl};
  color: ${({theme}) => theme.colors.text}80;
  background: ${({theme}) => `${theme.colors.background}F0`};
  border-radius: ${({theme}) => theme.borderRadius};
  border: 1px solid ${({theme}) => `${theme.colors.primary}20`};
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
  max-width: 600px;
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
  border-bottom: 1px solid ${({theme}) => theme.colors.text}20;
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
  color: ${({theme}) => theme.colors.text}80;

  &:hover {
    color: ${({theme}) => theme.colors.text};
  }
`;

const PostListPage: React.FC = () => {
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // ApiContext에서 인증 상태와 함수들 가져오기
    const {isAuthenticated, login} = useApi();

    const isTagRoute = location.pathname.startsWith('/tag/');
    const isSearchRoute = location.pathname.startsWith('/search');
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const currentCategory = isTagRoute
        ? params.tagName
        : (params.categoryName || pathSegments[0]);

    const searchParams = new URLSearchParams(location.search);
    const currentPage = parseInt(searchParams.get('page') || '0');
    const currentSort = searchParams.get('sort') || DEFAULT_SORT;
    const selectedTags = searchParams.get('tags')?.split(',').filter(Boolean) || [];

    // 검색 관련 파라미터
    const searchQuery = searchParams.get('q') || '';
    const searchCategory = searchParams.get('category') || '';

    // 모달 상태 관리
    const [showPostForm, setShowPostForm] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMessage, setAuthMessage] = useState('');
    const [formData, setFormData] = useState<any>(null);

    const createPostMutation = useCreatePost();

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
                return `Search: "${searchQuery}"${searchCategory ? ` in ${searchCategory}` : ''}`;
            }
            return 'Search Results';
        }
        if (isTagRoute && params.tagName) return `Tag: #${params.tagName}`;
        if (currentCategory) {
            if (currentCategory === 'null') return 'Uncategorized';
            return currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);
        }
        return 'Category Not Found';
    }, [currentCategory, params.tagName, isTagRoute, isSearchRoute, searchQuery, searchCategory]);

    const getCategoryName = (category: string): string => {
        if (isSearchRoute) return 'Search';
        if (isTagRoute) return pageTitle;
        switch (category) {
            case 'tech':
                return 'Tech';
            case 'food':
                return 'Food';
            default:
                return category?.charAt(0).toUpperCase() + category?.slice(1) || 'Unknown';
        }
    };

    const createPost = useCallback(async (postData: any) => {
        try {
            await createPostMutation.mutateAsync({
                title: postData.title,
                markdownContent: postData.content,
                category: currentCategory,
                tags: postData.tags || []
            });

            setShowPostForm(false);
            setFormData(null);
            alert('포스트가 생성되었습니다!');
            // window.location.reload();
            window.open(window.location.href, '_self'); // TODO:

        } catch (error: any) {
            console.error('포스트 생성 실패:', error);
            alert(`포스트 생성에 실패했습니다: ${error.message}`);

        }
    }, [createPostMutation, currentCategory]);

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
        const currentTags = params.get('tags')?.split(',').filter(Boolean) || [];

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
        navigate(`/${post.category || currentCategory}/${post.slug}`);
    }, [navigate, currentCategory]);

    const handleCreatePostClick = useCallback(() => {
        setShowPostForm(true);
    }, []);

    const handleFormSubmit = useCallback(async (formData: any) => {
        try {
            if (!isAuthenticated) {
                // 인증되지 않았으면 폼 데이터 저장하고 인증 모달 표시
                setFormData(formData);
                setShowPostForm(false);
                setAuthMessage(`${getCategoryName(currentCategory || '')} 카테고리에 새 글을 작성하려면 인증이 필요합니다.`);
                setShowAuthModal(true);
                return;
            }

            // 인증되어 있으면 바로 포스트 생성
            await createPost(formData);
        } catch (error) {
            console.error('Form submission failed:', error);
        }
    }, [isAuthenticated, currentCategory, createPost]);

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
            console.error('Login failed:', error);
            return false;
        }
    }, [login, formData, createPost]);

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
                <h2>Loading {pageTitle} content...</h2>
                <p>Please wait while we retrieve the posts.</p>
            </LoadingContainer>
        );
    }

    if (error) {
        return (
            <ErrorContainer>
                <h2>Error Loading Posts</h2>
                <p>{error.message}</p>
                <button onClick={() => window.location.reload()}>
                    Try Again
                </button>
            </ErrorContainer>
        );
    }

    if (!postsData) {
        return (
            <ErrorContainer>
                <h2>No Posts Available</h2>
                <p>Could not load posts for {pageTitle}</p>
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
                        <PostCount>총 {postsData.total || 0}개의 포스트</PostCount>
                    </PostListTitleSection>

                    {/* 검색 라우트가 아닐 때만 글 작성 버튼 표시 */}
                    {!isSearchRoute && (
                        <CreatePostButton
                            onClick={handleCreatePostClick}
                            disabled={createPostMutation.isPending}
                        >
                            <IoAddCircleOutline size={16}/>
                            {createPostMutation.isPending ? '작성 중...' : '글 작성하기'}
                        </CreatePostButton>
                    )}
                </TitleRow>

                <FilterContainer>
                    {availableTags.length > 0 && !isSearchRoute && (
                        <TagFilterSection>
                            <h4>Filter by tags:</h4>
                            <TagList
                                tags={availableTags}
                                selectedTags={selectedTags}
                                onTagClick={handleTagFilterClick}
                            />
                        </TagFilterSection>
                    )}

                    {isSearchRoute && availableTags.length > 0 && (
                        <TagFilterSection>
                            <h4>Search Results for: "{searchQuery}"</h4>
                            {searchCategory && (
                                <p style={{margin: '0 0 8px 0', fontSize: '0.9rem', opacity: 0.8}}>
                                    in category: {searchCategory}
                                </p>
                            )}
                            <div style={{marginTop: '12px'}}>
                                <span style={{fontSize: '0.9rem', fontWeight: 600}}>Filter by tags:</span>
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
                            <h4>Search Results for: "{searchQuery}"</h4>
                            {searchCategory && (
                                <p style={{margin: 0, fontSize: '0.9rem', opacity: 0.8}}>
                                    in category: {searchCategory}
                                </p>
                            )}
                        </TagFilterSection>
                    )}

                    <SortContainer>
                        <SortLabel>Sort by:</SortLabel>
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
                        <Card key={post.id} onClick={() => handleCardClick(post)}>
                            <CardTitle>{post.title}</CardTitle>
                            <CardContent>
                                <p>{post.preview}</p>
                                {post.tags && post.tags.length > 0 && (
                                    <TagList
                                        tags={post.tags}
                                        onTagClick={handlePostTagClick}
                                    />
                                )}
                            </CardContent>
                            <CardFooter>
                                <div>
                                    {post.category && <span>Category: {post.category}</span>}
                                    <span style={{marginLeft: post.category ? '1rem' : '0'}}>
                                        Views: {post.viewCount || 0}
                                    </span>
                                </div>
                                <PostDate>
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </PostDate>
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <NoPostsMessage>
                        <p>
                            {isSearchRoute
                                ? `No posts found for "${searchQuery}"${searchCategory ? ` in ${searchCategory}` : ''}`
                                : `No posts found${selectedTags.length > 0 ? ' matching your filter criteria' : ''}`
                            }.
                        </p>
                        {isSearchRoute && (
                            <p style={{marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.8}}>
                                Try different keywords or search in all categories.
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
                            <ModalTitle>새 {getCategoryName(currentCategory || '')} 포스트 작성</ModalTitle>
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