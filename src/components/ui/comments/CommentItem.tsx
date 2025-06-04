import React, {useState} from 'react';
import styled from 'styled-components';
import {CommentResponse, FontFamily, TextColor} from "../../../types/api.ts";
import {useDeleteComment} from "../../../hooks/useApi.ts";
import {useLanguage} from "../../../context/LanguageContext.tsx";

interface CommentItemProps {
    comment: CommentResponse;
    postId: string;
    isAdmin: boolean;
}

const CommentContainer = styled.div<{ $reviewNeeded?: boolean }>`
  background: ${({theme, $reviewNeeded}) =>
          $reviewNeeded ? `${theme.colors.text}05` : theme.colors.background};
  border: 1px solid ${({theme, $reviewNeeded}) =>
          $reviewNeeded ? `${theme.colors.text}30` : `${theme.colors.primary}20`};
  border-radius: ${({theme}) => theme.borderRadius};
  padding: ${({theme}) => theme.spacing.md};
  margin-bottom: ${({theme}) => theme.spacing.md};
  ${({$reviewNeeded}) => $reviewNeeded && 'border-style: dashed;'}
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({theme}) => theme.spacing.sm};
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({theme}) => theme.spacing.sm};
`;

const AuthorName = styled.span`
  font-weight: bold;
  color: ${({theme}) => theme.colors.primary};
`;

const CommentDate = styled.span`
  font-size: ${({theme}) => theme.fontSizes.small};
  color: ${({theme}) => theme.colors.text}60;
`;

const CommentContent = styled.div<{ $fontFamily?: FontFamily; $textColor?: TextColor; $reviewNeeded?: boolean }>`
  margin-bottom: ${({theme}) => theme.spacing.md};
  line-height: 1.6;

  // 검토 중인 댓글은 기본 스타일로 고정 (백엔드에서 이미 처리하긴 했음)
  font-family: ${({$fontFamily, $reviewNeeded}) => {
    if ($reviewNeeded) return 'inherit';
    switch ($fontFamily) {
      case FontFamily.SERIF:
        return 'serif';
      case FontFamily.SANS_SERIF:
        return 'sans-serif';
      case FontFamily.MONOSPACE:
        return 'monospace';
      default:
        return 'inherit';
    }
  }};

  color: ${({$textColor, theme, $reviewNeeded}) => {
    if ($reviewNeeded) return `${theme.colors.text}80`;
    switch ($textColor) {
      case TextColor.BLACK:
        return theme.colors.commentText.black;
      case TextColor.BLUE:
        return theme.colors.commentText.blue;
      case TextColor.RED:
        return theme.colors.commentText.red;
      case TextColor.GREEN:
        return theme.colors.commentText.green;
      default:
        return theme.colors.text;
    }
  }};

  font-style: ${({$reviewNeeded}) => $reviewNeeded ? 'italic' : 'normal'};
`;

const CommentActions = styled.div`
  display: flex;
  gap: ${({theme}) => theme.spacing.sm};
  align-items: center;
`;

const ActionButton = styled.button`
  background: ${({theme}) => theme.colors.error};
  color: white;
  border: none;
  padding: ${({theme}) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({theme}) => theme.borderRadius};
  font-size: ${({theme}) => theme.fontSizes.small};
  cursor: pointer;
  transition: ${({theme}) => theme.transitions.default};

  &:hover:not(:disabled) {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DeleteForm = styled.div`
  margin-top: ${({theme}) => theme.spacing.sm};
  padding: ${({theme}) => theme.spacing.sm};
  background: ${({theme}) => `${theme.colors.error}10`};
  border-radius: ${({theme}) => theme.borderRadius};
  border: 1px solid ${({theme}) => `${theme.colors.error}30`};
`;

const DeleteInput = styled.input`
  width: 200px;
  padding: ${({theme}) => theme.spacing.xs};
  margin-right: ${({theme}) => theme.spacing.sm};
  border: 1px solid ${({theme}) => `${theme.colors.error}50`};
  border-radius: ${({theme}) => theme.borderRadius};
`;

export const CommentItem: React.FC<CommentItemProps> = ({comment, postId, isAdmin}) => {
    const {t, language} = useLanguage();

    const [showDeleteForm, setShowDeleteForm] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');

    const deleteCommentMutation = useDeleteComment();

    const formatMessage = (key: string, params: Record<string, any> = {}): string => {
        let message = t(key as any);
        Object.entries(params).forEach(([param, value]) => {
            message = message.replace(`{${param}}`, String(value));
        });
        return message;
    };

    const handleDelete = async () => {
        if (!deletePassword.trim()) {
            alert(t('comment.item.deletePasswordRequired' as any));
            return;
        }

        try {
            await deleteCommentMutation.mutateAsync({
                postId,
                commentId: comment.id,
                password: deletePassword,
            });
            setShowDeleteForm(false);
            setDeletePassword('');
            alert(t('comment.item.deleteSuccess' as any));
        } catch (error) {
            console.error('Delete error details:', error);

            if (error.message.includes('HTTP 401') || error.message.includes('HTTP 403')) {
                alert(t('comment.item.deleteErrors.wrongPassword' as any));
            } else if (error.message.includes('HTTP 404')) {
                alert(t('comment.item.deleteErrors.notFound' as any));
            } else {
                alert(formatMessage('comment.item.deleteErrors.failed', {error: error.message}));
            }
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <CommentContainer $reviewNeeded={comment.reviewNeeded}>
            <CommentHeader>
                <AuthorInfo>
                    <AuthorName>{comment.author}</AuthorName>
                    <CommentDate>{formatDate(comment.createdAt)}</CommentDate>
                </AuthorInfo>
            </CommentHeader>

            <CommentContent
                $fontFamily={comment.fontFamily}
                $textColor={comment.textColor}
                $reviewNeeded={comment.reviewNeeded}
            >
                {comment.content}
            </CommentContent>

            {/* 검토 중인 댓글은 삭제 버튼 숨김 */}
            {!comment.reviewNeeded && (
                <CommentActions>
                    <ActionButton onClick={() => setShowDeleteForm(!showDeleteForm)}>
                        {t('comment.item.delete' as any)}
                    </ActionButton>
                </CommentActions>
            )}

            {showDeleteForm && !comment.reviewNeeded && (
                <DeleteForm>
                    <DeleteInput
                        type="password"
                        placeholder={t('comment.item.deletePasswordPlaceholder' as any)}
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                    />
                    <ActionButton
                        onClick={handleDelete}
                        disabled={deleteCommentMutation.isPending}
                    >
                        {deleteCommentMutation.isPending
                            ? t('comment.item.deleting' as any)
                            : t('comment.item.deleteConfirm' as any)
                        }
                    </ActionButton>
                    <ActionButton onClick={() => setShowDeleteForm(false)}>
                        {t('comment.item.cancel' as any)}
                    </ActionButton>
                </DeleteForm>
            )}
        </CommentContainer>
    );
};