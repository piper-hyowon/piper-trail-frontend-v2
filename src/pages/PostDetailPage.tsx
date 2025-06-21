import React, {useState, useCallback} from "react";
import styled from "styled-components";
import {useParams, Link, useNavigate} from "react-router-dom";
import {
    usePost,
    useUpdatePost,
    useDeletePost,
    usePostStats,
} from "../hooks/useApi";
import {useApi, LoginCredentials} from "../context/ApiContext";
import TagList from "../components/ui/TagList";
import PostForm from "../components/ui/PostForm";
import DeleteConfirmModal from "../components/ui/DeleteConfirmModal";
import AuthModal from "../components/ui/AuthModal";
import ApiLink from "../components/ui/ApiLink";
import {CommentSection} from "../components/ui/comments/CommentSection.tsx";
import {useLanguage} from "../context/LanguageContext";
import {renderMarkdown} from "../utils/markdoown.ts";
import type {UpdatePostRequest} from "../types/api.ts";
import ReactDOM from 'react-dom';

const PostDetailContainer = styled.article`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({theme}) => theme.spacing.md};

  @media (max-width: 768px) {
    padding: ${({theme}) => theme.spacing.sm};
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
  padding: ${({theme}) => theme.spacing.xs} ${({theme}) => theme.spacing.sm};
  border-radius: ${({theme}) => theme.borderRadius};
  transition: ${({theme}) => theme.transitions.default};

  &:hover {
    color: ${({theme}) => theme.colors.secondary};
    transform: translateX(-2px);
  }

  &::before {
    content: "←";
    font-size: 1.2em;
  }
`;

const PostHeader = styled.header`
  margin-bottom: ${({theme}) => theme.spacing.xl};
  text-align: center;
`;

const PostTitle = styled.h1`
  color: ${({theme}) => theme.colors.text};
  font-size: clamp(1.6rem, 3.5vw, 2.2rem);
  line-height: 1.3;
  margin-bottom: ${({theme}) => theme.spacing.sm};
  font-weight: 800;
  word-break: keep-all;
`;

const PostSubtitle = styled.h2`
  color: ${({theme}) => theme.colors.text};
  opacity: 0.7;
  font-size: clamp(1rem, 2.5vw, 1.3rem);
  font-weight: 400;
  line-height: 1.5;
  margin-bottom: ${({theme}) => theme.spacing.md};
  font-style: italic;
`;

const PostMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({theme}) => theme.spacing.sm};
  justify-content: center;
  margin: ${({theme}) => theme.spacing.lg} 0;
  padding-bottom: ${({theme}) => theme.spacing.lg};
  border-bottom: 1px solid ${({theme}) => theme.colors.primary}20;
`;

const PostMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({theme}) => theme.spacing.xs};
  font-size: ${({theme}) => theme.fontSizes.small};
  color: ${({theme}) => theme.colors.text};
  opacity: 0.7;
`;

const MetaIcon = styled.span`
  font-size: 1em;
`;

const CategoryLink = styled(Link)`
  color: ${({theme}) => theme.colors.primary};
  text-decoration: none;
  font-weight: 600;
  transition: ${({theme}) => theme.transitions.default};

  &:hover {
    color: ${({theme}) => theme.colors.secondary};
  }
`;

