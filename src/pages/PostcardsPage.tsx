import React, {useEffect, useState, useMemo, useCallback} from 'react';
import styled from 'styled-components';
import ReactDOM from 'react-dom';
import Mailbox3D from '../components/ui/stamps/Mailbox3D';
import StampCard from '../components/ui/stamps/StampCard';
import PostcardCard from '../components/ui/stamps/PostcardCard';
import {usePostcards, useCreatePostcard} from '../hooks/useApi';
import {StampType} from '../types/api';
import {useLanguage} from "../context/LanguageContext.tsx";
import Confetti from "../components/ui/effects/Confetti.tsx";

interface Stamp {
    id: string;
    name: string;
    color: string;
    description: string;
}

const convertToStampType = (stampId: string): StampType => {
    const mapping: Record<string, StampType> = {
        'awesome': StampType.AWESOME,
        'interesting': StampType.INTERESTING,
        'helpful': StampType.HELPFUL,
        'inspiring': StampType.INSPIRING,
        'thank_you': StampType.THANK_YOU,
        'love_it': StampType.LOVE_IT,
    };
    return mapping[stampId] || StampType.AWESOME;
};

const convertPostcardResponse = (postcard: any) => ({
    id: postcard.id,
    stampId: postcard.stampType.toLowerCase(),
    message: postcard.message || '',
    timestamp: new Date(postcard.createdAt),
    nickname: postcard.nickname
});

const StampsContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: ${({theme}) => theme.spacing.md};
  min-height: 70vh;
`;

const PageHeader = styled.header`
  text-align: center;
  margin-bottom: ${({theme}) => theme.spacing.lg};
  padding: ${({theme}) => theme.spacing.md};
    //background: ${({theme}) => theme.colors.background};
  border-radius: ${({theme}) => theme.borderRadius};
`;

const PageTitle = styled.h1`
  color: ${({theme}) => theme.colors.primary};
  margin-bottom: ${({theme}) => theme.spacing.xs};
  font-size: ${({theme}) => theme.fontSizes.xlarge};
`;

const PageDescription = styled.p`
  color: ${({theme}) => `${theme.colors.text}80`};
  font-size: ${({theme}) => theme.fontSizes.small};
  line-height: 1.6;
  white-space: pre-line;
`;

const MailboxSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${({theme}) => theme.spacing.lg};
  max-height: 300px;
`;

const MailboxWrapper = styled.div`
  position: relative;
  height: 300px;
  width: 100%;
  max-width: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MailboxText = styled.div<{ $hasEntries: boolean }>`
  margin-top: ${({theme}) => theme.spacing.md};
  text-align: center;
  color: ${({theme}) => theme.colors.primary};
  font-weight: bold;
  font-size: ${({theme}) => theme.fontSizes.large};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({theme}) => theme.spacing.sm};
  justify-content: center;
  margin-top: ${({theme}) => theme.spacing.md};
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ $variant: 'primary' | 'secondary' }>`
  padding: ${({theme}) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border: none;
  border-radius: ${({theme}) => theme.borderRadius};
  font-weight: bold;
  font-size: ${({theme}) => theme.fontSizes.small};
  cursor: pointer;
  transition: ${({theme}) => theme.transitions.default};
  display: flex;
  align-items: center;
  gap: ${({theme}) => theme.spacing.xs};

  background: ${({theme, $variant}) =>
          $variant === 'primary' ? theme.colors.primary : theme.colors.secondary};
  color: white;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${({theme, $variant}) =>
            $variant === 'primary' ? `${theme.colors.primary}40` : `${theme.colors.secondary}40`};
  }
`;
const PostcardOverlay = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 10000;
  display: ${({$isVisible}) => $isVisible ? 'flex' : 'none'};
  flex-direction: column;
  padding: 0;
  overflow-y: hidden;
`;

const PostcardListContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({theme}) => theme.spacing.lg};

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({theme}) => `${theme.colors.text}10`};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({theme}) => `${theme.colors.text}30`};
    border-radius: 4px;

    &:hover {
      background: ${({theme}) => `${theme.colors.text}50`};
    }
  }
`;

