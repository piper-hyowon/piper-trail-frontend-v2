import React from 'react';
import styled from 'styled-components';
import BaseModal from './BaseModal';

const PostcardForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({theme}) => theme.spacing.md};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({theme}) => theme.spacing.xs};
`;

const FormLabel = styled.label`
  color: ${({theme}) => theme.colors.text};
  font-weight: bold;
  font-size: ${({theme}) => theme.fontSizes.medium};
`;

const ActionButton = styled.button`
  padding: ${({theme}) => `${theme.spacing.md} ${theme.spacing.lg}`};
  border: none;
  border-radius: ${({theme}) => theme.borderRadius};
  font-weight: bold;
  font-size: ${({theme}) => theme.fontSizes.medium};
  cursor: pointer;
  transition: ${({theme}) => theme.transitions.default};
  background: ${({theme}) => theme.colors.primary};
  color: white;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${({theme}) => `${theme.colors.primary}40`};
  }

  &:disabled {
    background: ${({theme}) => `${theme.colors.text}40`};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

interface PostcardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigateToPostcards: () => void;
}

const PostcardModal: React.FC<PostcardModalProps> = ({
                                                         isOpen,
                                                         onClose,
                                                         onNavigateToPostcards
                                                     }) => {
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="✍️ 엽서 작성하기"
            maxWidth="500px"
        >
            <PostcardForm>
                <FormGroup>
                    <FormLabel>📮 방문자 우체통</FormLabel>
                    <p>엽서 작성 페이지로 이동하여 더 상세한 작성 옵션을 이용하세요!</p>
                </FormGroup>
                <ActionButton onClick={onNavigateToPostcards}>
                    📮 엽서 작성 페이지로 이동
                </ActionButton>
            </PostcardForm>
        </BaseModal>
    );
};

export default PostcardModal;