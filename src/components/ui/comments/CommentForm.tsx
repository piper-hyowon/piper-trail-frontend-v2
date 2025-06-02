// TODO: 중복 코드 정리
import React, {useState} from 'react';
import styled from 'styled-components';
import {CreateCommentRequest, FontFamily, TextColor} from "../../../types/api.ts";
import {useCreateComment} from "../../../hooks/useApi.ts";

interface CommentFormProps {
    postId: string;
    onSuccess?: () => void;
}

const FormContainer = styled.div`
  background: ${({theme}) => theme.colors.background};
  border-radius: ${({theme}) => theme.borderRadius};
  padding: ${({theme}) => theme.spacing.lg};
  margin-bottom: ${({theme}) => theme.spacing.lg};
`;

const FormTitle = styled.h3`
  color: ${({theme}) => theme.colors.primary};
  margin-bottom: ${({theme}) => theme.spacing.md};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({theme}) => theme.spacing.md};
  margin-bottom: ${({theme}) => theme.spacing.md};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: ${({theme}) => theme.spacing.md};
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: ${({theme}) => theme.spacing.xs};
  font-weight: bold;
  color: ${({theme}) => theme.colors.text};
`;

const FormInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: ${({theme}) => theme.spacing.sm};
  border: 2px solid ${({theme, $hasError}) =>
          $hasError ? theme.colors.error : `${theme.colors.primary}30`};
  border-radius: ${({theme}) => theme.borderRadius};
  background: ${({theme}) => theme.colors.background};
  color: ${({theme}) => theme.colors.text};

  &:focus {
    border-color: ${({theme}) => theme.colors.primary};
    outline: none;
  }
`;

const FormSelect = styled.select`
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

const FormTextarea = styled.textarea<{ $hasError?: boolean; $fontFamily?: FontFamily; $textColor?: TextColor }>`
  width: 100%;
  min-height: 120px;
  padding: ${({theme}) => theme.spacing.md};
  border: 2px solid ${({theme, $hasError}) =>
          $hasError ? theme.colors.error : `${theme.colors.primary}30`};
  border-radius: ${({theme}) => theme.borderRadius};
  background: ${({theme}) => theme.colors.background};
  resize: vertical;
  font-family: ${({$fontFamily}) => {
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
  color: ${({$textColor, theme}) => {
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

  &:focus {
    border-color: ${({theme}) => theme.colors.primary};
    outline: none;
  }
`;

const ErrorMessage = styled.span`
  color: ${({theme}) => theme.colors.error};
  font-size: ${({theme}) => theme.fontSizes.small};
  margin-top: ${({theme}) => theme.spacing.xs};
  display: block;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({theme}) => theme.spacing.md};
  justify-content: flex-end;
`;

const SubmitButton = styled.button`
  background: ${({theme}) => theme.colors.primary};
  color: white;
  border: none;
  padding: ${({theme}) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: ${({theme}) => theme.borderRadius};
  font-weight: bold;
  cursor: pointer;
  transition: ${({theme}) => theme.transitions.default};

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    background: ${({theme}) => theme.colors.text}40;
    cursor: not-allowed;
  }
`;

const PreviewContainer = styled.div<{ $fontFamily?: FontFamily; $textColor?: TextColor }>`
  background: ${({theme}) => theme.colors.background};
  border: 1px solid ${({theme}) => `${theme.colors.primary}20`};
  border-radius: ${({theme}) => theme.borderRadius};
  padding: ${({theme}) => theme.spacing.md};
  margin-top: ${({theme}) => theme.spacing.sm};
  font-family: ${({$fontFamily}) => {
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
  color: ${({$textColor, theme}) => {
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
`;