const PostcardListHeader = styled.div`
  text-align: center;
  margin-bottom: ${({theme}) => theme.spacing.lg};
  position: sticky;
  top: 0;
  background: rgba(0, 0, 0, 0.9);
  padding: ${({theme}) => theme.spacing.md};
  border-radius: ${({theme}) => theme.borderRadius};
  backdrop-filter: blur(10px);
`;

const PostcardListTitle = styled.h2`
  color: white;
  margin: 0 0 ${({theme}) => theme.spacing.sm} 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({theme}) => theme.spacing.sm};
`;

const ClosePostcardsButton = styled.button`
  background: ${({theme}) => theme.colors.primary};
  color: white;
  border: none;
  padding: ${({theme}) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: ${({theme}) => theme.borderRadius};
  font-weight: bold;
  cursor: pointer;
  transition: ${({theme}) => theme.transitions.default};

  &:hover {
    background: ${({theme}) => theme.colors.secondary};
    transform: translateY(-1px);
  }
`;

const PostcardGrid = styled.div`
  display: grid;
  gap: ${({theme}) => theme.spacing.lg};
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  }
`;

const Modal = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: ${({$isOpen}) => $isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: ${({theme}) => theme.zIndex.modal};
  backdrop-filter: blur(5px);
  padding: ${({theme}) => theme.spacing.md};
`;

const ModalContent = styled.div`
  background: ${({theme}) => theme.colors.background};
  border-radius: ${({theme}) => theme.borderRadius};
  padding: ${({theme}) => theme.spacing.lg};
  max-width: 700px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);

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
  margin-bottom: ${({theme}) => theme.spacing.md};
`;

const ModalTitle = styled.h3`
  color: ${({theme}) => theme.colors.primary};
  margin: 0;
  font-size: 1.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${({theme}) => `${theme.colors.text}60`};

  &:hover {
    color: ${({theme}) => theme.colors.text};
  }
`;

const StampGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({theme}) => theme.spacing.md};
  margin-bottom: ${({theme}) => theme.spacing.md};
`;

const FormGroup = styled.div`
  margin-bottom: ${({theme}) => theme.spacing.md};
`;

const FormLabel = styled.label<{ $required?: boolean }>`
  display: block;
  color: ${({theme}) => theme.colors.text};
  font-weight: bold;
  margin-bottom: ${({theme}) => theme.spacing.xs};

  &::after {
    content: ${({$required}) => $required ? '"*"' : '""'};
    color: ${({theme}) => theme.colors.error};
    margin-left: 4px;
  }
`;

const FormInput = styled.input`
  width: 100%;
  padding: ${({theme}) => theme.spacing.sm};
  border: 2px solid ${({theme}) => `${theme.colors.primary}30`};
  border-radius: ${({theme}) => theme.borderRadius};
  background: ${({theme}) => theme.colors.background};
  color: ${({theme}) => theme.colors.text};

  &:focus {
    border-color: ${({theme}) => theme.colors.primary};
    outline: none;
  }
`;
const FormTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: ${({theme}) => theme.spacing.sm};
  border: 2px solid ${({theme}) => `${theme.colors.primary}30`};
  border-radius: ${({theme}) => theme.borderRadius};
  background: ${({theme}) => theme.colors.background};
  color: ${({theme}) => theme.colors.text};
  resize: vertical;
  font-family: inherit;

  &:focus {
    border-color: ${({theme}) => theme.colors.primary};
    outline: none;
  }
