import React, {useState, useCallback} from "react";
import styled from "styled-components";
import {useParams, Link, useNavigate} from "react-router-dom";
import {usePost, useUpdatePost, useDeletePost} from "../hooks/useApi";
import {useApi, LoginCredentials} from "../context/ApiContext";
import TagList from "../components/ui/TagList";
import PostForm from "../components/ui/PostForm";
import DeleteConfirmModal from "../components/ui/DeleteConfirmModal";
import AuthModal from "../components/ui/AuthModal";
import {CommentSection} from "../components/ui/comments/CommentSection.tsx";

const PostDetailContainer = styled.article`
  max-width: 1000px;
  margin: 0 auto;
  padding: ${({theme}) => theme.spacing.md} ${({theme}) => theme.spacing.lg};

  /* 모바일 반응형 */
  @media (max-width: 768px) {
    padding: ${({theme}) => theme.spacing.sm};
    max-width: 100%;
  }

  @media (min-width: 1200px) {
    max-width: 1100px;
  }
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({theme}) => theme.spacing.xs};
  color: ${({theme}) => theme.colors.primary};
  text-decoration: none;
  font-weight: 500;
  margin-bottom: ${({theme}) => theme.spacing.lg};
  padding: ${({theme}) => theme.spacing.xs} ${({theme}) => theme.spacing.sm};
  border-radius: ${({theme}) => theme.borderRadius};
  background: ${({theme}) => `${theme.colors.primary}10`};
  border: 1px solid ${({theme}) => `${theme.colors.primary}30`};
  transition: ${({theme}) => theme.transitions.default};

  &:hover {
    background: ${({theme}) => `${theme.colors.primary}20`};
    transform: translateX(-2px);
  }

  &::before {
    content: "←";
    font-size: 1.1em;
  }
`;

const PostHeader = styled.header`
  margin-bottom: ${({theme}) => theme.spacing.xl};
  padding: ${({theme}) => theme.spacing.lg};
  background: ${({theme}) => theme.colors.background};
  border-radius: ${({theme}) => theme.borderRadius};
  border-left: 4px solid ${({theme}) => theme.colors.primary};
`;

const PostTitle = styled.h1`
  color: ${({theme}) => theme.colors.primary};
  font-size: clamp(1.8rem, 4vw, 2.5rem); /* 반응형 폰트 크기 */
  line-height: 1.2;
  margin-bottom: ${({theme}) => theme.spacing.md};
  word-break: keep-all; /* 한글 줄바꿈 개선 */
`;

const PostMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({theme}) => theme.spacing.md};
  align-items: center;
  margin-bottom: ${({theme}) => theme.spacing.lg};
  padding: ${({theme}) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({theme}) => `${theme.colors.primary}20`};
`;

const PostMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({theme}) => theme.spacing.xs};
  font-size: ${({theme}) => theme.fontSizes.small};
  color: ${({theme}) => `${theme.colors.text}80`};
  background: ${({theme}) => theme.colors.background};
  padding: ${({theme}) => theme.spacing.xs} ${({theme}) => theme.spacing.sm};
  border-radius: 20px;
  border: 1px solid ${({theme}) => `${theme.colors.primary}20`};
`;

const MetaIcon = styled.span`
  font-size: 1em;
  opacity: 0.8;
`;

const CategoryLink = styled(Link)`
  color: ${({theme}) => theme.colors.primary};
  text-decoration: none;
  font-weight: 600;
  padding: ${({theme}) => theme.spacing.xs} ${({theme}) => theme.spacing.sm};
  background: ${({theme}) => `${theme.colors.primary}15`};
  border-radius: 16px;
  border: 1px solid ${({theme}) => `${theme.colors.primary}30`};
  transition: ${({theme}) => theme.transitions.default};

  &:hover {
    background: ${({theme}) => `${theme.colors.primary}25`};
    transform: translateY(-1px);
  }
`;

const TagSection = styled.div`
  margin-top: ${({theme}) => theme.spacing.md};
`;

