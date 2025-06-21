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
  padding: ${({theme}) => theme.spacing.md};
  margin-bottom: ${({theme}) => theme.spacing.lg};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({theme}) => theme.spacing.sm};
  margin-bottom: ${({theme}) => theme.spacing.sm};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({theme}) => theme.spacing.xs};
  }
`;

const FormGroup = styled.div`
  position: relative;
`;

const FormInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: ${({theme}) => `${theme.spacing.sm} ${theme.spacing.sm}`};
  border: 2px solid ${({theme, $hasError}) =>
          $hasError ? theme.colors.error : `${theme.colors.primary}20`};
  border-radius: ${({theme}) => theme.borderRadius};
  background: ${({theme}) => theme.colors.background};
  color: ${({theme}) => theme.colors.text};
  font-size: ${({theme}) => theme.fontSizes.medium};
  transition: ${({theme}) => theme.transitions.default};

  &:focus {
    border-color: ${({theme}) => theme.colors.primary};
    outline: none;
    background: ${({theme}) => `${theme.colors.primary}05`};
  }

  &::placeholder {
    color: ${({theme}) => theme.colors.text}50;
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: ${({theme}) => `${theme.spacing.sm} ${theme.spacing.sm}`};
  border: 2px solid ${({theme}) => `${theme.colors.primary}20`};
  border-radius: ${({theme}) => theme.borderRadius};
  background: ${({theme}) => theme.colors.background};
  color: ${({theme}) => theme.colors.text};
  font-size: ${({theme}) => theme.fontSizes.medium};
  cursor: pointer;
  transition: ${({theme}) => theme.transitions.default};

  &:focus {
    border-color: ${({theme}) => theme.colors.primary};
    outline: none;
    background: ${({theme}) => `${theme.colors.primary}05`};
  }

  option:first-child {
    color: ${({theme}) => theme.colors.text}60;
  }
`;

const FormTextarea = styled.textarea<{ $hasError?: boolean; $fontFamily?: FontFamily; $textColor?: TextColor }>`
  width: 100%;
  min-height: 100px;
  padding: ${({theme}) => theme.spacing.sm};
  border: 2px solid ${({theme, $hasError}) =>
          $hasError ? theme.colors.error : `${theme.colors.primary}20`};
  border-radius: ${({theme}) => theme.borderRadius};
  background: ${({theme}) => theme.colors.background};
  resize: vertical;
  font-size: ${({theme}) => theme.fontSizes.medium};
  transition: ${({theme}) => theme.transitions.default};

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
    background: ${({theme}) => `${theme.colors.primary}05`};
  }

  &::placeholder {
    color: ${({theme}) => theme.colors.text}50;
  }
`;

const ErrorMessage = styled.span`
  color: ${({theme}) => theme.colors.error};
  font-size: ${({theme}) => theme.fontSizes.small};
  margin-top: 4px;
  display: block;
  position: absolute;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({theme}) => theme.spacing.sm};
  justify-content: flex-end;
  margin-top: ${({theme}) => theme.spacing.sm};
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
    transform: translateY(-1px);
  }

  &:disabled {
    background: ${({theme}) => theme.colors.text}40;
    cursor: not-allowed;
  }
`;

