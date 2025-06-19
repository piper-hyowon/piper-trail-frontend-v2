import React, {useEffect, useState, useRef, useCallback} from 'react';
import styled from 'styled-components';
import {useLocation} from 'react-router-dom';
import {useTheme} from '../../context/ThemeContext';
import MethodSelector from '../ui/MethodSelector';
import UrlInput from '../ui/UrlInput';
import HeadersButton from '../ui/HeadersButton';
import HeadersPanel from '../ui/HeadersPanel';
import LogoChacter from '../../assets/logo.png'
import {AcceptHeader, HttpMethod, useApi, LoginCredentials} from "../../context/ApiContext";
import Tooltip from "../ui/Tooltip.tsx";
import {useLanguage} from "../../context/LanguageContext.tsx";
import AuthModal from "../ui/AuthModal.tsx";
import PostForm from "../ui/PostForm.tsx";
import {IoLogOutOutline, IoPersonOutline} from "react-icons/io5";
import {useCreatePost, useDeletePost, useUpdatePost} from '../../hooks/useApi';
import {
    ALL_CATEGORIES,
    BLOG_CATEGORIES,
    getCategoryName,
    INTERACTIVE_PAGES,
    STATIC_PAGES
} from "../../config/navigation.config.ts";
import DeleteConfirmModal from "../ui/DeleteConfirmModal.tsx";
import SearchBar from "../ui/SearchBar.tsx";
import type {CreatePostRequest, PostDetail, UpdatePostRequest} from "../../types/api.ts";

interface PostData {
    id: string;
    title: string;
    titleEn?: string;
    subtitle?: string;
    subtitleEn?: string;
    markdownContent?: string;
    markdownContentEn?: string;
    content?: string;
    contentEn?: string;
    tags?: string[];
    category?: string;
}

const NavContainer = styled.nav`
  padding: ${props => props.theme?.spacing?.sm || '8px'};
  background: ${({theme}) => theme.gradients.skyToTransparent};

  @media (max-width: 768px) {
    padding: 4px 8px;
  }
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const NavHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({theme}) => theme.spacing.sm};
  gap: ${({theme}) => theme.spacing.md};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 4px;
    margin-bottom: 4px;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: flex-end;
  gap: ${({theme}) => theme.spacing.xs};
  cursor: pointer;
  padding: ${({theme}) => `${theme.spacing.xs}`};
  border-radius: ${({theme}) => theme.borderRadius};
  transition: ${({theme}) => theme.transitions.default};
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);

  &:hover {
    background-color: ${({theme}) => `${theme.colors.secondary}30`};
  }

  @media (max-width: 768px) {
    justify-content: left;
    padding: 2px;
  }
`;

const LogoTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 0;
`;

const LogoText = styled.span`
  font-size: 24px;
  font-weight: bold;
  color: ${({theme}) => theme.colors.primary};

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const LogoSmallTitle = styled.span`
  font-size: ${({theme}) => theme.fontSizes.small};
  color: ${({theme}) => theme.colors.primary}80;
  margin-top: ${({theme}) => theme.spacing.xs};
  display: block;

  @media (max-width: 768px) {
    //display: none; 
    font-size: 10px;

  }
`;

const RightControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({theme}) => theme.spacing.xs};
  align-items: flex-end;

  @media (max-width: 768px) {
    width: 100%;
    align-items: stretch;
    gap: 4px;
  }
`;

const TopRightControls = styled.div`
  display: flex;
  gap: ${({theme}) => theme.spacing.sm};
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;

  @media (max-width: 768px) {
    gap: 4px;
    justify-content: space-between;
    width: 100%;
  }
`;

const LanguageToggle = styled.button`
  background: none;
  border: 1px solid ${({theme}) => theme.colors.primary}40;
  border-radius: ${({theme}) => theme.borderRadius};
  padding: ${({theme}) => theme.spacing.xs};
  color: ${({theme}) => theme.colors.primary};
  cursor: pointer;
  transition: ${({theme}) => theme.transitions.default};
  font-size: ${({theme}) => theme.fontSizes.small};

  &:hover {
    background-color: ${({theme}) => `${theme.colors.secondary}20`};
  }

  @media (max-width: 768px) {
    padding: 2px 6px;
    font-size: 0.75rem;
  }
