export const commentTranslations = {
    en: {
        comment: {
            section: {
                title: "Comments",
                loading: "Loading comments...",
                loadingError: "Failed to load comments.",
                noComments: "No comments yet. Be the first to leave a comment!",
                count: "{count}"
            },
            form: {
                title: "Write a Comment",
                fields: {
                    nickname: "Nickname",
                    password: "Password",
                    content: "Comment Content",
                    font: "Font",
                    textColor: "Text Color"
                },
                placeholders: {
                    nickname: "Enter your nickname",
                    password: "Used for comment deletion (4+ characters)",
                    content: "Write your comment..."
                },
                options: {
                    font: {
                        default: "Default",
                        serif: "Serif",
                        sansSerif: "Sans-serif",
                        monospace: "Monospace"
                    },
                    color: {
                        default: "Default",
                        black: "Black",
                        blue: "Blue",
                        red: "Red",
                        green: "Green"
                    }
                },
                preview: "Preview",
                submit: "Post Comment",
                submitting: "Posting...",
                validation: {
                    nicknameRequired: "Please enter a nickname.",
                    passwordTooShort: "Password must be at least 4 characters.",
                    contentRequired: "Please enter comment content."
                }
            },
            item: {
                delete: "Delete",
                deleteConfirm: "Confirm Delete",
                deleting: "Deleting...",
                cancel: "Cancel",
                deletePasswordPlaceholder: "Password used when writing comment",
                deletePasswordRequired: "Please enter the password.",
                deleteSuccess: "Comment has been successfully deleted.",
                deleteErrors: {
                    wrongPassword: "Password does not match.",
                    notFound: "Comment not found.",
                    failed: "Delete failed: {error}"
                }
            },
            confetti: {
                firstComment: 'Congratulations! You wrote the first comment! 🥇',
                thankYou1: 'Thank you for your comment! Your feedback means a lot! 💝',
                thankYou2: 'Thanks for your valuable comment! Let\'s grow together! 🌱',
                thankYou3: 'What a great comment! Happy to connect with you! ✨',
                thankYou4: 'Thank you for commenting! I\'ll keep creating better content! 🙏'
            }
        }
    },
    ko: {
        comment: {
            section: {
                title: "댓글",
                loading: "댓글을 불러오는 중...",
                loadingError: "댓글을 불러오는데 실패했습니다.",
                noComments: "아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!",
                count: "{count}"
            },
            form: {
                title: "댓글 작성",
                fields: {
                    nickname: "닉네임",
                    password: "비밀번호",
                    content: "댓글 내용",
                    font: "폰트",
                    textColor: "글자 색상"
                },
                placeholders: {
                    nickname: "닉네임을 입력하세요",
                    password: "댓글 삭제 시 사용됩니다(4글자 이상)",
                    content: "댓글을 입력하세요..."
                },
                options: {
                    font: {
                        default: "기본",
                        serif: "세리프",
                        sansSerif: "산세리프",
                        monospace: "모노스페이스"
                    },
                    color: {
                        default: "기본",
                        black: "검정",
                        blue: "파랑",
                        red: "빨강",
                        green: "초록"
                    }
                },
                preview: "미리보기",
                submit: "댓글 작성",
                submitting: "작성 중...",
                validation: {
                    nicknameRequired: "닉네임을 입력해주세요.",
                    passwordTooShort: "비밀번호를 4글자 이상 입력해주세요.",
                    contentRequired: "댓글 내용을 입력해주세요."
                }
            },
            item: {
                delete: "삭제",
                deleteConfirm: "삭제 확인",
                deleting: "삭제 중...",
                cancel: "취소",
                deletePasswordPlaceholder: "댓글 작성 시 입력한 비밀번호",
                deletePasswordRequired: "비밀번호를 입력해주세요.",
                deleteSuccess: "댓글이 성공적으로 삭제되었습니다.",
                deleteErrors: {
                    wrongPassword: "비밀번호가 일치하지 않습니다.",
                    notFound: "댓글을 찾을 수 없습니다.",
                    failed: "삭제 실패: {error}"
                }
            },
            confetti: {
                firstComment: '축하합니다! 첫 번째 댓글을 작성하셨어요! 🥇',
                thankYou1: '댓글 감사합니다! 여러분의 의견은 큰 힘이 됩니다! 💝',
                thankYou2: '소중한 댓글 감사드려요! 함께 성장해나가요! 🌱',
                thankYou3: '멋진 댓글이에요! 여러분과 소통할 수 있어 행복합니다! ✨',
                thankYou4: '댓글 남겨주셔서 감사합니다! 더 좋은 콘텐츠로 보답하겠습니다! 🙏'
            }
        }
    }
};