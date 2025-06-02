import React, {useEffect, useState, useMemo, useCallback} from 'react';
import styled from 'styled-components';
import Mailbox3D from '../components/ui/stamps/Mailbox3D';
import StampCard from '../components/ui/stamps/StampCard';
import PostcardCard from '../components/ui/stamps/PostcardCard';
import {usePostcards, useCreatePostcard} from '../hooks/useApi';
import {StampType} from '../types/api';

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
  padding: ${({theme}) => theme.spacing.lg};
  min-height: 70vh;
`;

const PageHeader = styled.header`
  text-align: center;
  margin-bottom: ${({theme}) => theme.spacing.xl};
  padding: ${({theme}) => theme.spacing.lg};
  background: ${({theme}) => theme.colors.background};
  border-radius: ${({theme}) => theme.borderRadius};
`;

const PageTitle = styled.h1`
  color: ${({theme}) => theme.colors.primary};
  margin-bottom: ${({theme}) => theme.spacing.sm};
`;

const PageDescription = styled.p`
  color: ${({theme}) => `${theme.colors.text}80`};
  font-size: ${({theme}) => theme.fontSizes.large};
  line-height: 1.6;
`;

const MailboxSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${({theme}) => theme.spacing.xl};
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
  gap: ${({theme}) => theme.spacing.md};
  justify-content: center;
  margin-top: ${({theme}) => theme.spacing.lg};
`;

const ActionButton = styled.button<{ $variant: 'primary' | 'secondary' }>`
  padding: ${({theme}) => `${theme.spacing.md} ${theme.spacing.lg}`};
  border: none;
  border-radius: ${({theme}) => theme.borderRadius};
  font-weight: bold;
  font-size: ${({theme}) => theme.fontSizes.medium};
  cursor: pointer;
  transition: ${({theme}) => theme.transitions.default};
  display: flex;
  align-items: center;
  gap: ${({theme}) => theme.spacing.sm};

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
  z-index: 999;
  display: ${({$isVisible}) => $isVisible ? 'flex' : 'none'};
  flex-direction: column;
  padding: ${({theme}) => theme.spacing.lg};
  overflow-y: auto;
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
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled.div`
  background: ${({theme}) => theme.colors.background};
  border-radius: ${({theme}) => theme.borderRadius};
  padding: ${({theme}) => theme.spacing.xl};
  max-width: 900px;
  width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({theme}) => theme.spacing.lg};