`;

const ThemeToggleSwitch = styled.button<{ $isDark: boolean }>`
  position: relative;
  width: 50px;
  height: 26px;
  background: ${({theme, $isDark}) =>
          $isDark ? theme.colors.primary : `${theme.colors.text}20`};
  border: none;
  border-radius: 13px;
  cursor: pointer;
  transition: ${({theme}) => theme.transitions.default};
  padding: 2px;

  @media (max-width: 768px) {
    width: 40px;
    height: 20px;
    border-radius: 10px;
  }

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${({$isDark}) => $isDark ? '24px' : '2px'};
    width: 22px;
    height: 22px;
    background: white;
    border-radius: 50%;
    transition: ${({theme}) => theme.transitions.default};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

    @media (max-width: 768px) {
      width: 16px;
      height: 16px;
      top: 2px;
      left: ${({$isDark}) => $isDark ? '22px' : '2px'};
    }
  }

  &:hover {
    opacity: 0.8;
  }

  &::before {
    content: ${({$isDark}) => $isDark ? '"🌙"' : '"☀️"'};
    position: absolute;
    left: ${({$isDark}) => $isDark ? '5px' : '28px'};
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    z-index: 1;
  }
`;

const AuthStatusContainer = styled.div<{ $authenticated: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({theme}) => theme.spacing.xs};
  padding: ${({theme}) => theme.spacing.xs};
  border-radius: ${({theme}) => theme.borderRadius};
  background-color: ${({theme, $authenticated}) =>
          $authenticated ? `${theme.colors.success}10` : `${theme.colors.primary}10`};
  color: ${({theme, $authenticated}) =>
          $authenticated ? theme.colors.success : theme.colors.primary};
  font-size: ${({theme}) => theme.fontSizes.small};
  border: 1px solid ${({theme, $authenticated}) =>
          $authenticated ? `${theme.colors.success}30` : `${theme.colors.primary}30`};
  white-space: nowrap;

  @media (max-width: 768px) {
    display: none;
    font-size: 0.7rem;
    padding: 2px 4px;
    gap: 2px;
  }
`;

const AuthButtonGroup = styled.div`
  display: flex;
  gap: ${({theme}) => theme.spacing.sm};
`;

const AuthButton = styled.button`
  background-color: ${({theme}) => theme.colors.primary};
  color: ${({theme}) => theme.colors.background};
  font-weight: bold;
  padding: ${({theme}) => theme.spacing.xs} ${({theme}) => theme.spacing.sm};
  border: none;
  border-radius: ${({theme}) => theme.borderRadius};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({theme}) => theme.spacing.xs};
  cursor: pointer;
  transition: ${({theme}) => theme.transitions.default};

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    padding: 4px 8px;
    gap: 2px;

    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const LogoutButton = styled(AuthButton)`
  background-color: ${({theme}) => `${theme.colors.text}40`};

  &:hover {
    background-color: ${({theme}) => `${theme.colors.text}60`};
  }
`;

const ApiControls = styled.div`
  display: flex;
  gap: ${({theme}) => theme.spacing.xs};
  align-items: center;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 4px;
  }
`;

const HeadersContainer = styled.div`
  margin-top: ${({theme}) => theme.spacing.sm};
`;

const MethodAlert = styled.div`
  background-color: ${({theme}) => theme.colors.primary}20;
  color: ${({theme}) => theme.colors.primary};
  padding: ${({theme}) => theme.spacing.xs};
  border-radius: ${({theme}) => theme.borderRadius};
  margin-top: ${({theme}) => theme.spacing.xs};
  font-size: ${({theme}) => theme.fontSizes.small};
  animation: fadeIn 0.3s;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ErrorAlert = styled.div`
  background-color: ${({theme}) => theme.colors.error}20;
  color: ${({theme}) => theme.colors.error};
  padding: ${({theme}) => theme.spacing.xs};
  border-radius: ${({theme}) => theme.borderRadius};
  margin-top: ${({theme}) => theme.spacing.xs};
  font-size: ${({theme}) => theme.fontSizes.small};
  animation: fadeIn 0.3s;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
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
  z-index: ${({theme}) => theme.zIndex.modal};
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

const SearchContainer = styled.div<{ $visible: boolean }>`
  opacity: ${({$visible}) => $visible ? 1 : 0};
  max-height: ${({$visible}) => $visible ? '40px' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    width: 100%;
    max-height: ${({$visible}) => $visible ? '30px' : '0'};
    margin-top: ${({theme, $visible}) => $visible ? '4px' : '0'};
  }
