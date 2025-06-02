import React from 'react';
import styled from 'styled-components';
import {CommentForm} from './CommentForm';
import {CommentItem} from './CommentItem';
import {usePostComments} from "../../../hooks/useApi.ts";
import Pagination from "../Pagination.tsx";

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
    const [currentPage, setCurrentPage] = React.useState(0);
    const pageSize = 10;

    const {data: commentsData, isLoading, error} = usePostComments(postId, currentPage, pageSize);

    const handleCommentSuccess = () => {
        // 댓글 작성 성공 시 첫 페이지로 이동
        setCurrentPage(0);

    };

    if (error) {
        return (
            <CommentSectionContainer>
                <CommentTitle>댓글을 불러오는데 실패했습니다.</CommentTitle>
            </CommentSectionContainer>
        );
    }

    const comments = commentsData?.content || [];
    const totalPages = commentsData ? Math.ceil(commentsData.total / commentsData.size) : 0;
    const totalComments = commentsData?.total || 0;

    return (
        <CommentSectionContainer>
            <CommentTitle>
                댓글 <CommentCount>{totalComments}</CommentCount>
            </CommentTitle>

            <CommentForm postId={postId} onSuccess={handleCommentSuccess}/>

            {isLoading ? (
                <LoadingMessage>댓글을 불러오는 중...</LoadingMessage>
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
                    아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
                </NoComments>
            )}
        </CommentSectionContainer>
    );
};