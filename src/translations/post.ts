export const postTranslations = {
    en: {
        post: {
            list: {
                title: {
                    search: "Search Results",
                    searchWithQuery: "Search: \"{query}\"",
                    searchWithCategory: "Search: \"{query}\" in {category}",
                    tag: "Tag: #{tag}",
                    uncategorized: "Uncategorized"
                },
                count: "Total {count} posts",
                createButton: "✍️ Write Post",
                creating: "Creating...",
                filters: {
                    tagFilter: "Filter by tags:",
                    searchResults: "Search Results for: \"{query}\"",
                    categoryFilter: "in category: {category}",
                    sortBy: "Sort by:"
                },
                noResults: {
                    search: "No posts found for \"{query}\"{category}",
                    searchTip: "Try searching with different keywords or browse all categories.",
                    filtered: "No posts match your current filters",
                    empty: "No posts found"
                },
                loading: "Loading {title} content...",
                loadingSubtext: "Please wait while we retrieve the posts.",
                error: "Error Loading Posts",
                tryAgain: "Try Again",
                noData: "No Posts Available",
                noDataDetail: "Could not load posts for {title}"
            },
            detail: {
                backTo: "{category} list",
                backToHome: "Back to Home",
                backToList: "Back to {category} list",
                meta: {
                    views: "{count} views",
                    category: "Category",
                    uncategorized: "Uncategorized"
                },
                actions: {
                    share: "📤 Share",
                    shareText: "Was this article helpful?",
                    edit: "✏️ Edit",
                    delete: "🗑️ Delete"
                },
                resourceLinks: "API Resource Links",
                loading: "📖 Loading post...",
                notFound: "Post Not Found",
                notFoundDetail: "The requested post does not exist or has been deleted.",
                errors: {
                    invalidUrl: "Invalid Post URL",
                    noSlug: "Post slug not found."
                },
                shareSuccess: "Link copied to clipboard!"
            },
            form: {
                titles: {
                    create: "Create New {category} Post",
                    edit: "Edit Post"
                },
                fields: {
                    title: "Title",
                    subtitle: "subtitle",
                    content: "Content",
                    tags: "Tags",
                    place: "Place",
                    intro: "Introduction",
                    name: "Name",
                    menuRecommendation: "Menu Recommendation & Description",
                    message: "Message",
                    thumbnail: "Thumbnail Image"
                },
                placeholders: {
                    tech: {
                        title: "Enter the title of your tech article",
                        subtitle: "Enter a brief subtitle of the article",
                        content: "# Write your content in Markdown format"
                    },
                    food: {
                        title: "Enter the place name",
                        subtitle: "Enter a subtitle about the restaurant",
                        content: "# Write menu recommendations and descriptions in Markdown format",
                        tags: "Enter tags and press Enter (e.g., Korean, Pasta, Snacks)"
                    },
                    stamps: {
                        title: "Enter your name",
                        content: "Enter a message for the guestbook"
                    },
                    default: {
                        title: "Enter the title",
                        content: "# Write your content in Markdown format"
                    }
                },
                toolbar: {
                    addImage: "📷 Add Image",
                    imageUrl: "🔗 Image URL",
                    preview: "👁️ Preview",
                    edit: "✏️ Edit"
                },
                imageSection: {
                    attached: "Attached Images ({count})",
                    urlPrompt: "Enter image URL:",
                    altPrompt: "Enter image description (optional):",
                    onlyImages: "Only image files can be uploaded.",
                    previewText: "Preview will appear here..."
                },
                thumbnail: {
                    upload: "Click to upload thumbnail",
                    change: "Change image",
                    hint: "Recommended size: 1200x630px, Max 5MB",
                    remove: "Remove thumbnail"
                },
                tags: {
                    hint: "Press Enter to add tags",
                    placeholder: "Enter tags and press Enter"
                },
                buttons: {
                    cancel: "Cancel",
                    submit: "Submit",
                    update: "Update"
                },
                validation: {
                    titleRequired: "Please enter a title",
                    subtitleRequired: "Please enter a subtitle",
                    contentRequired: "Please enter content",
                    thumbnailSizeError: "Thumbnail file size must be less than 5MB",
                    thumbnailTypeError: "Only image files (JPG, PNG, WebP) are allowed"
                },
                success: {
                    created: "Post has been created!",
                    updated: "Post has been updated!"
                },
                errors: {
                    createFailed: "Failed to create post: {error}",
                    updateFailed: "Failed to update post: {error}",
                    deleteFailed: "Failed to delete post: {error}",
                    noPostId: "Post ID not found.",
                    formSubmission: "Form submission failed",
                    loginFailed: "Login failed",
                    thumbnailUploadFailed: "Failed to upload thumbnail"
                },
                newCategory: "\"{category}\" New Category"
            },
            delete: {
                title: "🗑️ Delete Post",
                targetPost: "Post to delete:",
                warning: "⚠️ This action cannot be undone. Are you sure you want to delete?",
                confirm: "Delete",
                deleting: "Deleting...",
                cancel: "Cancel"
            },
            auth: {
                required: "Authentication required to {action} {category} posts.",
                actions: {
                    create: "create",
                    edit: "edit",
                    delete: "delete"
                }
            },
            categories: {
                tech: "Tech",
                food: "Food",
                uncategorized: "Uncategorized"
            }
        }
    },
    ko: {
        post: {
            list: {
                title: {
                    search: "검색 결과",
                    searchWithQuery: "검색: \"{query}\"",
                    searchWithCategory: "검색: \"{query}\" in {category}",
                    tag: "태그: #{tag}",
                    uncategorized: "미분류"
                },
                count: "총 {count}개의 포스트",
                createButton: "✍️ 글 작성하기",
                creating: "작성 중...",
                filters: {
                    tagFilter: "태그로 필터링:",
                    searchResults: "검색 결과: \"{query}\"",
                    categoryFilter: "카테고리: {category}",
                    sortBy: "정렬 기준:"
                },
                noResults: {
                    search: "\"{query}\"{category}에 대한 검색 결과가 없습니다",
                    searchTip: "다른 키워드로 검색하거나 모든 카테고리에서 검색해보세요.",
                    filtered: "필터 조건에 맞는 포스트가 없습니다",
                    empty: "포스트를 찾을 수 없습니다"
                },
                loading: "{title} 콘텐츠를 불러오는 중...",
                loadingSubtext: "포스트를 가져오는 동안 잠시 기다려주세요.",
                error: "포스트 로딩 오류",
                tryAgain: "다시 시도",
                noData: "사용 가능한 포스트 없음",
                noDataDetail: "{title}에 대한 포스트를 불러올 수 없습니다"
            },
            detail: {
                backTo: "{category} 목록으로",
                backToHome: "홈으로 돌아가기",
                backToList: "{category} 목록으로 돌아가기",
                meta: {
                    views: "{count} views",
                    category: "카테고리",
                    uncategorized: "미분류"
                },
                actions: {
                    share: "📤 공유하기",
                    shareText: "이 글이 도움이 되셨나요?",
                    edit: "✏️ 수정",
                    delete: "🗑️ 삭제"
                },
                resourceLinks: "API Resource Links",
                loading: "📖 포스트를 불러오는 중...",
                notFound: "포스트를 찾을 수 없습니다",
                notFoundDetail: "요청하신 포스트가 존재하지 않거나 삭제되었습니다.",
                errors: {
                    invalidUrl: "잘못된 포스트 URL",
                    noSlug: "포스트 slug를 찾을 수 없습니다."
                },
                shareSuccess: "링크가 클립보드에 복사되었습니다!"
            },
            form: {
                titles: {
                    create: "새 {category} 포스트 작성",
                    edit: "포스트 수정"
                },
                fields: {
                    title: "제목",
                    subtitle: "부제",
                    content: "내용",
                    tags: "태그",
                    place: "장소",
                    intro: "소개",
                    name: "이름",
                    menuRecommendation: "메뉴 추천 및 설명",
                    message: "메시지",
                    thumbnail: "썸네일 이미지"
                },
                placeholders: {
                    blog: {
                        title: "글의 제목을 입력하세요",
                        subtitle: "글의 부제목을 입력하세요",
                        content: "# 마크다운 형식으로 내용을 작성하세요"
                    },
                    stamps: {
                        title: "당신의 이름을 입력하세요",
                        content: "방명록에 남길 메시지를 입력하세요"
                    },
                    default: {
                        title: "제목을 입력하세요",
                        content: "# 마크다운 형식으로 내용을 작성하세요"
                    }
                },
                toolbar: {
                    addImage: "📷 이미지 추가",
                    imageUrl: "🔗 이미지 URL",
                    preview: "👁️ 미리보기",
                    edit: "✏️ 편집"
                },
                imageSection: {
                    attached: "첨부된 이미지 ({count}개)",
                    urlPrompt: "이미지 URL을 입력하세요:",
                    altPrompt: "이미지 설명을 입력하세요 (선택사항):",
                    onlyImages: "이미지 파일만 업로드 가능합니다.",
                    previewText: "미리보기가 여기에 표시됩니다..."
                },
                thumbnail: {
                    upload: "클릭하여 썸네일 업로드",
                    change: "이미지 변경",
                    hint: "권장 크기: 1200x630px, 최대 5MB",
                    remove: "썸네일 제거"
                },
                tags: {
                    hint: "Enter 키를 눌러 태그를 추가하세요",
                    placeholder: "태그를 입력하고 Enter를 누르세요"
                },
                buttons: {
                    cancel: "취소",
                    submit: "제출",
                    update: "수정"
                },
                validation: {
                    titleRequired: "제목을 입력해주세요",
                    subtitleRequired: "부제를 입력해주세요",
                    contentRequired: "내용을 입력해주세요",
                    thumbnailSizeError: "썸네일 파일 크기는 5MB 이하여야 합니다",
                    thumbnailTypeError: "이미지 파일(JPG, PNG, WebP)만 업로드 가능합니다"
                },
                success: {
                    created: "포스트가 생성되었습니다!",
                    updated: "포스트가 수정되었습니다!"
                },
                errors: {
                    createFailed: "포스트 생성에 실패했습니다: {error}",
                    updateFailed: "포스트 수정에 실패했습니다: {error}",
                    deleteFailed: "포스트 삭제에 실패했습니다: {error}",
                    noPostId: "포스트 ID를 찾을 수 없습니다.",
                    formSubmission: "폼 제출에 실패했습니다",
                    loginFailed: "로그인에 실패했습니다",
                    thumbnailUploadFailed: "썸네일 업로드에 실패했습니다"
                },
                newCategory: "\"{category}\" 신규 카테고리"
            },
            delete: {
                title: "🗑️ 포스트 삭제",
                targetPost: "삭제할 포스트:",
                warning: "⚠️ 이 작업은 되돌릴 수 없습니다. 정말로 삭제하시겠습니까?",
                confirm: "삭제",
                deleting: "삭제 중...",
                cancel: "취소"
            },
            auth: {
                required: "{category} 카테고리에서 {action}하려면 인증이 필요합니다.",
                actions: {
                    create: "새 글을 작성",
                    edit: "이 포스트를 수정",
                    delete: "이 포스트를 삭제"
                }
            },
            categories: {
                tech: "Tech",
                food: "Food",
                uncategorized: "미분류"
            }
        }
    }
};
``