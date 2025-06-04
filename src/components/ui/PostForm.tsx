import React, {useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import {useLanguage} from '../../context/LanguageContext';

interface PostFormProps {
    category: string;
    initialData?: {
        title: string;
        content: string;
        tags: string[];
    };
    onSubmit: (formData: any) => void;
    onCancel: () => void;
}

interface ImageFile {
    id: string;
    file: File;
    preview: string;
    placeholder: string;
}

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({theme}) => theme.spacing.md};
`;

const FormField = styled.div`
  margin-bottom: ${({theme}) => theme.spacing.md};
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: ${({theme}) => theme.spacing.xs};
  font-weight: bold;
  color: ${({theme}) => theme.colors.text};
`;

const FormInput = styled.input`
  width: 100%;
  padding: ${({theme}) => theme.spacing.sm};
  border: 2px solid ${({theme}) => `${theme.colors.primary}30`};
  border-radius: ${({theme}) => theme.borderRadius};
  background-color: ${({theme}) => theme.colors.background};
  color: ${({theme}) => theme.colors.text};

  &:focus {
    border-color: ${({theme}) => theme.colors.primary};
    outline: none;
  }
`;

const TextareaContainer = styled.div`
  position: relative;
`;

const FormTextarea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: ${({theme}) => theme.spacing.sm};
  border: 2px solid ${({theme}) => `${theme.colors.primary}30`};
  border-radius: ${({theme}) => theme.borderRadius};
  background-color: ${({theme}) => theme.colors.background};
  color: ${({theme}) => theme.colors.text};
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;

  &:focus {
    border-color: ${({theme}) => theme.colors.primary};
    outline: none;
  }
`;

const ImageToolbar = styled.div`
  display: flex;
  gap: ${({theme}) => theme.spacing.sm};
  margin-bottom: ${({theme}) => theme.spacing.sm};
  padding: ${({theme}) => theme.spacing.sm};
  background: ${({theme}) => `${theme.colors.primary}10`};
  border-radius: ${({theme}) => theme.borderRadius};
  border: 1px solid ${({theme}) => `${theme.colors.primary}20`};
`;

const ToolbarButton = styled.button`
  padding: ${({theme}) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  background: ${({theme}) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({theme}) => theme.borderRadius};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ImagePreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({theme}) => theme.spacing.sm};
  margin-top: ${({theme}) => theme.spacing.sm};
  padding: ${({theme}) => theme.spacing.sm};
  background: ${({theme}) => `${theme.colors.background}F5`};
  border-radius: ${({theme}) => theme.borderRadius};
  border: 1px dashed ${({theme}) => `${theme.colors.primary}30`};
`;

const ImagePreviewItem = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({theme}) => theme.spacing.xs};
  padding: ${({theme}) => theme.spacing.sm};
  background: white;
  border-radius: ${({theme}) => theme.borderRadius};
  border: 1px solid ${({theme}) => `${theme.colors.primary}20`};
  max-width: 150px;
`;

const PreviewImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
`;

const ImageInfo = styled.div`
  text-align: center;
  font-size: 11px;
  color: ${({theme}) => `${theme.colors.text}CC`};
  word-break: break-all;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${({theme}) => theme.colors.error};
  color: white;
  border: none;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.8;
  }
`;

const PlaceholderCode = styled.code`
  background: ${({theme}) => `${theme.colors.secondary}20`};
  color: ${({theme}) => theme.colors.secondary};
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 10px;
`;

const PreviewContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({theme}) => theme.spacing.md};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PreviewPanel = styled.div`
  border: 2px solid ${({theme}) => `${theme.colors.primary}30`};
  border-radius: ${({theme}) => theme.borderRadius};
  padding: ${({theme}) => theme.spacing.sm};
  background: ${({theme}) => theme.colors.background};
  min-height: 200px;

  h1, h2, h3, h4, h5, h6 {
    color: ${({theme}) => theme.colors.primary};
    margin-top: 1em;
    margin-bottom: 0.5em;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    margin: 10px 0;
  }

  code {
    background: ${({theme}) => `${theme.colors.primary}15`};
    padding: 2px 4px;
    border-radius: 3px;
    font-family: 'Monaco', 'Menlo', monospace;
  }

  blockquote {
    border-left: 4px solid ${({theme}) => theme.colors.primary};
    padding-left: 16px;
    margin: 16px 0;
    color: ${({theme}) => `${theme.colors.text}CC`};
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({theme}) => theme.spacing.xs};
  margin-top: ${({theme}) => theme.spacing.xs};
`;

