import React from 'react';
import styled from 'styled-components';

interface DeleteConfirmModalProps {
    postTitle: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDeleting?: boolean;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: ${({theme}) => theme.colors.background};
  border-radius: ${({theme}) => theme.borderRadius};
  padding: ${({theme}) => theme.spacing.lg};
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  margin-bottom: ${({theme}) => theme.spacing.md};
`;

const ModalTitle = styled.h2`
  color: ${({theme}) => theme.colors.error};
  margin-bottom: ${({theme}) => theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${({theme}) => theme.spacing.xs};
`;

const PostTitleDisplay = styled.div`
  background-color: ${({theme}) => `${theme.colors.error}10`};
  border: 1px solid ${({theme}) => `${theme.colors.error}30`};
  border-radius: ${({theme}) => theme.borderRadius};
  padding: ${({theme}) => theme.spacing.md};
  margin-bottom: ${({theme}) => theme.spacing.md};

  p {
    margin: 0;
    color: ${({theme}) => theme.colors.text};
    font-weight: 500;
  }

  span {
    font-size: ${({theme}) => theme.fontSizes.small};
    color: ${({theme}) => `${theme.colors.text}80`};
  }
`;

const WarningText = styled.p`
  color: ${({theme}) => theme.colors.error};
  font-size: ${({theme}) => theme.fontSizes.small};
  margin-bottom: ${({theme}) => theme.spacing.md};
  background-color: ${({theme}) => `${theme.colors.error}10`};
  border-radius: ${({theme}) => theme.borderRadius};
  padding: ${({theme}) => theme.spacing.sm};
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({theme}) => theme.spacing.md};
  margin-top: ${({theme}) => theme.spacing.lg};
`;

const DeleteButton = styled.button`
  background-color: ${({theme}) => theme.colors.error};
  color: white;
  font-weight: bold;
  padding: ${({theme}) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border: none;
  border-radius: ${({theme}) => theme.borderRadius};
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background-color: ${({theme}) => theme.colors.text}40;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  background-color: transparent;
  color: ${({theme}) => theme.colors.text};
  font-weight: bold;
  padding: ${({theme}) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border: 1px solid ${({theme}) => theme.colors.text}40;
  border-radius: ${({theme}) => theme.borderRadius};
  cursor: pointer;

  &:hover {
    background-color: ${({theme}) => theme.colors.text}10;
  }
`;

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
                                                                   postTitle,
                                                                   onConfirm,
                                                                   onCancel,
                                                                   isDeleting = false
                                                               }) => {
    return (
        <ModalOverlay onClick={onCancel}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <ModalHeader>
                    <ModalTitle>
                        🗑️ 포스트 삭제
                    </ModalTitle>
                </ModalHeader>

                <PostTitleDisplay>
                    <span>삭제할 포스트:</span>
                    <p>"{postTitle}"</p>
                </PostTitleDisplay>

                <WarningText>
                    ⚠️ 이 작업은 되돌릴 수 없습니다. 정말로 삭제하시겠습니까?
                </WarningText>

                <ButtonGroup>
                    <CancelButton type="button" onClick={onCancel} disabled={isDeleting}>
                        취소
                    </CancelButton>
                    <DeleteButton type="button" onClick={onConfirm} disabled={isDeleting}>
                        {isDeleting ? '삭제 중...' : '삭제'}
                    </DeleteButton>
                </ButtonGroup>
            </ModalContent>
        </ModalOverlay>
    );
};

export default DeleteConfirmModal;