`;

const SubmitButton = styled.button<{ $disabled: boolean }>`
  width: 100%;
  padding: ${({theme}) => theme.spacing.md};
  background: ${({theme, $disabled}) =>
          $disabled ? `${theme.colors.text}40` : theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({theme}) => theme.borderRadius};
  font-weight: bold;
  cursor: ${({$disabled}) => $disabled ? 'not-allowed' : 'pointer'};
  transition: ${({theme}) => theme.transitions.default};

  &:hover:not(:disabled) {
    background: ${({theme}) => theme.colors.secondary};
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: ${({theme}) => theme.colors.text};
  font-size: ${({theme}) => theme.fontSizes.large};
  margin: ${({theme}) => theme.spacing.xl} 0;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: ${({theme}) => theme.colors.error};
  font-size: ${({theme}) => theme.fontSizes.large};
  margin: ${({theme}) => theme.spacing.xl} 0;
`;

const RateLimitNotice = styled.div`
  background: ${({theme}) => `${theme.colors.error}20`};
  border: 2px solid ${({theme}) => `${theme.colors.error}40`};
  border-radius: ${({theme}) => theme.borderRadius};
  padding: ${({theme}) => theme.spacing.md};
  margin-bottom: ${({theme}) => theme.spacing.md};
  text-align: center;
  color: ${({theme}) => theme.colors.error};
  font-weight: bold;
`;

const ClickHint = styled.div<{ $visible: boolean }>`
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  background: ${({theme}) => theme.colors.primary};
  color: white;
  padding: ${({theme}) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({theme}) => theme.borderRadius};
  font-size: ${({theme}) => theme.fontSizes.small};
  white-space: nowrap;
  opacity: ${({$visible}) => $visible ? 1 : 0};
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 10;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: ${({theme}) => theme.colors.primary};
  }
