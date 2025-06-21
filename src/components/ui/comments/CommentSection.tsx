import React, {useState} from 'react';
import styled from 'styled-components';
import {CommentForm} from './CommentForm';
import {CommentItem} from './CommentItem';
import {usePostComments} from "../../../hooks/useApi.ts";
import Pagination from "../Pagination.tsx";
import {useLanguage} from "../../../context/LanguageContext.tsx";
import Confetti from "../effects/Confetti.tsx";


interface CommentSectionProps {
    postId: string;
    isAdmin?: boolean;
}

const CommentSectionContainer = styled.section`
  margin-top: ${({theme}) => theme.spacing.xl};
  padding-top: ${({theme}) => theme.spacing.xl};
  border-top: 2px solid ${({theme}) => theme.colors.primary}20;
`;

const CommentTitle = styled.h3`
  color: ${({theme}) => theme.colors.primary};
  margin-bottom: ${({theme}) => theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${({theme}) => theme.spacing.sm};
`;

const CommentCount = styled.span`
  background: ${({theme}) => theme.colors.primary};
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: ${({theme}) => theme.fontSizes.small};
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${({theme}) => theme.spacing.xl};
  color: ${({theme}) => theme.colors.text}60;
`;

const NoComments = styled.div`
  text-align: center;
  padding: ${({theme}) => theme.spacing.xl};
  color: ${({theme}) => theme.colors.text}60;
`;

export const CommentSection: React.FC<CommentSectionProps> = ({postId, isAdmin = false}) => {
    const {t} = useLanguage();
    const [currentPage, setCurrentPage] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [confettiMessage, setConfettiMessage] = useState('');
    const [confettiEmoji, setConfettiEmoji] = useState('🎉');
    const pageSize = 10;

    const {data: commentsData, isLoading, error, refetch} = usePostComments(postId, currentPage, pageSize);

    const formatMessage = (key: string, params: Record<string, any> = {}): string => {
        let message = t(key as any);
        Object.entries(params).forEach(([param, value]) => {
            message = message.replace(`{${param}}`, String(value));
        });
        return message;
    };

    const handleCommentSuccess = () => {
        const totalComments = commentsData?.total || 0;
        const isFirstComment = totalComments === 0;

        if (isFirstComment) {
            setConfettiMessage(t('comment.confetti.firstComment' as any) || '축하합니다! 첫 번째 댓글을 작성하셨어요! 🥇');
            setConfettiEmoji('🥇');
        } else {
            const messages = [
                t('comment.confetti.thankYou1' as any) || '댓글 감사합니다! 여러분의 의견은 큰 힘이 됩니다! 💝',
                t('comment.confetti.thankYou2' as any) || '소중한 댓글 감사드려요! 함께 성장해나가요! 🌱',
                t('comment.confetti.thankYou3' as any) || '멋진 댓글이에요! 여러분과 소통할 수 있어 행복합니다! ✨',
                t('comment.confetti.thankYou4' as any) || '댓글 남겨주셔서 감사합니다! 더 좋은 콘텐츠로 보답하겠습니다! 🙏'
            ];
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            setConfettiMessage(randomMessage);

            const emojis = ['💝', '🌟', '✨', '🎊', '🎈', '🥳'];
            setConfettiEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
        }

        setShowConfetti(true);

        setTimeout(() => {
            refetch();
            setCurrentPage(0);
        }, 500);
    };

    if (error) {
        return (
            <CommentSectionContainer>
                <CommentTitle>{t('comment.section.loadingError' as any)}</CommentTitle>
            </CommentSectionContainer>
        );
    }

    const comments = commentsData?.content || [];
    const totalPages = commentsData ? Math.ceil(commentsData.total / commentsData.size) : 0;
    const totalComments = commentsData?.total || 0;

    return (
        <>
            <CommentSectionContainer>
                <CommentTitle>
                    {t('comment.section.title' as any)}
                    <CommentCount>{formatMessage('comment.section.count', {count: totalComments})}</CommentCount>
                </CommentTitle>

                <CommentForm postId={postId} onSuccess={handleCommentSuccess}/>

                {isLoading ? (
                    <LoadingMessage>{t('comment.section.loading' as any)}</LoadingMessage>
                ) : comments.length > 0 ? (
                    <>
                        {comments.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                postId={postId}
                                isAdmin={isAdmin}
                            />
                        ))}

                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </>
                ) : (
                    <NoComments>
                        {t('comment.section.noComments' as any)}
                    </NoComments>
                )}
            </CommentSectionContainer>

            <Confetti
                show={showConfetti}
                message={confettiMessage}
                emoji={confettiEmoji}
                particleCount={showConfetti && totalComments === 0 ? 200 : 150}
                duration={showConfetti && totalComments === 0 ? 8000 : 6000}
                colors={showConfetti && totalComments === 0
                    ? ['#FFD700', '#FFA500', '#FF69B4', '#87CEEB', '#98FB98']
                    : ['#FF69B4', '#87CEEB', '#98FB98', '#DDA0DD', '#F0E68C', '#FF6347']
                }
                onComplete={() => setShowConfetti(false)}
            />
        </>
    );
};