const Tag = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: ${({theme}) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  background-color: ${({theme}) => `${theme.colors.primary}20`};
  color: ${({theme}) => theme.colors.primary};
  border-radius: ${({theme}) => theme.borderRadius};
  font-size: ${({theme}) => theme.fontSizes.small};
`;

const RemoveTagButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({theme}) => theme.colors.primary};
  font-size: 0.8rem;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FormHint = styled.p`
  font-size: ${({theme}) => theme.fontSizes.small};
  color: ${({theme}) => theme.colors.text}80;
  margin-top: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({theme}) => theme.spacing.md};
  margin-top: ${({theme}) => theme.spacing.md};
`;

const SubmitButton = styled.button`
  padding: ${({theme}) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  background-color: ${({theme}) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({theme}) => theme.borderRadius};
  font-weight: bold;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const CancelButton = styled.button`
  padding: ${({theme}) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  background: none;
  color: ${({theme}) => theme.colors.text};
  border: 1px solid ${({theme}) => theme.colors.text}40;
  border-radius: ${({theme}) => theme.borderRadius};
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: ${({theme}) => theme.colors.text}10;
  }
`;

const NewCategoryNotice = styled.div`
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 15px;
  border: 1px solid #e9ecef;
`;

const PostForm: React.FC<PostFormProps> = ({category, initialData, onSubmit, onCancel}) => {
    const {t} = useLanguage();

    const [formData, setFormData] = useState({
        title: '',
        summary: '',
        content: '',
        currentTag: '',
        tags: [] as string[]
    });

    const [errors, setErrors] = useState({
        title: '',
        summary: '',
        content: ''
    });

    const [showPreview, setShowPreview] = useState(false);
    const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const formatMessage = (key: string, params: Record<string, any> = {}): string => {
        let message = t(key as any);
        Object.entries(params).forEach(([param, value]) => {
            message = message.replace(`{${param}}`, String(value));
        });
        return message;
    };

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                title: initialData.title,
                content: initialData.content,
                tags: initialData.tags || []
            }));
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));

        if (name in errors && value.trim()) {
            setErrors(prev => ({...prev, [name]: ''}));
        }
    };

    // 이미지 파일 추가
    const handleImageAdd = (file: File) => {
        const imageId = `img_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
        const placeholder = `{{IMAGE:${imageId}}}`;

        const newImageFile: ImageFile = {
            id: imageId,
            file,
            preview: URL.createObjectURL(file),
            placeholder
        };

        setImageFiles(prev => [...prev, newImageFile]);

        const markdownImage = `![${file.name}](${placeholder})`;
        insertTextAtCursor(markdownImage);
    };

    // 커서 위치에 텍스트 삽입
    const insertTextAtCursor = (text: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;

        const newValue = value.substring(0, start) + text + value.substring(end);

        setFormData(prev => ({
            ...prev,
            content: newValue
        }));

        setTimeout(() => {
            if (textarea) {
                textarea.focus();
                textarea.setSelectionRange(start + text.length, start + text.length);
            }
        }, 0);
    };

    // 파일 선택 핸들러
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach(file => {
                if (file.type.startsWith('image/')) {
                    handleImageAdd(file);
                } else {
                    alert(t('post.form.imageSection.onlyImages' as any));
                }
            });
        }
        // 파일 입력 값 초기화 (같은 파일 다시 선택 가능하게)
        if (fileInputRef.current) {
            fileInputRef.current!.value = '';
        }
    };

    // 이미지 제거
    const handleRemoveImage = (imageId: string) => {
        const imageToRemove = imageFiles.find(img => img.id === imageId);
        if (imageToRemove) {
            // 마크다운에서 해당 이미지 참조 제거
            const escapedPlaceholder = imageToRemove.placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const updatedContent = formData.content.replace(
                new RegExp(`!\\[.*?\\]\\(${escapedPlaceholder}\\)`, 'g'),
                ''
            );

            setFormData(prev => ({
                ...prev,
                content: updatedContent
            }));

            // 이미지 파일 목록에서 제거
            setImageFiles(prev => prev.filter(img => img.id !== imageId));

            // 미리보기 URL 해제
            URL.revokeObjectURL(imageToRemove.preview);
        }
    };

    // 이미지 URL 삽입
    const handleInsertImageUrl = () => {
        const url = prompt(t('post.form.imageSection.urlPrompt' as any));
        if (url) {
            const altText = prompt(t('post.form.imageSection.altPrompt' as any)) || 'image';
            const markdownImage = `![${altText}](${url})`;
            insertTextAtCursor(markdownImage);
        }
    };

    // 마크다운 렌더링 (플레이스홀더를 실제 이미지로 변환)
    const renderMarkdown = (content: string) => {
        let renderedContent = content;

        // 플레이스홀더를 실제 이미지 URL로 교체
        imageFiles.forEach(imageFile => {
            const escapedPlaceholder = imageFile.placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            renderedContent = renderedContent.replace(
                new RegExp(escapedPlaceholder, 'g'),
                imageFile.preview
            );
        });

        return renderedContent
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
            .replace(/\n/g, '<br />');
    };

    const handleAddTag = () => {
        if (formData.currentTag.trim()) {
            const newTag = formData.currentTag.trim().toLowerCase();
            if (!formData.tags.includes(newTag)) {
                setFormData(prev => ({
                    ...prev,
                    tags: [...prev.tags, newTag],
                    currentTag: ''
                }));
            }
        }
    };

    const handleTagKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const validateForm = () => {
        const newErrors = {
            title: formData.title.trim() ? '' : t('post.form.validation.titleRequired' as any),
            summary: category !== 'stamps' && formData.summary.trim() ? '' : (category !== 'stamps' ? t('post.form.validation.summaryRequired' as any) : ''),
            content: formData.content.trim() ? '' : t('post.form.validation.contentRequired' as any)
        };

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            // 폼 데이터와 이미지 파일들을 함께 전달
            onSubmit({
                title: formData.title,
                summary: formData.summary,
                content: formData.content,
                tags: formData.tags,
                imageFiles: imageFiles // 이미지 파일들 포함
            });
        }
    };

    const getContentField = () => (
        <FormField>
            <FormLabel htmlFor="content">
                {category === 'food' ? t('post.form.fields.menuRecommendation' as any) :
                    category === 'stamps' ? t('post.form.fields.message' as any) : t('post.form.fields.content' as any)}
            </FormLabel>

            <ImageToolbar>
                <ToolbarButton
                    type="button"
                    onClick={() => fileInputRef.current!.click()}
                >
                    {t('post.form.toolbar.addImage' as any)}
                </ToolbarButton>

                <ToolbarButton
                    type="button"
                    onClick={handleInsertImageUrl}
                >
                    {t('post.form.toolbar.imageUrl' as any)}
                </ToolbarButton>

                <ToolbarButton
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                >
                    {showPreview ? t('post.form.toolbar.edit' as any) : t('post.form.toolbar.preview' as any)}
                </ToolbarButton>
            </ImageToolbar>

            <HiddenFileInput
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
            />

            {/* 추가된 이미지 파일들 미리보기 */}
            {imageFiles.length > 0 && (
                <ImagePreviewContainer>
                    <div style={{width: '100%', marginBottom: '8px', fontSize: '12px', fontWeight: 'bold'}}>
                        {formatMessage('post.form.imageSection.attached', {count: imageFiles.length})}
                    </div>
                    {imageFiles.map(imageFile => (
                        <ImagePreviewItem key={imageFile.id}>
                            <RemoveImageButton onClick={() => handleRemoveImage(imageFile.id)}>
                                ×
                            </RemoveImageButton>
                            <PreviewImage src={imageFile.preview} alt={imageFile.file.name}/>
                            <ImageInfo>
                                <div>{imageFile.file.name}</div>
                                <div>{(imageFile.file.size / 1024).toFixed(1)}KB</div>
                                <PlaceholderCode>{imageFile.placeholder}</PlaceholderCode>
                            </ImageInfo>
                        </ImagePreviewItem>
                    ))}
                </ImagePreviewContainer>
            )}

            {showPreview ? (
                <PreviewContainer>
                    <TextareaContainer>
                        <FormTextarea
                            ref={textareaRef}
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder={
                                category === 'food' ? t('post.form.placeholders.food.content' as any) :
                                    category === 'stamps' ? t('post.form.placeholders.stamps.content' as any) :
                                        t('post.form.placeholders.default.content' as any)
                            }
                        />
                    </TextareaContainer>

                    <PreviewPanel>
                        <div dangerouslySetInnerHTML={{
                            __html: renderMarkdown(formData.content || t('post.form.imageSection.previewText' as any))
                        }}/>
                    </PreviewPanel>
                </PreviewContainer>
            ) : (
                <FormTextarea
                    ref={textareaRef}
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder={
                        category === 'food' ? t('post.form.placeholders.food.content' as any) :
                            category === 'stamps' ? t('post.form.placeholders.stamps.content' as any) :
                                t('post.form.placeholders.default.content' as any)
                    }
                />
            )}

            {errors.content && <FormHint style={{color: 'red'}}>{errors.content}</FormHint>}
        </FormField>
    );

    const getFormFields = () => {
        switch (category) {
            case 'tech':
                return (
                    <>
                        <FormField>
                            <FormLabel htmlFor="title">{t('post.form.fields.title' as any)}</FormLabel>
                            <FormInput
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder={t('post.form.placeholders.tech.title' as any)}
                            />
                            {errors.title && <FormHint style={{color: 'red'}}>{errors.title}</FormHint>}
                        </FormField>

                        <FormField>
                            <FormLabel htmlFor="summary">{t('post.form.fields.summary' as any)}</FormLabel>
                            <FormInput
                                id="summary"
                                name="summary"
                                value={formData.summary}
                                onChange={handleChange}
                                placeholder={t('post.form.placeholders.tech.summary' as any)}
                            />
                            {errors.summary && <FormHint style={{color: 'red'}}>{errors.summary}</FormHint>}
                        </FormField>

                        {getContentField()}

                        <FormField>
                            <FormLabel htmlFor="tags">{t('post.form.fields.tags' as any)}</FormLabel>
                            <FormInput
                                id="currentTag"
                                name="currentTag"
                                value={formData.currentTag}
                                onChange={handleChange}
                                onKeyDown={handleTagKeyDown}
                                placeholder={t('post.form.tags.placeholder' as any)}
                            />
                            <FormHint>{t('post.form.tags.hint' as any)}</FormHint>

                            {formData.tags.length > 0 && (
                                <TagsContainer>
                                    {formData.tags.map(tag => (
                                        <Tag key={tag}>
                                            {tag}
                                            <RemoveTagButton onClick={() => handleRemoveTag(tag)}>×</RemoveTagButton>
                                        </Tag>
                                    ))}
                                </TagsContainer>
                            )}
                        </FormField>
                    </>
                );

            case 'food':
                return (
                    <>
                        <FormField>
                            <FormLabel htmlFor="title">{t('post.form.fields.place' as any)}</FormLabel>
                            <FormInput
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder={t('post.form.placeholders.food.title' as any)}
                            />
                            {errors.title && <FormHint style={{color: 'red'}}>{errors.title}</FormHint>}
                        </FormField>

                        <FormField>
                            <FormLabel htmlFor="summary">{t('post.form.fields.intro' as any)}</FormLabel>
                            <FormInput
                                id="summary"
                                name="summary"
                                value={formData.summary}
                                onChange={handleChange}
                                placeholder={t('post.form.placeholders.food.summary' as any)}
                            />
                            {errors.summary && <FormHint style={{color: 'red'}}>{errors.summary}</FormHint>}
                        </FormField>

                        {getContentField()}

                        <FormField>
                            <FormLabel htmlFor="tags">{t('post.form.fields.tags' as any)}</FormLabel>
                            <FormInput
                                id="currentTag"
                                name="currentTag"
                                value={formData.currentTag}
                                onChange={handleChange}
                                onKeyDown={handleTagKeyDown}
                                placeholder={t('post.form.placeholders.food.tags' as any)}
                            />

                            {formData.tags.length > 0 && (
                                <TagsContainer>
                                    {formData.tags.map(tag => (
                                        <Tag key={tag}>
                                            {tag}
                                            <RemoveTagButton onClick={() => handleRemoveTag(tag)}>×</RemoveTagButton>
                                        </Tag>
                                    ))}
                                </TagsContainer>
                            )}
                        </FormField>
                    </>
                );

            case 'stamps':
                return (
                    <>
                        <FormField>
                            <FormLabel htmlFor="title">{t('post.form.fields.name' as any)}</FormLabel>
                            <FormInput
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder={t('post.form.placeholders.stamps.title' as any)}
                            />
                            {errors.title && <FormHint style={{color: 'red'}}>{errors.title}</FormHint>}
                        </FormField>

                        {getContentField()}
                    </>
                );

            default:
                return (
                    <>
                        <NewCategoryNotice>
                            <p>📝 {formatMessage('post.form.newCategory', {category})}</p>
                        </NewCategoryNotice>

                        <FormField>
                            <FormLabel htmlFor="title">{t('post.form.fields.title' as any)}</FormLabel>
                            <FormInput
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder={t('post.form.placeholders.default.title' as any)}
                            />
                            {errors.title && <FormHint style={{color: 'red'}}>{errors.title}</FormHint>}
                        </FormField>

                        {getContentField()}
                    </>
                );
        }
    };

    return (
        <FormContainer>
            <form onSubmit={handleSubmit}>
                {getFormFields()}

                <ButtonGroup>
                    <CancelButton type="button" onClick={onCancel}>
                        {t('post.form.buttons.cancel' as any)}
                    </CancelButton>
                    <SubmitButton type="submit">
                        {initialData ? t('post.form.buttons.update' as any) : t('post.form.buttons.submit' as any)}
                    </SubmitButton>
                </ButtonGroup>
            </form>
        </FormContainer>
    );
};

export default PostForm;