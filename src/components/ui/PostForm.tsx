import React, {useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import {useLanguage} from '../../context/LanguageContext';
import {renderMarkdown} from "../../utils/markdoown.ts";

interface PostFormProps {
    category: string | null;
    initialData?: {
        title: string;
        titleEn?: string;
        subtitle?: string;
        subtitleEn?: string;
        content: string;
        contentEn?: string;
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
  height: 100%;
`;

const FormTextarea = styled.textarea`
  width: 100%;
  height: 100%;
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
  box-sizing: border-box;

  &:focus {
    border-color: ${({theme}) => theme.colors.primary};
    outline: none;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1px;
  background: ${({theme}) => `${theme.colors.primary}20`};
  padding: 1px;
  border-radius: 8px 8px 0 0;
  margin-bottom: -1px;
`;

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 12px 24px;
  background: ${({theme, $active}) =>
          $active ? theme.colors.background : theme.colors.secondaryBackground};
  border: none;
  cursor: pointer;
  font-weight: ${({$active}) => $active ? '600' : '400'};
  color: ${({theme, $active}) =>
          $active ? theme.colors.primary : `${theme.colors.text}80`};
  transition: all 0.2s;

  &:first-child {
    border-radius: 7px 0 0 0;
  }

  &:last-child {
    border-radius: 0 7px 0 0;
  }

  &:hover {
    background: ${({theme}) => theme.colors.background};
  }
`;

const TabContent = styled.div`
  background: ${({theme}) => theme.colors.background};
  padding: 24px;
  border: 2px solid ${({theme}) => `${theme.colors.primary}30`};
  border-radius: 0 0 8px 8px;
  margin-bottom: ${({theme}) => theme.spacing.md};
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

// 미리보기 관련 스타일
const PreviewContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({theme}) => theme.spacing.md};
  align-items: stretch;

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
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
  word-wrap: break-word;

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


  table {
    border-collapse: collapse;
    width: 100%;
    margin: 16px 0;
  }

  table th,
  table td {
    border: 1px solid ${({theme}) => `${theme.colors.primary}30`};
    padding: 8px 12px;
    text-align: left;
  }

  table th {
    background-color: ${({theme}) => `${theme.colors.primary}10`};
    font-weight: bold;
  }

  table tr:nth-child(even) {
    background-color: ${({theme}) => `${theme.colors.background}F5`};
  }

  pre {
    background-color: ${({theme}) => theme.colors.secondaryBackground};
    padding: ${({theme}) => theme.spacing.md};
    border-radius: ${({theme}) => theme.borderRadius};
    overflow-x: auto;
    margin: ${({theme}) => theme.spacing.md} 0;
    border: 1px solid ${({theme}) => `${theme.colors.primary}20`};

    code {
      background-color: transparent;
      padding: 0;
      border: none;
      color: ${({theme}) => theme.colors.text};
    }
  }

  hr {
    border: none;
    border-top: 2px solid ${({theme}) => `${theme.colors.primary}20`};
    margin: ${({theme}) => theme.spacing.xl} 0;
    opacity: 0.5;
  }

  p {
    margin-bottom: ${({theme}) => theme.spacing.md};
  }

  ul, ol {
    margin-bottom: ${({theme}) => theme.spacing.md};
    padding-left: ${({theme}) => theme.spacing.lg};
  }

  li {
    margin-bottom: ${({theme}) => theme.spacing.xs};
    line-height: 1.6;
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
  color: ${({theme}) => `${theme.colors.text}80`};
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
  border: 1px solid ${({theme}) => `${theme.colors.text}40`};
  border-radius: ${({theme}) => theme.borderRadius};
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: ${({theme}) => `${theme.colors.text}10`};
  }
`;

const LanguageIndicator = styled.span`
  font-size: 0.8em;
  opacity: 0.7;
  margin-left: 4px;
`;

const PostForm: React.FC<PostFormProps> = ({category, initialData, onSubmit, onCancel}) => {
    const {t} = useLanguage();
    const [activeTab, setActiveTab] = useState<'ko' | 'en'>('ko');

    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        content: '',
        titleEn: '',
        subtitleEn: '',
        contentEn: '',
        currentTag: '',
        tags: [] as string[]
    });

    const [errors, setErrors] = useState({
        title: '',
        subtitle: '',
        content: ''
    });

    const [showPreview, setShowPreview] = useState(false);
    const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const textareaRefKo = useRef<HTMLTextAreaElement | null>(null);
    const textareaRefEn = useRef<HTMLTextAreaElement | null>(null);

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
                titleEn: initialData.titleEn || '',
                subtitle: initialData.subtitle || '',
                subtitleEn: initialData.subtitleEn || '',
                content: initialData.content,
                contentEn: initialData.contentEn || '',
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

    const insertTextAtCursor = (text: string) => {
        const textarea = activeTab === 'ko' ? textareaRefKo.current : textareaRefEn.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;
        const fieldName = activeTab === 'ko' ? 'content' : 'contentEn';

        const newValue = value.substring(0, start) + text + value.substring(end);

        setFormData(prev => ({
            ...prev,
            [fieldName]: newValue
        }));

        setTimeout(() => {
            if (textarea) {
                textarea.focus();
                textarea.setSelectionRange(start + text.length, start + text.length);
            }
        }, 0);
    };

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
        if (fileInputRef.current) {
            fileInputRef.current!.value = '';
        }
    };

    const handleRemoveImage = (imageId: string) => {
        const imageToRemove = imageFiles.find(img => img.id === imageId);
        if (imageToRemove) {
            const escapedPlaceholder = imageToRemove.placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            setFormData(prev => ({
                ...prev,
                content: prev.content.replace(
                    new RegExp(`!\\[.*?\\]\\(${escapedPlaceholder}\\)`, 'g'),
                    ''
                ),
                contentEn: prev.contentEn.replace(
                    new RegExp(`!\\[.*?\\]\\(${escapedPlaceholder}\\)`, 'g'),
                    ''
                )
            }));

            setImageFiles(prev => prev.filter(img => img.id !== imageId));
            URL.revokeObjectURL(imageToRemove.preview);
        }
    };

    const handleInsertImageUrl = () => {
        const url = prompt(activeTab === 'ko'
            ? t('post.form.imageSection.urlPrompt' as any)
            : 'Enter image URL:'
        );
        if (url) {
            const altText = prompt(activeTab === 'ko'
                ? t('post.form.imageSection.altPrompt' as any)
                : 'Enter alt text (optional):'
            ) || 'image';
            const markdownImage = `![${altText}](${url})`;
            insertTextAtCursor(markdownImage);
        }
    };

    const renderMarkdownWithImages = (content: string) => {
        let contentWithImages = content;
        imageFiles.forEach(imageFile => {
            const escapedPlaceholder = imageFile.placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            contentWithImages = contentWithImages.replace(
                new RegExp(escapedPlaceholder, 'g'),
                imageFile.preview
            );
        });

        return renderMarkdown(contentWithImages);
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
            subtitle: category !== 'stamps' && !formData.subtitle?.trim()
                ? t('post.form.validation.subtitleRequired' as any)
                : '',
            content: formData.content.trim() ? '' : t('post.form.validation.contentRequired' as any)
        };

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);

        if (validateForm()) {
            onSubmit({
                title: formData.title,
                subtitle: formData.subtitle,
                content: formData.content,
                titleEn: formData.titleEn,
                subtitleEn: formData.subtitleEn,
                contentEn: formData.contentEn,
                tags: formData.tags,
                // imageFiles: imageFiles
            });
        }
    };

    const renderLanguageFields = (lang: 'ko' | 'en') => {
        const isKorean = lang === 'ko';
        const titleField = isKorean ? 'title' : 'titleEn';
        const subtitleField = isKorean ? 'subtitle' : 'subtitleEn';
        const contentField = isKorean ? 'content' : 'contentEn';
        const textareaRef = isKorean ? textareaRefKo : textareaRefEn;

        return (
            <>
                <FormField>
                    <FormLabel htmlFor={titleField}>
                        {isKorean ? t('post.form.fields.title' as any) : 'Title'}
                        {!isKorean && <LanguageIndicator>(Optional)</LanguageIndicator>}
                    </FormLabel>
                    <FormInput
                        id={titleField}
                        name={titleField}
                        value={formData[titleField as keyof typeof formData] as string}
                        onChange={handleChange}
                        placeholder={
                            isKorean
                                ? t('post.form.placeholders.blog.title' as any)
                                : 'Enter title in English (optional)'
                        }
                    />
                    {isKorean && errors.title && (
                        <FormHint style={{color: 'red'}}>{errors.title}</FormHint>
                    )}
                </FormField>

                {category !== 'stamps' && (
                    <FormField>
                        <FormLabel htmlFor={subtitleField}>
                            {isKorean ? t('post.form.fields.subtitle' as any) : 'Subtitle'}
                            {!isKorean && <LanguageIndicator>(Optional)</LanguageIndicator>}
                        </FormLabel>
                        <FormInput
                            id={subtitleField}
                            name={subtitleField}
                            value={formData[subtitleField as keyof typeof formData] as string}
                            onChange={handleChange}
                            placeholder={
                                isKorean
                                    ? t('post.form.placeholders.blog.subtitle' as any)
                                    : 'Enter subtitle in English (optional)'
                            }
                        />
                        {isKorean && errors.subtitle && (
                            <FormHint style={{color: 'red'}}>{errors.subtitle}</FormHint>
                        )}
                    </FormField>
                )}

                <FormField>
                    <FormLabel htmlFor={contentField}>
                        {isKorean ? t('post.form.fields.content' as any) : 'Content'}
                        {!isKorean && <LanguageIndicator>(Optional)</LanguageIndicator>}
                    </FormLabel>

                    <ImageToolbar>
                        <ToolbarButton
                            type="button"
                            onClick={() => fileInputRef.current!.click()}
                        >
                            {isKorean ? t('post.form.toolbar.addImage' as any) : 'Add Image'}
                        </ToolbarButton>

                        <ToolbarButton
                            type="button"
                            onClick={handleInsertImageUrl}
                        >
                            {isKorean ? t('post.form.toolbar.imageUrl' as any) : 'Image URL'}
                        </ToolbarButton>

                        <ToolbarButton
                            type="button"
                            onClick={() => setShowPreview(!showPreview)}
                        >
                            {showPreview
                                ? (isKorean ? t('post.form.toolbar.edit' as any) : 'Edit')
                                : (isKorean ? t('post.form.toolbar.preview' as any) : 'Preview')
                            }
                        </ToolbarButton>
                    </ImageToolbar>

                    {showPreview ? (
                        <PreviewContainer>
                            <TextareaContainer>
                                <FormTextarea
                                    ref={textareaRef}
                                    id={contentField}
                                    name={contentField}
                                    value={formData[contentField as keyof typeof formData] as string}
                                    onChange={handleChange}
                                    placeholder={
                                        isKorean
                                            ? t('post.form.placeholders.default.content' as any)
                                            : 'Enter content in English (optional)'
                                    }
                                />
                            </TextareaContainer>

                            <PreviewPanel>
                                <div dangerouslySetInnerHTML={{
                                    __html: renderMarkdownWithImages(
                                        (formData[contentField as keyof typeof formData] as string) ||
                                        (isKorean ? '미리보기' : 'Preview')
                                    )
                                }}/>
                            </PreviewPanel>
                        </PreviewContainer>
                    ) : (
                        <FormTextarea
                            ref={textareaRef}
                            id={contentField}
                            name={contentField}
                            value={formData[contentField as keyof typeof formData] as string}
                            onChange={handleChange}
                            placeholder={
                                isKorean
                                    ? t('post.form.placeholders.default.content' as any)
                                    : 'Enter content in English (optional)'
                            }
                        />
                    )}

                    {isKorean && errors.content && (
                        <FormHint style={{color: 'red'}}>{errors.content}</FormHint>
                    )}
                </FormField>
            </>
        );
    };

    return (
        <FormContainer>
            <form onSubmit={handleSubmit}>
                <TabContainer>
                    <Tab
                        type="button"
                        $active={activeTab === 'ko'}
                        onClick={() => setActiveTab('ko')}
                    >
                        한국어
                    </Tab>
                    <Tab
                        type="button"
                        $active={activeTab === 'en'}
                        onClick={() => setActiveTab('en')}
                    >
                        English
                    </Tab>
                </TabContainer>

                <TabContent>
                    {renderLanguageFields(activeTab)}
                </TabContent>

                <HiddenFileInput
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                />

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

                {category !== 'stamps' && (
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
                )}

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