`;

const MobileControlGroup = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    gap: ${({theme}) => theme.spacing.xs};
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
`;

const DesktopControlGroup = styled.div`
  display: flex;
  gap: ${({theme}) => theme.spacing.sm};
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavigationBar: React.FC = () => {
    const location = useLocation();
    const {themeMode, toggleTheme} = useTheme();
    const {
        method, acceptHeader, setMethod, fetchApiData, setAcceptHeader,
        navigateTo, isAuthenticated, login, logout,
        setApiStatus, setStatusCode, setApiError
    } = useApi();

    // 상태 관리
    const [inputUrl, setInputUrl] = useState<string>(location.pathname + location.search);
    const [showHeadersPanel, setShowHeadersPanel] = useState<boolean>(false);
    const [showMethodChangeAlert, setShowMethodChangeAlert] = useState<boolean>(false);
    const [showMethodNotAllowedAlert, setShowMethodNotAllowedAlert] = useState<boolean>(false);
    const [showPostForm, setShowPostForm] = useState<boolean>(false);
    const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [currentCategory, setCurrentCategory] = useState<string>('');
    const [currentPostData, setCurrentPostData] = useState<PostData | null>(null);
    const [showSearch, setShowSearch] = useState(false);

    // 인증 모달 상태
    const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
    const [authMessage, setAuthMessage] = useState<string>('');
    const [formData, setFormData] = useState<CreatePostRequest | FormData | null>(null);
    const [pendingAction, setPendingAction] = useState<'create' | 'update' | 'delete' | null>(null);

    const prevLocationRef = useRef(location.pathname + location.search);
    const {language, toggleLanguage, t} = useLanguage();

    const createPostMutation = useCreatePost();
    const updatePostMutation = useUpdatePost();
    const deletePostMutation = useDeletePost();

    const [attemptedMethod, setAttemptedMethod] = useState<string>('');

    // 페이지 타입 판별 함수
    const getPageType = (url: string): 'blog' | 'static' | 'interactive' | 'unknown' => {
        const pathOnly = url.split('?')[0];
        const pathParts = pathOnly.split('/').filter(Boolean);
        const category = pathParts.length > 0 ? pathParts[0] : '';

        if (BLOG_CATEGORIES.some(cat => cat.name === category)) {
            return 'blog';
        }
        if (STATIC_PAGES.some(page => page.path === pathOnly)) {
            return 'static';
        }
        if (INTERACTIVE_PAGES.some(page => page.path === pathOnly)) {
            return 'interactive';
        }

        return 'unknown';
    };

    const formatMessage = (key: string, params: Record<string, any> = {}): string => {
        let message = t(key as any);
        Object.entries(params).forEach(([param, value]) => {
            message = message.replace(`{${param}}`, String(value));
        });
        return message;
    };

    const extractCategoryFromUrl = (url: string): string => {
        const pathOnly = url.split('?')[0];
        const pathParts = pathOnly.split('/').filter(Boolean);
        return pathParts.length > 0 ? pathParts[0] : '';
    };

    const isDetailPage = (url: string): boolean => {
        const pathOnly = url.split('?')[0];
        const pathParts = pathOnly.split('/').filter(Boolean);
        return pathParts.length === 2; // /{category}/{slug}
    };

    // 현재 페이지의 포스트 데이터 가져오기
    const getCurrentPostData = useCallback((): Promise<PostDetail | null> => {
        return new Promise((resolve) => {
            const handlePostData = (event: any) => {
                resolve(event.detail);
                window.removeEventListener('postData', handlePostData);
            };

            window.addEventListener('postData', handlePostData);
            window.dispatchEvent(new CustomEvent('requestPostData'));

            // 타임아웃
            setTimeout(() => {
                window.removeEventListener('postData', handlePostData);
                resolve(null);
            }, 100);
        });
    }, []);

    const createPost = useCallback(async (postData: CreatePostRequest | FormData) => {
        try {
            if (postData instanceof FormData) {
                await createPostMutation.mutateAsync(postData);
            } else {
                await createPostMutation.mutateAsync({
                    title: postData.title,
                    titleEn: postData.titleEn,
                    subtitle: postData.subtitle,
                    subtitleEn: postData.subtitleEn,
                    markdownContent: postData.markdownContent,
                    markdownContentEn: postData.markdownContentEn,
                    category: currentCategory,
                    tags: postData.tags || []
                });
            }

            setShowPostForm(false);
            setFormData(null);
            alert(t('layout.form.postCreated' as any));
            window.location.reload();

        } catch (error: any) {
            console.error('Post creation failed:', error);
            setApiStatus('error');
            setStatusCode(error.status || 500);
            setApiError(t('layout.form.createFailed' as any));
        }
    }, [createPostMutation, currentCategory, setApiStatus, setStatusCode, setApiError]);

    const updatePost = useCallback(async (postData: UpdatePostRequest | FormData) => {
        try {
            if (!currentPostData?.id) {
                alert(t('layout.method.postDataError' as any));
                return;
            }

            // FormData인 경우와 일반 객체인 경우 처리
            const updateData = postData instanceof FormData ? postData : {
                title: postData.title,
                titleEn: postData.titleEn,
                subtitle: postData.subtitle,
                subtitleEn: postData.subtitleEn,
                markdownContent: postData.markdownContent,
                markdownContentEn: postData.markdownContentEn,
                tags: postData.tags || [],
                category: currentCategory
            };

            await updatePostMutation.mutateAsync({
                postId: currentPostData.id.toString(),
                post: updateData
            });

            setShowUpdateForm(false);
            setFormData(null);
            setPendingAction(null);
            alert(t('layout.form.postUpdated' as any));
            window.location.reload();

        } catch (error: any) {
            console.error('Post update failed:', error);
            setApiStatus('error');
            setStatusCode(error.status || 500);
            setApiError('포스트 수정에 실패했습니다.');
        }
    }, [updatePostMutation, currentPostData, currentCategory, setApiStatus, setStatusCode, setApiError]);

    const deletePost = useCallback(async () => {
        try {
            if (!currentPostData?.id) {
                alert(t('layout.method.postDataError' as any));
            }

            if ("id" in currentPostData) {
                await deletePostMutation.mutateAsync(currentPostData.id.toString());
            }

            setShowDeleteModal(false);
            setPendingAction(null);
            alert(t('layout.form.postDeleted' as any));
            navigateTo(`/${currentCategory}`);

        } catch (error: any) {
            console.error('Post deletion failed:', error);
            setApiStatus('error');
            setStatusCode(error.status || 500);
            setApiError(t('layout.form.deleteFailed' as any));
        }
    }, [deletePostMutation, currentPostData, currentCategory, navigateTo, setApiStatus, setStatusCode, setApiError]);

    const handleFormSubmit = useCallback(async (
        formData: CreatePostRequest | FormData,
        action: 'create' | 'update'
    ) => {
        try {
            if (!isAuthenticated) {
                // 인증되지 않았으면 폼 데이터 저장하고 인증 모달 표시
                setFormData(formData);
                setPendingAction(action);
                setShowPostForm(false);
                setShowUpdateForm(false);
                setAuthMessage(
                    action === 'create'
                        ? formatMessage('post.auth.required', {
                            action: t('post.auth.actions.create' as any),
                            category: getCategoryName(currentCategory)
                        })
                        : formatMessage('post.auth.required', {
                            action: t('post.auth.actions.edit' as any),
                            category: getCategoryName(currentCategory)
                        })
                );
                setShowAuthModal(true);
                return;
            }

            // 인증되어 있으면 바로 실행
            if (action === 'create') {
                await createPost(formData);
            } else {
                await updatePost(formData);
            }
        } catch (error) {
            console.error('Form submission failed:', error);
        }
    }, [isAuthenticated, currentCategory, createPost, updatePost]);

    const handleDeleteConfirm = useCallback(async () => {
        try {
            if (!isAuthenticated) {
                setPendingAction('delete');
                setShowDeleteModal(false);
                setAuthMessage(formatMessage('post.auth.required', {
                    action: t('post.auth.actions.delete' as any),
                    category: getCategoryName(currentCategory)
                }));
                setShowAuthModal(true);
                return;
            }

            await deletePost();
        } catch (error) {
            console.error('Delete confirmation failed:', error);
        }
    }, [isAuthenticated, currentCategory, deletePost]);

    const handleFormCancel = () => {
        setShowPostForm(false);
        setShowUpdateForm(false);
        setShowDeleteModal(false);
        setFormData(null);
        setPendingAction(null);
        setCurrentPostData(null);
        setMethod('GET');
    };

    // URL 동기화
    useEffect(() => {
        const currentLocation = location.pathname + location.search;
        if (currentLocation !== prevLocationRef.current) {
            setInputUrl(currentLocation);
            prevLocationRef.current = currentLocation;
        }
    }, [location]);

    // URL 동기화 및 PostDetailPage 버튼 이벤트 리스너
    useEffect(() => {
        const currentLocation = location.pathname + location.search;
        if (currentLocation !== prevLocationRef.current) {
            setInputUrl(currentLocation);
            prevLocationRef.current = currentLocation;
        }

        // PostDetailPage의 수정/삭제 버튼 클릭 이벤트 리스너
        const handleTriggerMethod = (event: any) => {
            const method = event.detail;
            handleMethodChange(method);
        };

        window.addEventListener('triggerMethod', handleTriggerMethod);

        return () => {
            window.removeEventListener('triggerMethod', handleTriggerMethod);
        };
    }, [location]);

    // 메서드 변경 알림
    useEffect(() => {
        if (method !== 'GET') {
            setShowMethodChangeAlert(true);
            const timer = setTimeout(() => {
                setShowMethodChangeAlert(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [method]);

    // 405 Method Not Allowed 알림
    useEffect(() => {
        if (showMethodNotAllowedAlert) {
            const timer = setTimeout(() => {
                setShowMethodNotAllowedAlert(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showMethodNotAllowedAlert]);

    const handleLogoClick = () => {
        navigateTo('/');
    };

    const handleUrlChange = (newUrl: string) => {
        setInputUrl(newUrl);
    };

    const handleUrlSubmit = () => {
        try {
            const normalizedUrl = inputUrl.startsWith('/') ? inputUrl : `/${inputUrl}`;
            navigateTo(normalizedUrl);
        } catch (error) {
            console.error('URL 제출 중 오류:', error);
        }
    };

    const handleMethodChange = async (newMethod: string) => {
        setAttemptedMethod(newMethod); // 시도 메서드 저장

        const pageType = getPageType(inputUrl);
        const isDetail = isDetailPage(inputUrl);

        // 메서드별 페이지 타입에 따른 처리
        if (newMethod === 'POST') {
            if (pageType === 'static') {
                // STATIC_PAGES는 POST 지원 안함 (405 Method Not Allowed)
                setApiStatus('error');
                setStatusCode(405);
                setApiError('405 Method Not Allowed');
                setShowMethodNotAllowedAlert(true);
                return;
            } else if (pageType === 'blog' && !isDetail) {
                // BLOG_CATEGORIES는 PostForm 모달 바로 표시
                const category = extractCategoryFromUrl(inputUrl);
                setCurrentCategory(category);
                setShowPostForm(true);
            } else if (pageType === 'interactive') {
                // INTERACTIVE_PAGES는 해당 페이지의 기존 모달 트리거
                if (inputUrl.includes('/postcards')) {
                    // PostcardsPage에 모달 열기 이벤트 전달
                    window.dispatchEvent(new CustomEvent('openPostcardModal'));
                }
            } else {
                setApiStatus('error');
                setStatusCode(405);
                setApiError('405 Method Not Allowed');
                setShowMethodNotAllowedAlert(true);
            }

        } else if (newMethod === 'GET') {
            fetchApiData(inputUrl, newMethod as HttpMethod).catch(error => {
                console.error('API 요청 실패:', error);
            });
        } else if (newMethod === 'DELETE') {
            if (pageType === 'blog' && isDetail) {
                const category = extractCategoryFromUrl(inputUrl);
                setCurrentCategory(category);

                // 현재 포스트 데이터 가져오기
                const postData = await getCurrentPostData();
                if (postData) {
                    setCurrentPostData(postData);
                    setShowDeleteModal(true);
                } else {
                    return;
                }
            } else {
                setApiStatus('error');
                setStatusCode(405);
                setApiError('405 Method Not Allowed');
                setShowMethodNotAllowedAlert(true);
                return;
            }
        } else if (newMethod === 'PUT') {
            if (pageType === 'blog' && isDetail) {
                const category = extractCategoryFromUrl(inputUrl);
                setCurrentCategory(category);

                // 현재 포스트 데이터 가져오기
                const postData = await getCurrentPostData();
                if (postData) {
                    setCurrentPostData(postData);
                    setShowUpdateForm(true);
                } else {
                    alert(t('layout.method.postDataError' as any));
                    return;
                }
            } else {
                setApiStatus('error');
                setStatusCode(405);
                setApiError('405 Method Not Allowed');
                setShowMethodNotAllowedAlert(true);
                return;
            }
        } else {
            // TODO: 현재 PATCH 메서드 지원 안 함 (관리자 API에만 있음)
            setApiStatus('error');
            setStatusCode(405);
            setApiError('405 Method Not Allowed');
            setShowMethodNotAllowedAlert(true);
            return;
        }

        setMethod(newMethod as HttpMethod);
    };

    const handleAuthButtonClick = () => {
        if (!isAuthenticated) {
            setAuthMessage(t('layout.auth.loginRequired' as any));
            setShowAuthModal(true);
        }
    };

    const handleLogout = () => {
        logout();
        alert(t('layout.auth.logoutSuccess' as any));
    };

    const toggleHeadersPanel = () => {
        setShowHeadersPanel(prev => !prev);
    };

    const handleAcceptHeaderChange = (value: string) => {
        setAcceptHeader(value as AcceptHeader);
    };

    // 로그인 핸들러
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
        if (method === 'POST') {
            setMethod('GET');
        }
    };

    const handlePostFormSubmit = (formData: any) => {
        handleFormSubmit(formData, 'create');
    };

    const handleUpdateFormSubmit = (formData: any) => {
        handleFormSubmit(formData, 'update');
    };

    const isSearchablePage = () => {
        const pathOnly = location.pathname.split('?')[0];
        const pathParts = pathOnly.split('/').filter(Boolean);
        const currentCategory = pathParts.length > 0 ? pathParts[0] : '';

        return BLOG_CATEGORIES.some(cat => cat.name === currentCategory);
    };

    useEffect(() => {
        setShowSearch(isSearchablePage());
    }, [location.pathname]);

    return (
        <NavContainer>
            <NavContent>
                <NavHeader>
                    <Logo onClick={handleLogoClick}>
                        <img
                            width={140}
                            src={LogoChacter}
                            alt="Frog Character"
                            style={{width: window.innerWidth <= 768 ? '60px' : '140px'}}
                        />
                        <LogoTextContainer>
                            <LogoText>piper-trail.com</LogoText>
                            <LogoSmallTitle>{t('layout.blogTitle')}</LogoSmallTitle>
                        </LogoTextContainer>
                    </Logo>
                    <RightControls>
                        <TopRightControls>
                            <DesktopControlGroup>
                                <LanguageToggle onClick={toggleLanguage}>
                                    {language === 'en' ? '한국어' : 'English'}
                                </LanguageToggle>

                                <ThemeToggleSwitch
                                    $isDark={themeMode === 'dark'}
                                    onClick={toggleTheme}
                                    aria-label={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}
                                />

                                <AuthStatusContainer $authenticated={isAuthenticated}>
                                    {isAuthenticated ? '🔒' : '🔓'}
                                    {isAuthenticated ? t('layout.auth.authenticated' as any) : t('layout.auth.notAuthenticated' as any)}
                                </AuthStatusContainer>

                                <AuthButtonGroup>
                                    {!isAuthenticated ? (
                                        <Tooltip content={t('layout.auth.adminLogin' as any)}>
                                            <AuthButton onClick={handleAuthButtonClick}>
                                                <IoPersonOutline size={16}/>
                                            </AuthButton>
                                        </Tooltip>
                                    ) : (
                                        <Tooltip content={t('layout.auth.logout' as any)}>
                                            <LogoutButton onClick={handleLogout}>
                                                <IoLogOutOutline size={16}/>
                                            </LogoutButton>
                                        </Tooltip>
                                    )}
                                </AuthButtonGroup>
                            </DesktopControlGroup>

                            <MobileControlGroup>
                                <div style={{display: 'flex', gap: '4px', alignItems: 'center'}}>
                                    <LanguageToggle onClick={toggleLanguage}>
                                        {language === 'en' ? '한국어' : 'English'}
                                    </LanguageToggle>
                                    <ThemeToggleSwitch
                                        $isDark={themeMode === 'dark'}
                                        onClick={toggleTheme}
                                        aria-label={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}
                                    />
                                </div>

                                <AuthButtonGroup>
                                    {!isAuthenticated ? (
                                        <AuthButton onClick={handleAuthButtonClick}>
                                            <IoPersonOutline size={16}/>
                                        </AuthButton>
                                    ) : (
                                        <LogoutButton onClick={handleLogout}>
                                            <IoLogOutOutline size={16}/>
                                        </LogoutButton>
                                    )}
                                </AuthButtonGroup>
                            </MobileControlGroup>

                            <MobileControlGroup>
                                <AuthStatusContainer $authenticated={isAuthenticated}>
                                    {isAuthenticated ? '🔒' : '🔓'}
                                    {isAuthenticated ? t('layout.auth.authenticated' as any) : t('layout.auth.notAuthenticated' as any)}
                                </AuthStatusContainer>
                            </MobileControlGroup>
                        </TopRightControls>

                        <SearchContainer $visible={showSearch}>
                            <SearchBar/>
                        </SearchContainer>
                    </RightControls>
                </NavHeader>

                <ApiControls>
                    <MethodSelector
                        methods={['GET', 'POST', 'PUT', 'PATCH', 'DELETE']}
                        selectedMethod={method}
                        onSelect={handleMethodChange}
                    />

                    <UrlInput
                        value={inputUrl}
                        onChange={handleUrlChange}
                        onSubmit={handleUrlSubmit}
                        suggestions={[...ALL_CATEGORIES.map(e => e.path), '/null']}
                    />

                    <HeadersButton
                        isOpen={showHeadersPanel}
                        onClick={toggleHeadersPanel}
                        currentPath={location.pathname}
                        tooltipText={t('layout.headers.tooltip' as any)}
                    />
                </ApiControls>

                {showMethodChangeAlert && (
                    <MethodAlert dangerouslySetInnerHTML={{
                        __html: formatMessage('layout.method.changed', {method})
                    }}/>
                )}


                {showMethodNotAllowedAlert && (
                    <ErrorAlert dangerouslySetInnerHTML={{
                        __html: formatMessage('layout.method.notAllowed', {method: attemptedMethod})
                    }}/>
                )}

                {showHeadersPanel && (
                    <HeadersContainer>
                        <HeadersPanel
                            acceptHeader={acceptHeader}
                            onAcceptHeaderChange={handleAcceptHeaderChange}
                        />
                    </HeadersContainer>
                )}
            </NavContent>

            {/* 포스트 작성 모달*/}
            {showPostForm && (
                <FormModal>
                    <ModalContent>
                        <ModalHeader>
                            <ModalTitle>{formatMessage('layout.form.createPost', {category: getCategoryName(currentCategory)})}</ModalTitle>
                            <CloseButton onClick={handleFormCancel}>×</CloseButton>
                        </ModalHeader>
                        <PostForm
                            category={currentCategory}
                            onSubmit={handlePostFormSubmit}
                            onCancel={handleFormCancel}
                        />
                    </ModalContent>
                </FormModal>
            )}

            {/* 포스트 수정 모달 */}
            {showUpdateForm && currentPostData && (
                <FormModal>
                    <ModalContent>
                        <ModalHeader>
                            <ModalTitle>{formatMessage('layout.form.editPost', {category: getCategoryName(currentCategory)})}</ModalTitle>
                            <CloseButton onClick={handleFormCancel}>×</CloseButton>
                        </ModalHeader>
                        <PostForm
                            category={currentCategory}
                            initialData={{
                                title: currentPostData.title,
                                titleEn: currentPostData.titleEn,
                                subtitle: currentPostData.subtitle,
                                subtitleEn: currentPostData.subtitleEn,
                                content: currentPostData.markdownContent || currentPostData.content || '',
                                contentEn: currentPostData.markdownContentEn || currentPostData.contentEn,
                                tags: currentPostData.tags || [],
                                imageFiles: []
                            }}
                            onSubmit={handleUpdateFormSubmit}  // update용
                            onCancel={handleFormCancel}
                        />
                    </ModalContent>
                </FormModal>
            )}

            {/* 포스트 삭제 확인 모달 */}
            {showDeleteModal && currentPostData && (
                <DeleteConfirmModal
                    postTitle={currentPostData.title}
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
        </NavContainer>
    );
};

export default NavigationBar;