const PostContent = styled.div`
  line-height: 1.8;
  font-size: 1.1rem;
  color: ${({theme}) => theme.colors.text};
  margin-bottom: ${({theme}) => theme.spacing.xl};
  padding: ${({theme}) => theme.spacing.lg};
  background: ${({theme}) => theme.colors.background};
  border-radius: ${({theme}) => theme.borderRadius};
  box-shadow: 0 2px 8px ${({theme}) => `${theme.colors.primary}10`};

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: ${({theme}) => theme.colors.primary};
    margin-top: ${({theme}) => theme.spacing.xl};
    margin-bottom: ${({theme}) => theme.spacing.md};
    padding-bottom: ${({theme}) => theme.spacing.xs};
    border-bottom: 2px solid ${({theme}) => `${theme.colors.primary}20`};
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.7rem;
  }

  h3 {
    font-size: 1.4rem;
  }

  p {
    margin-bottom: ${({theme}) => theme.spacing.md};
    text-align: justify;
  }

  // 인라인 코드
  code {
    background-color: ${({theme}) => theme.colors.secondaryBackground};
    color: ${({theme}) => theme.colors.primary};
    padding: 3px 6px;
    border-radius: 4px;
    font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
    font-size: 0.9em;
    border: 1px solid ${({theme}) => `${theme.colors.primary}30`};
    font-weight: 500;
  }

  // 코드 블록
  pre {
    background-color: ${({theme}) => theme.colors.secondaryBackground};
    padding: ${({theme}) => theme.spacing.md};
    border-radius: ${({theme}) => theme.borderRadius};
    overflow-x: auto;
    margin: ${({theme}) => theme.spacing.md} 0;
    border: 1px solid ${({theme}) => `${theme.colors.primary}20`};
    box-shadow: inset 0 2px 4px ${({theme}) => `${theme.colors.primary}10`};
    position: relative;

    border-left: 4px solid ${({theme}) => theme.colors.primary};

    code {
      background-color: transparent;
      padding: 0;
      border: none;
      color: ${({theme}) => theme.colors.text};
      font-weight: normal;
    }
  }

  blockquote {
    border-left: 4px solid ${({theme}) => theme.colors.primary};
    padding: ${({theme}) => theme.spacing.md};
    margin: ${({theme}) => theme.spacing.md} 0;
    background: ${({theme}) => `${theme.colors.primary}05`};
    border-radius: 0 ${({theme}) => theme.borderRadius} ${({theme}) => theme.borderRadius} 0;
    font-style: italic;
    color: ${({theme}) => `${theme.colors.text}90`};
  }

  ul,
  ol {
    margin-bottom: ${({theme}) => theme.spacing.md};
    padding-left: ${({theme}) => theme.spacing.lg};
  }

  li {
    margin-bottom: ${({theme}) => theme.spacing.xs};
    line-height: 1.6;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: ${({theme}) => theme.borderRadius};
    box-shadow: 0 4px 12px ${({theme}) => `${theme.colors.primary}20`};
    margin: ${({theme}) => theme.spacing.md} auto;
    display: block;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: ${({theme}) => theme.spacing.md} 0;
    background: ${({theme}) => theme.colors.secondaryBackground};
    border-radius: ${({theme}) => theme.borderRadius};
    overflow: hidden;
  }

  th,
  td {
    padding: ${({theme}) => theme.spacing.sm};
    text-align: left;
    border-bottom: 1px solid ${({theme}) => `${theme.colors.primary}20`};
  }

  th {
    background: ${({theme}) => `${theme.colors.primary}15`};
    font-weight: bold;
    color: ${({theme}) => theme.colors.primary};
  }
`;

const PostFooter = styled.footer`
  padding: ${({theme}) => theme.spacing.lg};
  background: ${({theme}) => theme.colors.background};
  border-radius: ${({theme}) => theme.borderRadius};
  border-top: 3px solid ${({theme}) => theme.colors.primary};
  margin-bottom: ${({theme}) => theme.spacing.xl};
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({theme}) => theme.spacing.md};
`;

const ShareSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({theme}) => theme.spacing.sm};
`;

const ActionSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({theme}) => theme.spacing.sm};
`;

const ShareText = styled.span`
  color: ${({theme}) => `${theme.colors.text}80`};
  font-size: ${({theme}) => theme.fontSizes.small};
`;

const ShareButton = styled.button`
  background: ${({theme}) => theme.colors.primary};
  color: white;
  border: none;
  padding: ${({theme}) => theme.spacing.xs} ${({theme}) => theme.spacing.sm};
  border-radius: ${({theme}) => theme.borderRadius};
  cursor: pointer;
  font-size: ${({theme}) => theme.fontSizes.small};
  transition: ${({theme}) => theme.transitions.default};

  &:hover {
    background: ${({theme}) => theme.colors.secondary};
    transform: translateY(-1px);
  }
`;

const ActionButton = styled.button<{ $variant?: 'edit' | 'delete' }>`
  background: ${({theme, $variant}) =>
          $variant === 'delete' ? theme.colors.error : theme.colors.primary};
  color: white;
  border: none;
  padding: ${({theme}) => theme.spacing.xs} ${({theme}) => theme.spacing.sm};
  border-radius: ${({theme}) => theme.borderRadius};
  cursor: pointer;
  font-size: ${({theme}) => theme.fontSizes.small};
  transition: ${({theme}) => theme.transitions.default};
  display: flex;
  align-items: center;
  gap: ${({theme}) => theme.spacing.xs};

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 1.2rem;
  color: ${({theme}) => `${theme.colors.text}80`};
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  padding: ${({theme}) => theme.spacing.xl};
  background: ${({theme}) => `${theme.colors.error}10`};
  border-radius: ${({theme}) => theme.borderRadius};
  border: 1px solid ${({theme}) => `${theme.colors.error}30`};
`;