`;

const ModalTitle = styled.h3`
  color: ${({theme}) => theme.colors.primary};
  margin: 0;
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
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: ${({theme}) => theme.spacing.lg};
  margin-bottom: ${({theme}) => theme.spacing.lg};
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

    const {data: postcardsResponse, isLoading, error, refetch} = usePostcards(0, 50);
    const createPostcardMutation = useCreatePostcard();

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
            name: '멋져요',
            color: '#87CEEB',
            description: '정말 멋진 콘텐츠!'
        },
        {
            id: 'interesting',
            name: '흥미로워요',
            color: '#DDA0DD',
            description: '흥미롭고 유익해요'
        },
        {
            id: 'helpful',
            name: '도움돼요',
            color: '#90EE90',
            description: '많은 도움이 됐어요'
        },
        {
            id: 'inspiring',
            name: '영감받았어요',
            color: '#FFE4B5',
            description: '새로운 아이디어를 얻었어요'
        },
        {
            id: 'thank_you',
            name: '고마워요',
            color: '#FFDAB9',
            description: '감사한 마음을 전해요'
        },
        {
            id: 'love_it',
            name: '사랑해요',
            color: '#FFB6C1',
            description: '정말 사랑하는 콘텐츠!'
        }
    ], []);

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
            setShowPostcards(!showPostcards);
            setMailboxClickCount(0);
            setShowClickHint(false);
        }
    }, [stampEntries.length, mailboxClickCount, showPostcards]);

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
            alert('도장을 선택해주세요!');
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

            alert('엽서를 우체통에 넣었어요! 📮✨');

            // 목록 새로고침
            refetch();
        } catch (error: any) {
            console.error('엽서 등록 실패:', error);

            if (error.message?.includes('429') ||
                error.response?.status === 429 ||
                error.message?.includes('잦은 스탬프')) {

                setIsRateLimited(true);
                setRateLimitCountdown(60);
                setRateLimitMessage('너무 빨라요');
                setShowModal(false);
            } else {
                alert('엽서 등록에 실패했습니다. 다시 시도해주세요.');
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
                <LoadingMessage>엽서들을 불러오고 있어요... 📮</LoadingMessage>
            </StampsContainer>
        );
    }

    if (error) {
        return (
            <StampsContainer>
                <ErrorMessage>
                    엽서를 불러오는데 실패했어요 😢
                    <br/>
                    <button onClick={() => refetch()}>다시 시도</button>
                </ErrorMessage>
            </StampsContainer>
        );
    }

    return (
        <StampsContainer>
            <PageHeader>
                <PageTitle>📮 방문자 우체통</PageTitle>
                <PageDescription>
                    여러분의 마음을 담은 엽서를 보내주세요.<br/>
                    예쁜 도장과 함께 따뜻한 메시지를 남겨주시면 큰 힘이 됩니다. ✨
                </PageDescription>
            </PageHeader>

            {isRateLimited && (
                <RateLimitNotice>
                    ⏰ {rateLimitMessage}
                    <br/>
                    {rateLimitCountdown}초 후 다시 시도할 수 있어요
                </RateLimitNotice>
            )}

            <MailboxSection>
                <div style={{position: 'relative'}}>
                    <MemoizedMailbox3D
                        hasEntries={stampEntries.length > 0}
                        onClick={handleMailboxClick}
                        entries={stampEntries}
                    />
                    <ClickHint $visible={showClickHint && stampEntries.length > 0}>
                        👆 한 번 더 클릭하면 엽서를 볼 수 있어요!
                    </ClickHint>
                </div>

                <MailboxText $hasEntries={stampEntries.length > 0}>
                    {stampEntries.length > 0
                        ? `📬 ${stampEntries.length}통의 엽서가 도착했어요! (클릭해서 확인)`
                        : '📭 아직 엽서가 없어요. 첫 번째 엽서를 보내주세요!'
                    }
                </MailboxText>

                <ActionButtons>
                    <ActionButton
                        $variant="primary"
                        onClick={() => setShowModal(true)}
                        disabled={createPostcardMutation.isPending}
                    >
                        ✍️ {createPostcardMutation.isPending ? '보내는 중...' : '엽서 보내기'}
                    </ActionButton>
                    {stampEntries.length > 0 && (
                        <ActionButton $variant="secondary" onClick={handleMailboxClick}>
                            📮 엽서 보기 ({stampEntries.length}개)
                        </ActionButton>
                    )}
                </ActionButtons>
            </MailboxSection>

            <PostcardOverlay $isVisible={showPostcards && stampEntries.length > 0}>
                <PostcardListHeader>
                    <PostcardListTitle>
                        📮 도착한 엽서들 ({stampEntries.length}개)
                    </PostcardListTitle>
                    <ClosePostcardsButton onClick={handlePostcardsClose}>
                        ✕ 우체통 닫기
                    </ClosePostcardsButton>
                </PostcardListHeader>

                <PostcardGrid>
                    {renderedPostcardCards}
                </PostcardGrid>
            </PostcardOverlay>

            {/* 엽서 작성 모달 */}
            <Modal $isOpen={showModal}>
                <ModalContent>
                    <ModalHeader>
                        <ModalTitle>✍️ 엽서 작성하기</ModalTitle>
                        <CloseButton onClick={handleModalClose}>×</CloseButton>
                    </ModalHeader>

                    <FormGroup>
                        <FormLabel $required>어떤 도장을 찍어주실건가요?</FormLabel>
                        <StampGrid>
                            {renderedStampCards}
                        </StampGrid>
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>닉네임</FormLabel>
                        <FormInput
                            type="text"
                            placeholder="어떻게 불러드릴까요? (비워두면 '익명의 방문자')"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            maxLength={20}
                        />
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>한줄 메시지 (선택)</FormLabel>
                        <FormTextarea
                            placeholder="더 전하고 싶은 말이 있으시면 적어주세요!"
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
                            ? '📮 우체통에 넣는 중...'
                            : selectedStampId
                                ? '📮 우체통에 넣기'
                                : '도장을 선택해주세요'
                        }
                    </SubmitButton>
                </ModalContent>
            </Modal>
        </StampsContainer>
    );
};

export default PostcardsPage;