export const CommentForm: React.FC<CommentFormProps> = ({postId, onSuccess}) => {
    const [formData, setFormData] = useState({
        author: '',
        password: '',
        content: '',
        fontFamily: FontFamily.DEFAULT,
        textColor: TextColor.DEFAULT,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const createCommentMutation = useCreateComment();

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({...prev, [field]: value}));
        if (errors[field]) {
            setErrors(prev => ({...prev, [field]: ''}));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.author.trim()) {
            newErrors.author = '닉네임을 입력해주세요.';
        }
        if (!formData.password.trim() || formData.password.length < 4) {
            newErrors.password = '비밀번호를 4글자 이상 입력해주세요.';
        }
        if (!formData.content.trim()) {
            newErrors.content = '댓글 내용을 입력해주세요.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const commentData: CreateCommentRequest = {
                author: formData.author.trim(),
                password: formData.password,
                content: formData.content.trim(),
                fontFamily: formData.fontFamily,
                textColor: formData.textColor,
            };

            await createCommentMutation.mutateAsync({postId, comment: commentData});

            // 폼 초기화
            setFormData({
                author: '',
                password: '',
                content: '',
                fontFamily: FontFamily.DEFAULT,
                textColor: TextColor.DEFAULT,
            });

            onSuccess?.();
        } catch (error) {
            console.error('댓글 작성 실패:', error);
        }
    };

    return (
        <FormContainer>
            <FormTitle>댓글 작성</FormTitle>

            <form onSubmit={handleSubmit}>
                <FormRow>
                    <FormGroup>
                        <FormLabel>닉네임</FormLabel>
                        <FormInput
                            type="text"
                            placeholder="닉네임을 입력하세요"
                            value={formData.author}
                            onChange={(e) => handleChange('author', e.target.value)}
                            $hasError={!!errors.author}
                        />
                        {errors.author && <ErrorMessage>{errors.author}</ErrorMessage>}
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>비밀번호</FormLabel>
                        <FormInput
                            type="password"
                            placeholder="댓글 삭제 시 사용됩니다(4글자 이상)"
                            value={formData.password}
                            onChange={(e) => handleChange('password', e.target.value)}
                            $hasError={!!errors.password}
                        />
                        {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
                    </FormGroup>
                </FormRow>

                <FormRow>
                    <FormGroup>
                        <FormLabel>폰트</FormLabel>
                        <FormSelect
                            value={formData.fontFamily}
                            onChange={(e) => handleChange('fontFamily', e.target.value as FontFamily)}
                        >
                            <option value={FontFamily.DEFAULT}>기본</option>
                            <option value={FontFamily.SERIF}>세리프</option>
                            <option value={FontFamily.SANS_SERIF}>산세리프</option>
                            <option value={FontFamily.MONOSPACE}>모노스페이스</option>
                        </FormSelect>
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>글자 색상</FormLabel>
                        <FormSelect
                            value={formData.textColor}
                            onChange={(e) => handleChange('textColor', e.target.value as TextColor)}
                        >
                            <option value={TextColor.DEFAULT}>기본</option>
                            <option value={TextColor.BLACK}>검정</option>
                            <option value={TextColor.BLUE}>파랑</option>
                            <option value={TextColor.RED}>빨강</option>
                            <option value={TextColor.GREEN}>초록</option>
                        </FormSelect>
                    </FormGroup>
                </FormRow>

                <FormGroup>
                    <FormLabel>댓글 내용</FormLabel>
                    <FormTextarea
                        placeholder="댓글을 입력하세요..."
                        value={formData.content}
                        onChange={(e) => handleChange('content', e.target.value)}
                        $hasError={!!errors.content}
                        $fontFamily={formData.fontFamily}
                        $textColor={formData.textColor}
                    />
                    {errors.content && <ErrorMessage>{errors.content}</ErrorMessage>}
                </FormGroup>

                {formData.content && (
                    <FormGroup>
                        <FormLabel>미리보기</FormLabel>
                        <PreviewContainer
                            $fontFamily={formData.fontFamily}
                            $textColor={formData.textColor}
                        >
                            {formData.content}
                        </PreviewContainer>
                    </FormGroup>
                )}

                <ButtonGroup>
                    <SubmitButton
                        type="submit"
                        disabled={createCommentMutation.isPending}
                    >
                        {createCommentMutation.isPending ? '작성 중...' : '댓글 작성'}
                    </SubmitButton>
                </ButtonGroup>
            </form>
        </FormContainer>
    );
};