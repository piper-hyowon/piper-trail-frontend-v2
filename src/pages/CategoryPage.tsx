import React, {useEffect, useState, useRef, useCallback} from 'react';
import styled from 'styled-components';
import {useParams, useLocation} from 'react-router-dom';
import {mockApi, ApiResponse} from '../services/mockApi';
import {Card, CardTitle, CardContent, CardFooter} from '../components/ui/Card';
import TagList from '../components/ui/TagList';
import Pagination from '../components/ui/Pagination';
import SortSelector from '../components/ui/SortSelector';
import ApiLink from '../components/ui/ApiLink';
import {HttpMethod, useApi} from "../context/ApiContext";
import AuthModal from '../components/ui/AuthModal';
import PostForm from "../components/ui/PostForm.tsx";

const CategoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({theme}) => theme.spacing.lg};
`;

const CategoryTitle = styled.h1`
  color: ${({theme}) => theme.colors.primary};
  margin-bottom: ${({theme}) => theme.spacing.md};
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({theme}) => theme.spacing.md};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({theme}) => theme.spacing.md};
  }
`;

const PostDate = styled.span`
  color: ${({theme}) => theme.colors.text}80;
  font-size: ${({theme}) => theme.fontSizes.small};
`;

const ResourceLinksSection = styled.div`
  margin-top: ${({theme}) => theme.spacing.xl};
  padding: ${({theme}) => theme.spacing.md};
  background-color: ${({theme}) => `${theme.colors.secondaryBackground}`};
  border-radius: ${({theme}) => theme.borderRadius};
`;

const ResourceLinksTitle = styled.h3`
  margin-bottom: ${({theme}) => theme.spacing.md};
  color: ${({theme}) => theme.colors.primary};
`;

const ApiNavLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({theme}) => theme.spacing.md};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({theme}) => theme.spacing.xl};
  text-align: center;
`;

const ErrorContainer = styled.div`
  background-color: ${({theme}) => `${theme.colors.error}10`};
  border: 1px solid ${({theme}) => theme.colors.error};
  border-radius: ${({theme}) => theme.borderRadius};
  padding: ${({theme}) => theme.spacing.lg};
  margin: ${({theme}) => theme.spacing.lg} 0;
`;

const RetryButton = styled.button`
  margin-top: ${({theme}) => theme.spacing.md};
  background-color: ${({theme}) => theme.colors.primary};
  color: white;
`;