const TagSection = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({theme}) => theme.spacing.md};
`;

const PostContent = styled.div`
  line-height: 1.7;
  font-size: 0.95rem;
  color: ${({theme}) => theme.colors.text};
  margin-bottom: ${({theme}) => theme.spacing.xl};
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  h1, h2, h3, h4, h5, h6 {
    color: ${({theme}) => theme.colors.text};
    margin-top: ${({theme}) => theme.spacing.xl};
    margin-bottom: ${({theme}) => theme.spacing.md};
    font-weight: 700;
    line-height: 1.3;
  }

  h1 {
    font-size: 1.8rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  h3 {
    font-size: 1.3rem;
  }

  h4 {
    font-size: 1.1rem;
  }


  p {
    margin-bottom: ${({theme}) => theme.spacing.md};
    line-height: 1.7;
  }

  hr {
    border: none;
    height: 1px;
    background: ${({theme}) => theme.colors.primary}20;
    margin: ${({theme}) => theme.spacing.xl} 0;
  }

  code {
    background: ${({theme}) => theme.colors.primary}10;
    color: ${({theme}) => theme.colors.primary};
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
    font-size: 0.9em;
    font-weight: 500;
  }


  pre {
    background: ${({theme}) => theme.colors.text === '#1A1A1A' ? '#f6f8fa' : '#1e1e1e'};
    color: ${({theme}) => theme.colors.text === '#1A1A1A' ? '#24292e' : '#d4d4d4'};
    padding: ${({theme}) => theme.spacing.lg};
    border-radius: 8px;
    overflow-x: auto;
    margin: ${({theme}) => theme.spacing.lg} 0;
    font-size: 0.9rem;
    line-height: 1.6;
    border: 1px solid ${({theme}) => theme.colors.primary}10;


    &::-webkit-scrollbar {
      height: 8px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: ${({theme}) => theme.colors.primary}30;
      border-radius: 4px;
    }

    code {
      background: transparent;
      color: inherit;
      padding: 0;
      font-size: inherit;
      font-weight: 400;
    }
  }

  ${({theme}) => theme.colors.text !== '#1A1A1A' && `
    pre {
      .keyword { color: #4FC3F7; }
      .string { color: #80DEEA; }
      .comment { color: #66BB6A; }
      .function { color: #BA68C8; }
      .number { color: #4DB6AC; }
    }
  `}
  blockquote {
    border-left: 4px solid ${({theme}) => theme.colors.primary};
    padding: ${({theme}) => theme.spacing.md};
    margin: ${({theme}) => theme.spacing.lg} 0;
    background: ${({theme}) => theme.colors.primary}05;
    border-radius: 0 8px 8px 0;
    font-style: italic;

    p:last-child {
      margin-bottom: 0;
    }
  }

  ul, ol {
    margin-bottom: ${({theme}) => theme.spacing.md};
    padding-left: ${({theme}) => theme.spacing.lg};

    li {
      margin-bottom: ${({theme}) => theme.spacing.xs};
      line-height: 1.7;
    }
  }

  img {
    max-width: 100%;
    max-height: 350px;
    width: auto;
    height: auto;
    border-radius: 8px;
    margin: ${({theme}) => theme.spacing.lg} auto;
    display: block;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    object-fit: contain;
    cursor: zoom-in;
    transition: ${({theme}) => theme.transitions.default};

    &:hover {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      transform: scale(1.02);
    }

    &[width] {
      max-width: min(100%, 700px);
    }

    @media (max-width: 768px) {
      max-height: 400px;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: ${({theme}) => theme.spacing.lg} 0;
    font-size: 0.9rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    overflow: hidden;

    th, td {
      padding: ${({theme}) => theme.spacing.sm} ${({theme}) => theme.spacing.md};
      text-align: left;
      border-bottom: 1px solid ${({theme}) => theme.colors.primary}10;
    }

    th {
      background: ${({theme}) => theme.colors.primary}10;
      font-weight: 600;
      color: ${({theme}) => theme.colors.text};
    }

    tr:last-child td {
      border-bottom: none;
    }

    @media (max-width: 768px) {
      display: block;
      overflow-x: auto;
    }
  }

  @media (max-width: 768px) {
    font-size: 0.95rem;
    h1 {
      font-size: 1.5rem;
    }

    h2 {
      font-size: 1.3rem;
    }

    h3 {
      font-size: 1.2rem;
    }

    pre {
      padding: ${({theme}) => theme.spacing.md};
      font-size: 0.85rem;
    }
  }
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({theme}) => theme.spacing.lg} 0;
  border-top: 1px solid ${({theme}) => theme.colors.primary}20;
  border-bottom: 1px solid ${({theme}) => theme.colors.primary}20;
  margin: ${({theme}) => theme.spacing.xl} 0;
  flex-wrap: wrap;
  gap: ${({theme}) => theme.spacing.md};
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({theme}) => theme.spacing.sm};
`;

const IconButton = styled.button<{ $variant?: "primary" | "danger" }>`
  background: transparent;
  color: ${({theme, $variant}) =>
          $variant === "danger" ? theme.colors.error : theme.colors.primary};
  border: 1px solid ${({theme, $variant}) =>
          $variant === "danger" ? theme.colors.error : theme.colors.primary};
  padding: ${({theme}) => theme.spacing.xs} ${({theme}) => theme.spacing.md};
  border-radius: 20px;
  cursor: pointer;
  font-size: ${({theme}) => theme.fontSizes.small};
  font-weight: 500;
  transition: ${({theme}) => theme.transitions.default};
  display: flex;
  align-items: center;
  gap: ${({theme}) => theme.spacing.xs};

  &:hover {
    background: ${({theme, $variant}) =>
            $variant === "danger" ? `${theme.colors.error}10` : `${theme.colors.primary}10`};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px ${({theme, $variant}) =>
            $variant === "danger" ? `${theme.colors.error}20` : `${theme.colors.primary}20`};
  }