const PreviewContainer = styled.div<{ $fontFamily?: FontFamily; $textColor?: TextColor }>`
  background: ${({theme}) => `${theme.colors.primary}05`};
  border: 1px solid ${({theme}) => `${theme.colors.primary}15`};
  border-radius: ${({theme}) => theme.borderRadius};
  padding: ${({theme}) => theme.spacing.sm};
  margin-top: ${({theme}) => theme.spacing.xs};
  font-size: ${({theme}) => theme.fontSizes.small};

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

const PreviewLabel = styled.span`
  font-size: ${({theme}) => theme.fontSizes.small};
  color: ${({theme}) => theme.colors.text}60;
  margin-bottom: ${({theme}) => theme.spacing.xs};
  display: block;
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
            <form onSubmit={handleSubmit}>
                <FormRow>
                    <FormGroup>
                        <FormInput
                            type="text"
                            placeholder={t('comment.form.fields.nickname' as any) || "닉네임"}
                            value={formData.author}
                            onChange={(e) => handleChange('author', e.target.value)}
                            $hasError={!!errors.author}
                        />
                        {errors.author && <ErrorMessage>{errors.author}</ErrorMessage>}
                    </FormGroup>

                    <FormGroup>
                        <FormInput
                            type="password"
                            placeholder={t('comment.form.fields.password' as any) + " (4자 이상)" || "비밀번호 (4자 이상)"}
                            value={formData.password}
                            onChange={(e) => handleChange('password', e.target.value)}
                            $hasError={!!errors.password}
                        />
                        {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
                    </FormGroup>
                </FormRow>

                <FormRow>
                    <FormGroup>
                        <FormSelect
                            value={formData.fontFamily}
                            onChange={(e) => handleChange('fontFamily', e.target.value as FontFamily)}
                        >
                            <option
                                value={FontFamily.DEFAULT}>📝 {t('comment.form.options.font.default' as any) || "기본 글꼴"}</option>
                            <option
                                value={FontFamily.SERIF}>📖 {t('comment.form.options.font.serif' as any) || "명조체"}</option>
                            <option
                                value={FontFamily.SANS_SERIF}>📄 {t('comment.form.options.font.sansSerif' as any) || "고딕체"}</option>
                            <option
                                value={FontFamily.MONOSPACE}>💻 {t('comment.form.options.font.monospace' as any) || "고정폭"}</option>
                        </FormSelect>
                    </FormGroup>

                    <FormGroup>
                        <FormSelect
                            value={formData.textColor}
                            onChange={(e) => handleChange('textColor', e.target.value as TextColor)}
                        >
                            <option
                                value={TextColor.DEFAULT}>🎨 {t('comment.form.options.color.default' as any) || "기본 색상"}</option>
                            <option
                                value={TextColor.BLACK}>⚫ {t('comment.form.options.color.black' as any) || "검정"}</option>
                            <option
                                value={TextColor.BLUE}>🔵 {t('comment.form.options.color.blue' as any) || "파랑"}</option>
                            <option
                                value={TextColor.RED}>🔴 {t('comment.form.options.color.red' as any) || "빨강"}</option>
                            <option
                                value={TextColor.GREEN}>🟢 {t('comment.form.options.color.green' as any) || "초록"}</option>
                        </FormSelect>
                    </FormGroup>
                </FormRow>

                <FormGroup>
                    <FormTextarea
                        placeholder={t('comment.form.placeholders.content' as any) || "댓글을 입력해주세요..."}
                        value={formData.content}
                        onChange={(e) => handleChange('content', e.target.value)}
                        $hasError={!!errors.content}
                        $fontFamily={formData.fontFamily}
                        $textColor={formData.textColor}
                    />
                    {errors.content && <ErrorMessage>{errors.content}</ErrorMessage>}
                </FormGroup>

                {formData.content && (
                    <div>
                        <PreviewLabel>✨ {t('comment.form.preview' as any) || "미리보기"}</PreviewLabel>
                        <PreviewContainer
                            $fontFamily={formData.fontFamily}
                            $textColor={formData.textColor}
                        >
                            {formData.content}
                        </PreviewContainer>
                    </div>
                )}

                <ButtonGroup>
                    <SubmitButton
                        type="submit"
                        disabled={createCommentMutation.isPending}
                    >
                        {createCommentMutation.isPending
                            ? t('comment.form.submitting' as any) || "작성 중..."
                            : t('comment.form.submit' as any) || "댓글 작성"
                        }
                    </SubmitButton>
                </ButtonGroup>
            </form>
        </FormContainer>
    );
};