`;

const MemoizedMailbox3D = React.memo(Mailbox3D);
const MemoizedPostcardCard = React.memo(PostcardCard);
const MemoizedStampCard = React.memo(StampCard);

const PostcardsPage: React.FC = () => {
    const [showPostcards, setShowPostcards] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedStampId, setSelectedStampId] = useState<string>('');
    const [nickname, setNickname] = useState('');
    const [message, setMessage] = useState('');

    const [isRateLimited, setIsRateLimited] = useState(false);
    const [rateLimitCountdown, setRateLimitCountdown] = useState(0);
    const [rateLimitMessage, setRateLimitMessage] = useState('');

    // 더블클릭시 엽서 리스트 팝업
    const [mailboxClickCount, setMailboxClickCount] = useState(0);
    const [showClickHint, setShowClickHint] = useState(false);

    const [showConfettiEffect, setShowConfettiEffect] = useState(false);

    const {data: postcardsResponse, isLoading, error, refetch} = usePostcards(0, 50);
    const createPostcardMutation = useCreatePostcard();

    const {t} = useLanguage();

    const formatMessage = (key: string, params: Record<string, any> = {}): string => {
        let message = t(key as any);
        Object.entries(params).forEach(([param, value]) => {
            message = message.replace(`{${param}}`, String(value));
        });
        return message;
    };

    useEffect(() => {
        const handleOpenModal = () => {
            setShowModal(true);
        };

        window.addEventListener('openPostcardModal', handleOpenModal);

        return () => {
            window.removeEventListener('openPostcardModal', handleOpenModal);
        };
    }, []);

    const availableStamps: Stamp[] = useMemo(() => [
        {
            id: 'awesome',
            name: t('postcard.stamps.awesome.name' as any),
            color: '#87CEEB',
            description: t('postcard.stamps.awesome.description' as any)
        },
        {
            id: 'interesting',
            name: t('postcard.stamps.interesting.name' as any),
            color: '#DDA0DD',
            description: t('postcard.stamps.interesting.description' as any)
        },
        {
            id: 'helpful',
            name: t('postcard.stamps.helpful.name' as any),
            color: '#90EE90',
            description: t('postcard.stamps.helpful.description' as any)
        },
        {
            id: 'inspiring',
            name: t('postcard.stamps.inspiring.name' as any),
            color: '#FFE4B5',
            description: t('postcard.stamps.inspiring.description' as any)
        },
        {
            id: 'thank_you',
            name: t('postcard.stamps.thank_you.name' as any),
            color: '#FFDAB9',
            description: t('postcard.stamps.thank_you.description' as any)
        },
        {
            id: 'love_it',
            name: t('postcard.stamps.love_it.name' as any),
            color: '#FFB6C1',
            description: t('postcard.stamps.love_it.description' as any)
        }
    ], [t]);

    const stampEntries = useMemo(() =>
            postcardsResponse?.content
                ? postcardsResponse.content.map(convertPostcardResponse)
                : [],
        [postcardsResponse?.content]
    );

    const getStampInfo = useCallback((stampId: string) => {
        return availableStamps.find(stamp => stamp.id === stampId);
    }, [availableStamps]);

    const handleMailboxClick = useCallback(() => {
        if (stampEntries.length === 0) return;

        if (mailboxClickCount === 0) {
            setMailboxClickCount(1);
            setShowClickHint(true);

            setTimeout(() => {
                setMailboxClickCount(0);
            }, 5000);
        } else {
            setShowPostcards(true);
            setMailboxClickCount(0);
            setShowClickHint(false);
        }
    }, [stampEntries.length, mailboxClickCount]);

    const handleShowPostcardsClick = useCallback(() => {
        setShowPostcards(true);
    }, []);

    const handleStampSelect = useCallback((stampId: string) => {
        setSelectedStampId(stampId);
    }, []);

    const handleModalClose = useCallback(() => {
        setShowModal(false);
    }, []);

    const handlePostcardsClose = useCallback(() => {
        setShowPostcards(false);
    }, []);

    useEffect(() => {
        if (rateLimitCountdown <= 0) return;

        const interval = setInterval(() => {
            setRateLimitCountdown(prev => {
                if (prev <= 1) {
                    setIsRateLimited(false);
                    setRateLimitMessage('');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [rateLimitCountdown]);

    useEffect(() => {
        if (!showClickHint) return;

        const hintTimer = setTimeout(() => {
            setShowClickHint(false);
        }, 3000);

        return () => clearTimeout(hintTimer);
    }, [showClickHint]);

    const handleStampSubmit = async () => {
        if (!selectedStampId) {
            alert(t('postcard.messages.selectStampAlert' as any));
            return;
        }

        const finalNickname = nickname.trim() || undefined;
        const finalMessage = message.trim() || undefined;

        try {
            await createPostcardMutation.mutateAsync({
                stampType: convertToStampType(selectedStampId),
                nickname: finalNickname,
                message: finalMessage
            });

            // 폼 초기화, 모달 닫기
            setSelectedStampId('');
            setNickname('');
            setMessage('');
            setShowModal(false);

            setShowConfettiEffect(true);

            // 목록 새로고침
            refetch();
        } catch (error: any) {
            console.error('엽서 등록 실패:', error);

            if (error.message?.includes('429') ||
                error.response?.status === 429 ||
                error.message?.includes('잦은 스탬프')) {

                setIsRateLimited(true);
                setRateLimitCountdown(60);
                setRateLimitMessage(t('postcard.rateLimit.notice' as any));
                setShowModal(false);
            } else {
                alert(t('postcard.messages.submitError' as any));
            }
        }
    };

    const renderedPostcardCards = useMemo(() => {
        return stampEntries.map((entry, index) => {
            const stampInfo = getStampInfo(entry.stampId);
            return (
                <MemoizedPostcardCard
                    key={entry.id}
                    entry={entry}
                    stampInfo={stampInfo}
                    index={index}
                />
            );
        });
    }, [stampEntries, getStampInfo]);

    const renderedStampCards = useMemo(() => {
        return availableStamps.map(stamp => (
            <MemoizedStampCard
                key={stamp.id}
                stamp={stamp}
                selected={selectedStampId === stamp.id}
                onClick={() => handleStampSelect(stamp.id)}
            />
        ));
    }, [availableStamps, selectedStampId, handleStampSelect]);

    if (isLoading) {
        return (
            <StampsContainer>
                <LoadingMessage>{t('postcard.messages.loadingPostcards' as any)}</LoadingMessage>
            </StampsContainer>
        );
    }

    if (error) {
        return (
            <StampsContainer>
                <ErrorMessage>
                    {t('postcard.messages.loadingError' as any)}
                    <br/>
                    <button onClick={() => refetch()}>{t('postcard.messages.retry' as any)}</button>
                </ErrorMessage>
            </StampsContainer>
        );
    }

    return (
        <StampsContainer>
            <PageHeader>
                <PageTitle>{t('postcard.title' as any)}</PageTitle>
                <PageDescription>
                    {t('postcard.description' as any)}
                </PageDescription>
            </PageHeader>

            {isRateLimited && (
                <RateLimitNotice>
                    {rateLimitMessage}
                    <br/>
                    {formatMessage('postcard.rateLimit.countdown', {seconds: rateLimitCountdown})}
                </RateLimitNotice>
            )}

            <MailboxSection>
                <MailboxWrapper>
                    <MemoizedMailbox3D
                        hasEntries={stampEntries.length > 0}
                        onClick={handleMailboxClick}
                        entries={stampEntries}
                    />
                    <ClickHint $visible={showClickHint && stampEntries.length > 0}>
                        {t('postcard.mailbox.clickHint' as any)}
                    </ClickHint>
                </MailboxWrapper>

                <MailboxText $hasEntries={stampEntries.length > 0}>
                    {stampEntries.length > 0
                        ? formatMessage('postcard.mailbox.hasEntries', {count: stampEntries.length})
                        : t('postcard.mailbox.empty' as any)
                    }
                </MailboxText>

                <ActionButtons>
                    <ActionButton
                        $variant="primary"
                        onClick={() => setShowModal(true)}
                        disabled={createPostcardMutation.isPending}
                    >
                        {createPostcardMutation.isPending
                            ? t('postcard.buttons.sending' as any)
                            : t('postcard.buttons.writePostcard' as any)
                        }
                    </ActionButton>
                    {stampEntries.length > 0 && (
                        <ActionButton $variant="secondary" onClick={handleShowPostcardsClick}>
                            {formatMessage('postcard.buttons.viewPostcards', {count: stampEntries.length})}
                        </ActionButton>
                    )}
                </ActionButtons>
            </MailboxSection>

            <Confetti
                show={showConfettiEffect}
                message={t('postcard.messages.success' as any)}
                emoji="🎉"
                onComplete={() => setShowConfettiEffect(false)}
            />


            {showPostcards && stampEntries.length > 0 && ReactDOM.createPortal(
                <PostcardOverlay $isVisible={true}>
                    <PostcardListHeader>
                        <PostcardListTitle>
                            {formatMessage('postcard.list.title', {count: stampEntries.length})}
                        </PostcardListTitle>
                        <ClosePostcardsButton onClick={handlePostcardsClose}>
                            {t('postcard.buttons.closeMailbox' as any)}
                        </ClosePostcardsButton>
                    </PostcardListHeader>
                    <PostcardListContent>
                        <PostcardGrid>
                            {renderedPostcardCards}
                        </PostcardGrid>
                    </PostcardListContent>
                </PostcardOverlay>,
                document.getElementById('modal-root')!
            )}

            {/* 엽서 작성 모달 */}
            {showModal && ReactDOM.createPortal(
                <Modal $isOpen={showModal}>
                    <ModalContent>
                        <ModalHeader>
                            <ModalTitle>{t('postcard.modal.title' as any)}</ModalTitle>
                            <CloseButton onClick={handleModalClose}>×</CloseButton>
                        </ModalHeader>

                        <FormGroup>
                            <FormLabel $required>{t('postcard.modal.selectStamp' as any)}</FormLabel>
                            <StampGrid>
                                {renderedStampCards}
                            </StampGrid>
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>{t('postcard.modal.nickname' as any)}</FormLabel>
                            <FormInput
                                type="text"
                                placeholder={t('postcard.modal.nicknamePlaceholder' as any)}
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                maxLength={20}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>{t('postcard.modal.message' as any)}</FormLabel>
                            <FormTextarea
                                placeholder={t('postcard.modal.messagePlaceholder' as any)}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                maxLength={200}
                            />
                        </FormGroup>

                        <SubmitButton
                            $disabled={!selectedStampId || createPostcardMutation.isPending}
                            onClick={handleStampSubmit}
                            disabled={!selectedStampId || createPostcardMutation.isPending}
                        >
                            {createPostcardMutation.isPending
                                ? t('postcard.modal.submitSending' as any)
                                : selectedStampId
                                    ? t('postcard.modal.submitSelected' as any)
                                    : t('postcard.modal.submitSelectStamp' as any)
                            }
                        </SubmitButton>
                    </ModalContent>
                </Modal>,
                document.getElementById('modal-root')!
            )}
        </StampsContainer>
    );
};

export default PostcardsPage;