`;

const ResourceLinksSection = styled.section`
  margin-top: ${({theme}) => theme.spacing.xl};
  padding: ${({theme}) => theme.spacing.lg};
  background: ${({theme}) => theme.colors.background};
  border-radius: 12px;
  border: 1px solid ${({theme}) => theme.colors.primary}10;
`;

const ResourceLinksTitle = styled.h3`
  color: ${({theme}) => theme.colors.primary};
  margin-bottom: ${({theme}) => theme.spacing.md};
  font-size: 1.1rem;
  font-weight: 600;
`;

const ApiNavLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({theme}) => theme.spacing.sm};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 1.1rem;
  color: ${({theme}) => theme.colors.text};
  opacity: 0.6;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  padding: ${({theme}) => theme.spacing.xl};
`;

const ErrorTitle = styled.h1`
  color: ${({theme}) => theme.colors.error};
  margin-bottom: ${({theme}) => theme.spacing.md};
`;

const ErrorMessage = styled.p`
  color: ${({theme}) => theme.colors.text};
  opacity: 0.7;
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
  z-index: 10000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background-color: ${({theme}) => theme.colors.background};
  padding: ${({theme}) => theme.spacing.lg};
  border-radius: 12px;
  max-width: 800px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({theme}) => theme.colors.primary}30;
    border-radius: 4px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({theme}) => theme.spacing.lg};
  padding-bottom: ${({theme}) => theme.spacing.md};
  border-bottom: 1px solid ${({theme}) => theme.colors.primary}20;
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

const PostDetailPage: React.FC = () => {
    const {category, postSlug} = useParams<{
        category: string;
        postSlug: string;
    }>();
    const navigate = useNavigate();
    const {isAuthenticated, login, fetchApiData} = useApi();
    const {t, language} = useLanguage();

    const formatMessage = (
        key: string,
        params: Record<string, any> = {}
    ): string => {
        let message = t(key as any);
        Object.entries(params).forEach(([param, value]) => {
            message = message.replace(`{${param}}`, String(value));
        });
        return message;
    };

    if (!postSlug) {
        return (
            <PostDetailContainer>
                <ErrorContainer>
                    <ErrorTitle>{t("post.detail.errors.invalidUrl" as any)}</ErrorTitle>
                    <ErrorMessage>{t("post.detail.errors.noSlug" as any)}</ErrorMessage>
                    <BackButton to="/">{t("post.detail.backToHome" as any)}</BackButton>
                </ErrorContainer>
            </PostDetailContainer>
        );
    }

    const {data: post, isLoading, error} = usePost(postSlug!);
    const {data: stat} = usePostStats(postSlug!);

    // 모달 상태 관리
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMessage, setAuthMessage] = useState("");
    const [formData, setFormData] = useState<UpdatePostRequest | FormData | null>(null);
    const [pendingAction, setPendingAction] = useState<"update" | "delete" | null>(null);

    const updatePostMutation = useUpdatePost();
    const deletePostMutation = useDeletePost();

    const handleUpdateClick = useCallback(() => {
        if (!post) return;
        setShowUpdateForm(true);
    }, [post]);

    const handleDeleteClick = useCallback(() => {
        if (!post) return;
        setShowDeleteModal(true);
    }, [post]);

    const handleApiLinkClick = useCallback(
        async (href: string, linkMethod?: string) => {
            try {
                console.log(`API 링크 클릭: ${linkMethod} ${href}`);

                switch (linkMethod?.toUpperCase()) {
                    case "PUT":
                        if (href.includes("/posts/")) {
                            handleUpdateClick();
                        }
                        break;

                    case "DELETE":
                        if (href.includes("/posts/")) {
                            handleDeleteClick();
                        }
                        break;

                    case "GET":
                        if (href.includes("/category/")) {
                            const categoryMatch = href.match(/\/category\/(.+)$/);
                            if (categoryMatch) {
                                const category = categoryMatch[1];
                                navigate(
                                    `/${category === "null" ? "uncategorized" : category}`
                                );
                            }
                        } else if (href.includes("/posts/")) {
                            window.location.reload();
                        } else {
                            navigate(href);
                        }
                        break;

                    default:
                        if (fetchApiData) {
                            await fetchApiData(href, linkMethod as any);
                        } else {
                            navigate(href);
                        }
                        break;
                }
            } catch (error) {
                console.error("Failed to handle API link click", error);
            }
        },
        [fetchApiData, navigate, handleUpdateClick, handleDeleteClick]
    );

    React.useEffect(() => {
        const handleRequestPostData = () => {
            if (post) {
                window.dispatchEvent(
                    new CustomEvent("postData", {
                        detail: {
                            id: post.id,
                            title: post.title,
                            markdownContent: post.content || post.content,
                            content: post.content,
                            tags: post.tags,
                            category: post.category,
                        },
                    })
                );
            }
        };

        window.addEventListener("requestPostData", handleRequestPostData);

        return () => {
            window.removeEventListener("requestPostData", handleRequestPostData);
        };
    }, [post]);

    const updatePost = useCallback(
        async (postData: UpdatePostRequest | FormData) => {
            try {
                if (!post?.id) {
                    throw new Error(t("post.form.errors.noPostId" as any));
                }

                const updateData = postData instanceof FormData
                    ? postData
                    : {
                        title: postData.title,
                        titleEn: postData.titleEn,
                        subtitle: postData.subtitle,
                        subtitleEn: postData.subtitleEn,
                        markdownContent: postData.markdownContent,
                        markdownContentEn: postData.markdownContentEn,
                        tags: postData.tags || [],
                        category: category === 'uncategorized' || !category ? 'null' : category,
                    };

                await updatePostMutation.mutateAsync({
                    postId: post.id.toString(),
                    post: updateData
                });

                setShowUpdateForm(false);
                setFormData(null);
                setPendingAction(null);
                alert(t("post.form.success.updated" as any));
                window.location.reload();
            } catch (error: any) {
                console.error("Post update failed:", error);
                alert(
                    formatMessage("post.form.errors.updateFailed", {
                        error: error.message,
                    })
                );
            }
        },
        [updatePostMutation, post, category, t, formatMessage]
    );

    const deletePost = useCallback(async () => {
        try {
            if (!post?.id) {
                throw new Error(t("post.form.errors.noPostId" as any));
            }

            await deletePostMutation.mutateAsync(post.id.toString());

            setShowDeleteModal(false);
            setPendingAction(null);
            alert("Post deleted successfully!");
            navigate(`/${post.category}`);
        } catch (error: any) {
            console.error("Post deletion failed:", error);
            alert(
                formatMessage("post.form.errors.deleteFailed", {error: error.message})
            );
        }
    }, [deletePostMutation, post, navigate, t, formatMessage]);

    const handleUpdateSubmit = useCallback(async (formData: UpdatePostRequest | FormData) => {
        try {
            if (!isAuthenticated) {
                setFormData(formData);
                setPendingAction("update");
                setShowUpdateForm(false);
                setAuthMessage(
                    formatMessage("post.auth.required", {
                        action: t("post.auth.actions.edit" as any),
                        category: post?.category || "",
                    })
                );
                setShowAuthModal(true);
                return;
            }

            await updatePost(formData);
        } catch (error) {
            console.error(t("post.form.errors.formSubmission" as any), error);
        }
    }, [isAuthenticated, post, updatePost, formatMessage, t]);

    const handleDeleteConfirm = useCallback(async () => {
        try {
            if (!isAuthenticated) {
                setPendingAction("delete");
                setShowDeleteModal(false);
                setAuthMessage(
                    formatMessage("post.auth.required", {
                        action: t("post.auth.actions.delete" as any),
                        category: post?.category || "",
                    })
                );
                setShowAuthModal(true);
                return;
            }

            await deletePost();
        } catch (error) {
            console.error("Delete confirmation failed:", error);
        }
    }, [isAuthenticated, post, deletePost, formatMessage, t]);

    const handleLogin = useCallback(
        async (credentials: LoginCredentials): Promise<boolean> => {
            try {
                const success = await login(credentials);

                if (success) {
                    setShowAuthModal(false);

                    if (pendingAction === "update") {
                        if (formData) {
                            await updatePost(formData);
                        } else {
                            setShowUpdateForm(true);
                        }
                    } else if (pendingAction === "delete") {
                        await deletePost();
                    }

                    return true;
                }

                return false;
            } catch (error: any) {
                console.error(t("post.form.errors.loginFailed" as any), error);
                return false;
            }
        },
        [login, pendingAction, formData, updatePost, deletePost, t]
    );

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
                <LoadingContainer>{t("post.detail.loading" as any)}</LoadingContainer>
            </PostDetailContainer>
        );
    }

    if (error || !post) {
        return (
            <PostDetailContainer>
                <ErrorContainer>
                    <ErrorTitle>{t("post.detail.notFound" as any)}</ErrorTitle>
                    <ErrorMessage>{t("post.detail.notFoundDetail" as any)}</ErrorMessage>
                    <BackButton to="/">{t("post.detail.backToHome" as any)}</BackButton>
                </ErrorContainer>
            </PostDetailContainer>
        );
    }

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString(
            language === "ko" ? "ko-KR" : "en-US",
            {
                year: "numeric",
                month: "long",
                day: "numeric",
            }
        );
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
            alert(t("post.detail.shareSuccess" as any));
        }
    };

    const postIdString = post.id?.toString() || "";

    const getCategoryDisplayName = (category: string | null) => {
        if (!category) return t("post.detail.meta.uncategorized" as any);
        switch (category) {
            case "tech":
                return t("post.categories.tech" as any);
            case "food":
                return t("post.categories.food" as any);
            default:
                return category;
        }
    };

    return (
        <PostDetailContainer>
            <BackButton to={`/${post.category || "uncategorized"}`}>
                {formatMessage("post.detail.backTo", {
                    category: getCategoryDisplayName(post.category),
                })}
            </BackButton>

            <PostHeader>
                <PostTitle>{post.title}</PostTitle>
                {post.subtitle && (
                    <PostSubtitle>{post.subtitle}</PostSubtitle>
                )}

                <PostMeta>
                    <PostMetaItem>
                        <MetaIcon>📅</MetaIcon>
                        {post.createdAt ? formatDate(post.createdAt) : "No date"}
                    </PostMetaItem>

                    <PostMetaItem>•</PostMetaItem>

                    <PostMetaItem>
                        <CategoryLink to={`/${post.category || "uncategorized"}`}>
                            {getCategoryDisplayName(post.category)}
                        </CategoryLink>
                    </PostMetaItem>

                    <PostMetaItem>•</PostMetaItem>

                    <PostMetaItem>
                        <MetaIcon>👀</MetaIcon>
                        {formatMessage("post.detail.meta.views", {
                            count: stat?.viewCount || 0,
                        })}
                    </PostMetaItem>
                </PostMeta>

                {post.tags && post.tags.length > 0 && (
                    <TagSection>
                        <TagList tags={post.tags} onTagClick={handleTagClick}/>
                    </TagSection>
                )}
            </PostHeader>

            <PostContent>
                <div dangerouslySetInnerHTML={{
                    __html: renderMarkdown(post.content || post.content)
                }}/>
            </PostContent>

            <ActionBar>
                <BackButton to={`/${post.category || "uncategorized"}`}>
                    {t("post.detail.backToList" as any)}
                </BackButton>

                <ActionGroup>
                    <IconButton onClick={handleShare}>
                        📤 {t("post.detail.actions.share" as any)}
                    </IconButton>
                    <IconButton onClick={handleUpdateClick}>
                        ✏️ {t("post.detail.actions.edit" as any)}
                    </IconButton>
                    <IconButton $variant="danger" onClick={handleDeleteClick}>
                        🗑️ {t("post.detail.actions.delete" as any)}
                    </IconButton>
                </ActionGroup>
            </ActionBar>

            {post._links && Object.keys(post._links).length > 0 && (
                <ResourceLinksSection>
                    <ResourceLinksTitle>
                        {t("post.detail.resourceLinks" as any)}
                    </ResourceLinksTitle>
                    <ApiNavLinks>
                        {Object.entries(post._links).map(([key, link]) => (
                            <ApiLink
                                key={key}
                                method={link.method || "GET"}
                                path={link.href}
                                title={link.title || key}
                                onClick={() => handleApiLinkClick(link.href, link.method)}
                            />
                        ))}
                    </ApiNavLinks>
                </ResourceLinksSection>
            )}

            {/* Update Post Modal */}
            {showUpdateForm && (
                ReactDOM.createPortal(
                    <FormModal>
                        <ModalContent>
                            <ModalHeader>
                                <ModalTitle>{t("post.form.titles.edit" as any)}</ModalTitle>
                                <CloseButton onClick={handleFormCancel}>×</CloseButton>
                            </ModalHeader>
                            <PostForm
                                category={post.category || "uncategorized"}
                                initialData={{
                                    title: post.title,
                                    titleEn: post.titleEn,
                                    subtitle: post.subtitle,
                                    subtitleEn: post.subtitleEn,
                                    content: post.content,
                                    contentEn: post.contentEn || '',
                                    tags: post.tags || [],
                                    imageFiles: []
                                }}
                                onSubmit={handleUpdateSubmit}
                                onCancel={handleFormCancel}
                            />
                        </ModalContent>
                    </FormModal>,
                    document.getElementById('modal-root')!
                )
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