const CategoryPage: React.FC = () => {
    const params = useParams();
    const location = useLocation();
    const category = params.category || location.pathname.split('/')[1];
    const {navigateTo, fetchApiData} = useApi();

    // 상태 정의
    const [data, setData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // 무한 루프 방지를 위한 Refs
    const prevLocationRef = useRef(location.pathname + location.search);
    const fetchInProgressRef = useRef(false);

    // URL 파라미터 파싱 - useEffect 바깥에서 수행
    const searchParams = new URLSearchParams(location.search);
    const currentPage = parseInt(searchParams.get('page') || '1');
    const currentSort = searchParams.get('sort') || 'recent';
    const selectedTags = searchParams.get('tags')?.split(',').filter(Boolean) || [];

    const [showPostForm, setShowPostForm] = useState<boolean>(false);
    const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
    const [authMessage, setAuthMessage] = useState<string>('');
    const [currentMethod, setCurrentMethod] = useState<HttpMethod>('GET');

    // 카테고리 이름 표시를 위한 함수
    const getCategoryName = useCallback(() => {
        switch (category) {
            case 'tech_and_studies':
                return 'Tech and Studies';
            case 'food':
                return 'Food';
            case 'books':
                return 'Books';
            case 'thoughts':
                return 'Thoughts';
            case 'about':
                return 'About';
            case 'projects':
                return 'Projects';
            case 'stamps':
                return 'Visitor Stamps';
            default:
                return category;
        }
    }, [category]);
    // 컨텐츠 재로드
    const handleRetry = useCallback(() => {
        // 현재 URL 초기화하여 데이터 다시 로딩
        prevLocationRef.current = '';
        fetchInProgressRef.current = false;
        setLoading(true);
        setError(null);
    }, []);


    const handleApiLinkClick = useCallback(async (href: string, linkMethod?: string) => {
        try {
            const method = linkMethod as HttpMethod || 'GET';

            // POST 메서드인 경우 폼이나 인증 모달 표시
            if (method === 'POST') {
                setCurrentMethod('POST');

                try {
                    const isAuthenticated = mockApi.getAuthStatus();

                    if (isAuthenticated) {
                        // 인증된 경우 폼 표시
                        setShowPostForm(true);
                    } else {
                        // 인증되지 않은 경우 인증 모달 표시
                        setAuthMessage(`Authentication is required to create a new post in ${getCategoryName()}.`);
                        setShowAuthModal(true);
                    }
                } catch (error) {
                    console.error('Authentication check failed:', error);
                    setAuthMessage('Authentication is required for this action.');
                    setShowAuthModal(true);
                }
            } else {
                await fetchApiData(href, method);
            }
        } catch (error) {
            console.error('Failed to fetch API data', error);
        }
    }, [fetchApiData, getCategoryName]);


    const handleFormSubmit = useCallback(async (formData: any) => {
        try {
            // 폼 데이터를 사용하여 API 요청 구현
            console.log('Submitting form data:', formData);

            // 여기서 실제 API 요청을 수행할 수 있음
            const url = `/${category}`;
            const response = await mockApi.fetchData(url, 'POST', formData);

            // 응답 처리
            console.log('Form submission response:', response);

            // 폼 닫기
            setShowPostForm(false);

            // 성공 메시지 또는 다른 처리
            alert('Post created successfully!');

            // 데이터 다시 로드
            handleRetry();
        } catch (error) {
            console.error('Form submission failed:', error);
            alert(`Failed to create post: ${error instanceof Error ? error.message : String(error)}`);
        }
    }, [category, handleRetry]);

    const handleFormCancel = useCallback(() => {
        setShowPostForm(false);
    }, []);

    const handleLogin = useCallback(async (username: string, password: string): Promise<boolean> => {
        try {
            // 로그인 로직 구현
            // 실제 구현에서는 API 호출이 필요할 수 있음
            const success = await mockApi.login(username, password);

            if (success) {
                // 로그인 성공 시 인증 모달 닫고 폼 표시
                setShowAuthModal(false);
                setShowPostForm(true);
                return true;
            }

            return false;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    }, []);

    const handleAuthCancel = useCallback(() => {
        setShowAuthModal(false);
    }, []);



    // 데이터 로딩
    useEffect(() => {
        // 현재 URL이 이전 URL과 같고, 이미 데이터가 로딩되었다면 중복 요청 건너뛰기
        const currentLocation = location.pathname + location.search;
        if (
            currentLocation === prevLocationRef.current &&
            data !== null &&
            !loading
        ) {
            return;
        }

        // 진행 중인 fetch가 있으면 건너뛰기
        if (fetchInProgressRef.current) {
            return;
        }

        // 카테고리가 없으면 건너뛰기
        if (!category) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            // 중복 요청 방지
            if (fetchInProgressRef.current) return;
            fetchInProgressRef.current = true;

            try {
                setLoading(true);

                const urlParams = new URLSearchParams();
                urlParams.set('page', currentPage.toString());
                urlParams.set('sort', currentSort);
                if (selectedTags.length > 0) {
                    urlParams.set('tags', selectedTags.join(','));
                }

                const url = `/${category}?${urlParams.toString()}`;

                const response = await mockApi.fetchData(url);

                // 상태 업데이트
                setData(response);
                setLoading(false);
                setError(null);

                // 현재 URL 저장
                prevLocationRef.current = currentLocation;
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load data");
                setLoading(false);
            } finally {
                fetchInProgressRef.current = false;
            }
        };

        fetchData();

    }, [category, location.pathname, location.search]);

    // 이벤트 핸들러
    const handlePageChange = useCallback((page: number) => {
        if (!category) return;

        const params = new URLSearchParams(location.search);
        params.set('page', page.toString());

        navigateTo(`/${category}?${params.toString()}`);
    }, [category, location.search, navigateTo]);

    const handleSortChange = useCallback((sort: string) => {
        if (!category) return;

        const params = new URLSearchParams(location.search);
        params.set('sort', sort);
        params.set('page', '1'); // 정렬 변경 시 1페이지로 리셋

        navigateTo(`/${category}?${params.toString()}`);
    }, [category, navigateTo]);

    const handleTagClick = useCallback((tag: string) => {
        if (!category) return;

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

        params.set('page', '1'); // 태그 변경 시 1페이지로 리셋

        navigateTo(`/${category}?${params.toString()}`);
    }, [category, navigateTo]);


    const handleCardClick = useCallback((postId: string) => {
        if (category) {
            navigateTo(`/${category}/${postId}`);
        }
    }, [category, navigateTo]);


    // 로딩 상태
    if (loading && !data) {
        return (
            <LoadingContainer>
                <h2>Loading {getCategoryName()} content...</h2>
                <p>Please wait while we retrieve the data.</p>
            </LoadingContainer>
        );
    }

    // 에러 상태
    if (error) {
        return (
            <ErrorContainer>
                <h2>Error Loading Data</h2>
                <p>{error}</p>
                <RetryButton onClick={handleRetry}>
                    Try Again
                </RetryButton>
            </ErrorContainer>
        );
    }

    // 데이터 없음 상태
    if (!data) {
        return (
            <ErrorContainer>
                <h2>No Data Available</h2>
                <p>Could not load content for {getCategoryName()}</p>
                <RetryButton onClick={handleRetry}>
                    Try Again
                </RetryButton>
            </ErrorContainer>
        );
    }

    // about 페이지 렌더링
    if (category === 'about' && data) {
        return (
            <CategoryContainer>
                <CategoryTitle>{data.data.title}</CategoryTitle>
                <Card>
                    <CardContent>
                        <p>{data.data.content}</p>
                        {data.data.profile && (
                            <div style={{marginTop: '20px'}}>
                                <h3>Profile</h3>
                                <p><strong>Name:</strong> {data.data.profile.name}</p>
                                <p><strong>Occupation:</strong> {data.data.profile.occupation}</p>
                                {data.data.profile.interests && (
                                    <>
                                        <p><strong>Interests:</strong></p>
                                        <TagList tags={data.data.profile.interests}/>
                                    </>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <ResourceLinksSection>
                    <ResourceLinksTitle>Resource Links</ResourceLinksTitle>
                    <ApiNavLinks>
                        {Object.entries(data._links).map(([key, link]) => (
                            <ApiLink
                                key={key}
                                method={link.method || 'GET'}
                                path={link.href}
                                onClick={() => handleApiLinkClick(link.href, link.method)}
                            />
                        ))}
                    </ApiNavLinks>
                </ResourceLinksSection>
            </CategoryContainer>
        );
    }

    // 스탬프 페이지 렌더링
    if (category === 'stamps' && data) {
        return (
            <CategoryContainer>
                <CategoryTitle>Visitor Stamps</CategoryTitle>

                {data.data.stamps && data.data.stamps.length > 0 ? (
                    data.data.stamps.map((stamp: any) => (
                        <Card key={stamp.id}>
                            <CardContent>
                                <p>"{stamp.message}"</p>
                            </CardContent>
                            <CardFooter>
                                <div>From: <strong>{stamp.author}</strong></div>
                                <PostDate>{new Date(stamp.created_at).toLocaleDateString()}</PostDate>
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <p>No stamps yet. Be the first to leave your mark!</p>
                )}

                <ResourceLinksSection>
                    <ResourceLinksTitle>Resource Links</ResourceLinksTitle>
                    <ApiNavLinks>
                        {Object.entries(data._links).map(([key, link]) => (
                            <ApiLink
                                key={key}
                                method={link.method || 'GET'}
                                path={link.href}
                                onClick={() => handleApiLinkClick(link.href)}
                            />
                        ))}
                    </ApiNavLinks>
                </ResourceLinksSection>
            </CategoryContainer>
        );
    }

    // 일반 카테고리 (포스트 목록) 렌더링
    const posts = data.data.posts || [];
    const pagination = data.data.pagination || {current_page: 1, total_pages: 1};
    const availableTags = data.data.filtering?.available_tags || [];

    const sortOptions = [
        {value: 'recent', label: 'Most Recent'},
        {value: 'title_asc', label: 'Title (A-Z)'},
        {value: 'title_desc', label: 'Title (Z-A)'}
    ];

    return (

        <CategoryContainer>
            <div>
                <CategoryTitle>{getCategoryName()}</CategoryTitle>
                <p>Explore {getCategoryName()} content below.</p>
            </div>

            <FilterContainer>
                {availableTags.length > 0 && (
                    <div>
                        <TagList
                            tags={availableTags}
                            selectedTags={selectedTags}
                            onTagClick={handleTagClick}
                        />
                    </div>
                )}

                <SortSelector
                    options={sortOptions}
                    currentSort={currentSort}
                    onSortChange={handleSortChange}
                />
            </FilterContainer>

            {posts.length > 0 ? (
                posts.map((post: any) => (
                    <Card key={post.id} onClick={() => handleCardClick(post.id)}>
                        <CardTitle>{post.title}</CardTitle>
                        <CardContent>
                            <p>{post.summary}</p>
                            {post.tags && <TagList tags={post.tags}/>}
                        </CardContent>
                        <CardFooter>
                            <PostDate>{new Date(post.created_at).toLocaleDateString()}</PostDate>
                        </CardFooter>
                    </Card>
                ))
            ) : (
                <p>No posts found matching your criteria.</p>
            )}

            {pagination && pagination.total_pages > 1 && (
                <Pagination
                    currentPage={pagination.current_page}
                    totalPages={pagination.total_pages}
                    onPageChange={handlePageChange}
                />
            )}

            {showPostForm && (
                <PostForm
                    category={category}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                />
            )}

            {showAuthModal && (
                <AuthModal
                    onLogin={handleLogin}
                    onCancel={handleAuthCancel}
                    message={authMessage}
                />
            )}

            <ResourceLinksSection>
                <ResourceLinksTitle>Resource Links</ResourceLinksTitle>
                <ApiNavLinks>
                    {Object.entries(data._links).map(([key, link]) => (
                        <ApiLink
                            key={key}
                            method={link.method || 'GET'}
                            path={link.href}
                            onClick={() => handleApiLinkClick(link.href)}
                        />
                    ))}
                </ApiNavLinks>
            </ResourceLinksSection>
        </CategoryContainer>
    );
};

export default CategoryPage;