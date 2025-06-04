// TODO: 중복 코드 정리
import React, {useState} from 'react';
import styled from 'styled-components';
import {CreateCommentRequest, FontFamily, TextColor} from "../../../types/api.ts";
import {useCreateComment} from "../../../hooks/useApi.ts";
import {useLanguage} from "../../../context/LanguageContext.tsx";

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
    const {t} = useLanguage();

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
            newErrors.author = t('comment.form.validation.nicknameRequired' as any);
        }
        if (!formData.password.trim() || formData.password.length < 4) {
            newErrors.password = t('comment.form.validation.passwordTooShort' as any);
        }
        if (!formData.content.trim()) {
            newErrors.content = t('comment.form.validation.contentRequired' as any);
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
            <FormTitle>{t('comment.form.title' as any)}</FormTitle>

            <form onSubmit={handleSubmit}>
                <FormRow>
                    <FormGroup>
                        <FormLabel>{t('comment.form.fields.nickname' as any)}</FormLabel>
                        <FormInput
                            type="text"
                            placeholder={t('comment.form.placeholders.nickname' as any)}
                            value={formData.author}
                            onChange={(e) => handleChange('author', e.target.value)}
                            $hasError={!!errors.author}
                        />
                        {errors.author && <ErrorMessage>{errors.author}</ErrorMessage>}
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>{t('comment.form.fields.password' as any)}</FormLabel>
                        <FormInput
                            type="password"
                            placeholder={t('comment.form.placeholders.password' as any)}
                            value={formData.password}
                            onChange={(e) => handleChange('password', e.target.value)}
                            $hasError={!!errors.password}
                        />
                        {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
                    </FormGroup>
                </FormRow>

                <FormRow>
                    <FormGroup>
                        <FormLabel>{t('comment.form.fields.font' as any)}</FormLabel>
                        <FormSelect
                            value={formData.fontFamily}
                            onChange={(e) => handleChange('fontFamily', e.target.value as FontFamily)}
                        >
                            <option value={FontFamily.DEFAULT}>{t('comment.form.options.font.default' as any)}</option>
                            <option value={FontFamily.SERIF}>{t('comment.form.options.font.serif' as any)}</option>
                            <option
                                value={FontFamily.SANS_SERIF}>{t('comment.form.options.font.sansSerif' as any)}</option>
                            <option
                                value={FontFamily.MONOSPACE}>{t('comment.form.options.font.monospace' as any)}</option>
                        </FormSelect>
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>{t('comment.form.fields.textColor' as any)}</FormLabel>
                        <FormSelect
                            value={formData.textColor}
                            onChange={(e) => handleChange('textColor', e.target.value as TextColor)}
                        >
                            <option value={TextColor.DEFAULT}>{t('comment.form.options.color.default' as any)}</option>
                            <option value={TextColor.BLACK}>{t('comment.form.options.color.black' as any)}</option>
                            <option value={TextColor.BLUE}>{t('comment.form.options.color.blue' as any)}</option>
                            <option value={TextColor.RED}>{t('comment.form.options.color.red' as any)}</option>
                            <option value={TextColor.GREEN}>{t('comment.form.options.color.green' as any)}</option>
                        </FormSelect>
                    </FormGroup>
                </FormRow>

                <FormGroup>
                    <FormLabel>{t('comment.form.fields.content' as any)}</FormLabel>
                    <FormTextarea
                        placeholder={t('comment.form.placeholders.content' as any)}
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
                        <FormLabel>{t('comment.form.preview' as any)}</FormLabel>
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
                        {createCommentMutation.isPending
                            ? t('comment.form.submitting' as any)
                            : t('comment.form.submit' as any)
                        }
                    </SubmitButton>
                </ButtonGroup>
            </form>
        </FormContainer>
    );
};