const ErrorTitle = styled.h1`
  color: ${({theme}) => theme.colors.error};
  margin-bottom: ${({theme}) => theme.spacing.md};
`;

const ErrorMessage = styled.p`
  color: ${({theme}) => `${theme.colors.text}80`};
  margin-bottom: ${({theme}) => theme.spacing.lg};
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

const PostDetailPage: React.FC = () => {
    const {category, postSlug} = useParams<{
        category: string;
        postSlug: string;
    }>();
    const navigate = useNavigate();
    const {isAuthenticated, login} = useApi();

    if (!postSlug) {
        return (
            <PostDetailContainer>
                <ErrorContainer>
                    <ErrorTitle>잘못된 포스트 URL</ErrorTitle>
                    <ErrorMessage>포스트 slug 를 찾을 수 없습니다.</ErrorMessage>
                    <BackButton to="/">홈으로 돌아가기</BackButton>
                </ErrorContainer>
            </PostDetailContainer>
        );
    }

    const {data: post, isLoading, error} = usePost(postSlug!);

    // 모달 상태 관리
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMessage, setAuthMessage] = useState('');
    const [formData, setFormData] = useState<any>(null);
    const [pendingAction, setPendingAction] = useState<'update' | 'delete' | null>(null);

    const updatePostMutation = useUpdatePost();
    const deletePostMutation = useDeletePost();

    // NavigationBar와의 통신을 위한 이벤트 리스너
    React.useEffect(() => {
        const handleRequestPostData = () => {
            if (post) {
                window.dispatchEvent(new CustomEvent('postData', {
                    detail: {
                        id: post.id,
                        title: post.title,
                        markdownContent: post.content || post.content,
                        content: post.content,
                        tags: post.tags,
                        category: post.category
                    }
                }));
            }
        };

        window.addEventListener('requestPostData', handleRequestPostData);

        return () => {
            window.removeEventListener('requestPostData', handleRequestPostData);
        };
    }, [post]);

    const updatePost = useCallback(async (postData: any) => {
        try {
            if (!post?.id) {
                throw new Error('포스트 ID를 찾을 수 없습니다.');
            }

            await updatePostMutation.mutateAsync({
                postId: post.id.toString(),
                post: {
                    title: postData.title,
                    markdownContent: postData.content,
                    tags: postData.tags || []
                }
            });

            setShowUpdateForm(false);
            setFormData(null);
            setPendingAction(null);
            alert('포스트가 수정되었습니다!');
            window.location.reload();

        } catch (error: any) {
            console.error('Post update failed:', error);
            alert(`포스트 수정에 실패했습니다: ${error.message}`);
        }
    }, [updatePostMutation, post]);

    const deletePost = useCallback(async () => {
        try {
            if (!post?.id) {
                throw new Error('포스트 ID를 찾을 수 없습니다.');
            }

            await deletePostMutation.mutateAsync(post.id.toString());

            setShowDeleteModal(false);
            setPendingAction(null);
            alert('포스트가 삭제되었습니다!');
            navigate(`/${post.category}`);

        } catch (error: any) {
            console.error('Post deletion failed:', error);
            alert(`포스트 삭제에 실패했습니다: ${error.message}`);
        }
    }, [deletePostMutation, post, navigate]);

    const handleUpdateClick = useCallback(() => {
        if (!post) return;
        setShowUpdateForm(true);
    }, [post]);

    const handleDeleteClick = useCallback(() => {
        if (!post) return;
        setShowDeleteModal(true);
    }, [post]);

    const handleUpdateSubmit = useCallback(async (formData: any) => {
        try {
            if (!isAuthenticated) {
                // 인증되지 않았으면 폼 데이터 저장, 인증 모달 표시
                setFormData(formData);
                setPendingAction('update');
                setShowUpdateForm(false);
                setAuthMessage(`${post?.category} 포스트를 수정하려면 인증이 필요합니다.`);
                setShowAuthModal(true);
                return;
            }

            // 인증되어 있으면 바로 포스트 수정
            await updatePost(formData);
        } catch (error) {
            console.error('Form submission failed:', error);
        }
    }, [isAuthenticated, post, updatePost]);

    const handleDeleteConfirm = useCallback(async () => {
        try {
            if (!isAuthenticated) {
                setPendingAction('delete');
                setShowDeleteModal(false);
                setAuthMessage(`${post?.category} 포스트를 삭제하려면 인증이 필요합니다.`);
                setShowAuthModal(true);
                return;
            }

            // 인증되어 있으면 바로 포스트 삭제
            await deletePost();
        } catch (error) {
            console.error('Delete confirmation failed:', error);
        }
    }, [isAuthenticated, post, deletePost]);

    const handleLogin = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
        try {
            const success = await login(credentials);

            if (success) {
                setShowAuthModal(false);

                if (pendingAction === 'update') {
                    if (formData) {
                        await updatePost(formData);
                    } else {
                        setShowUpdateForm(true);
                    }
                } else if (pendingAction === 'delete') {
                    await deletePost();
                }

                return true;
            }

            return false;
        } catch (error: any) {
            console.error('Login failed:', error);
            return false;
        }
    }, [login, pendingAction, formData, updatePost, deletePost]);

    const handleAuthCancel = () => {
        setShowAuthModal(false);
        setFormData(null);
        setPendingAction(null);
    };

    const handleFormCancel = () => {
        setShowUpdateForm(false);
        setShowDeleteModal(false);
        setFormData(null);
        setPendingAction(null);
    };

    if (isLoading) {
        return (
            <PostDetailContainer>
                <LoadingContainer>📖 포스트를 불러오는 중...</LoadingContainer>
            </PostDetailContainer>
        );
    }

    if (error || !post) {
        return (
            <PostDetailContainer>
                <ErrorContainer>
                    <ErrorTitle>포스트를 찾을 수 없습니다</ErrorTitle>
                    <ErrorMessage>
                        요청하신 포스트가 존재하지 않거나 삭제되었습니다.
                    </ErrorMessage>
                    <BackButton to="/">홈으로 돌아가기</BackButton>
                </ErrorContainer>
            </PostDetailContainer>
        );
    }

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleTagClick = (tag: string) => {
        navigate(`/tag/${tag}`);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: post.title,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("링크가 클립보드에 복사되었습니다!");
        }
    };

    const postIdString = post.id?.toString() || "";

    return (
        <PostDetailContainer>
            <BackButton to={`/${post.category}`}>{post.category} 목록으로</BackButton>

            <PostHeader>
                <PostTitle>{post.title}</PostTitle>

                <PostMeta>
                    <PostMetaItem>
                        <MetaIcon>📅</MetaIcon>
                        {formatDate(post.createdAt)}
                    </PostMetaItem>

                    <CategoryLink to={`/${post.category}`}>
                        <MetaIcon>📁</MetaIcon>
                        {post.category}
                    </CategoryLink>

                    <PostMetaItem>
                        <MetaIcon>👀</MetaIcon>
                        {post.viewCount} views
                    </PostMetaItem>
                </PostMeta>

                {post.tags && post.tags.length > 0 && (
                    <TagSection>
                        <TagList tags={post.tags} onTagClick={handleTagClick}/>
                    </TagSection>
                )}
            </PostHeader>

            <PostContent>
                <div dangerouslySetInnerHTML={{__html: post.content}}/>
            </PostContent>

            <PostFooter>
                <FooterContent>
                    <BackButton to={`/${post.category}`}>
                        {post.category} 목록으로 돌아가기
                    </BackButton>

                    <ShareSection>
                        <ShareText>이 글이 도움이 되셨나요?</ShareText>
                        <ShareButton onClick={handleShare}>📤 공유하기</ShareButton>
                    </ShareSection>

                    <ActionSection>
                        <ActionButton $variant="edit" onClick={handleUpdateClick}>
                            ✏️ 수정
                        </ActionButton>
                        <ActionButton $variant="delete" onClick={handleDeleteClick}>
                            🗑️ 삭제
                        </ActionButton>
                    </ActionSection>
                </FooterContent>
            </PostFooter>

            {/* Update Post Modal */}
            {showUpdateForm && (
                <FormModal>
                    <ModalContent>
                        <ModalHeader>
                            <ModalTitle>포스트 수정</ModalTitle>
                            <CloseButton onClick={handleFormCancel}>×</CloseButton>
                        </ModalHeader>
                        <PostForm
                            category={post.category}
                            initialData={{
                                title: post.title,
                                content: post.content || post.content,
                                tags: post.tags || []
                            }}
                            onSubmit={handleUpdateSubmit}
                            onCancel={handleFormCancel}
                        />
                    </ModalContent>
                </FormModal>
            )}

            {/* Delete Confirm Modal */}
            {showDeleteModal && (
                <DeleteConfirmModal
                    postTitle={post.title}
                    onConfirm={handleDeleteConfirm}
                    onCancel={handleFormCancel}
                    isDeleting={deletePostMutation.isPending}
                />
            )}

            {/* 인증 모달 */}
            {showAuthModal && (
                <AuthModal
                    onLogin={handleLogin}
                    onCancel={handleAuthCancel}
                    message={authMessage}
                />
            )}

            {postIdString && <CommentSection postId={postIdString}/>}
        </PostDetailContainer>
    );
};

export default PostDetailPage;