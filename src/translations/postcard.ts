export const postcardTranslations = {
    en: {
        postcard: {
            title: "📮 Visitor Guestbook",
            description: "Share your thoughts and leave me a message!\nYour kind words and feedback mean the world to me. ✨",
            mailbox: {
                empty: "📭 No messages yet. Be the first to leave one!",
                hasEntries: "📬 {count} new messages! (Click to read)",
                clickHint: "👆 Click again to read the messages!"
            },
            buttons: {
                writePostcard: "✍️ Leave a Message",
                sending: "Sending...",
                viewPostcards: "📮 Read Messages ({count})",
                closeMailbox: "✕ Close"
            },
            modal: {
                title: "✍️ Leave a Message",
                selectStamp: "How did you feel about this?",
                nickname: "Name",
                nicknamePlaceholder: "What should we call you? (Leave blank for 'Anonymous')",
                message: "Your Message (Optional)",
                messagePlaceholder: "Anything else you'd like to share?",
                submitDefault: "📮 Send Message",
                submitSelected: "📮 Send Message",
                submitSending: "📮 Sending...",
                submitSelectStamp: "Please choose your reaction"
            },
            stamps: {
                awesome: {
                    name: "Awesome",
                    description: "This is amazing!"
                },
                interesting: {
                    name: "Interesting",
                    description: "Found this really interesting"
                },
                helpful: {
                    name: "Helpful",
                    description: "This was super helpful"
                },
                inspiring: {
                    name: "Inspiring",
                    description: "This inspired me"
                },
                thank_you: {
                    name: "Thank You",
                    description: "Thanks for sharing this"
                },
                love_it: {
                    name: "Love It",
                    description: "Absolutely love this!"
                }
            },
            messages: {
                success: "Message sent successfully! 📮✨",
                selectStampAlert: "Please choose your reaction first!",
                submitError: "Something went wrong. Please try again.",
                loadingPostcards: "Loading messages... 📮",
                loadingError: "Couldn't load messages 😢",
                retry: "Try Again"
            },
            rateLimit: {
                notice: "⏰ Whoa, slow down!",
                countdown: "Please wait {seconds} seconds before sending another message"
            },
            list: {
                title: "📮 Messages from Visitors ({count})"
            }
        }
    },
    ko: {
        postcard: {
            title: "📮 방문자 우체통",
            description: "여러분의 마음을 담은 엽서를 보내주세요.\n예쁜 도장과 함께 따뜻한 메시지를 남겨주시면 큰 힘이 됩니다. ✨",
            mailbox: {
                empty: "📭 아직 엽서가 없어요. 첫 번째 엽서를 보내주세요!",
                hasEntries: "📬 {count}통의 엽서가 도착했어요! (클릭해서 확인)",
                clickHint: "👆 한 번 더 클릭하면 엽서를 볼 수 있어요!"
            },
            buttons: {
                writePostcard: "✍️ 엽서 보내기",
                sending: "보내는 중...",
                viewPostcards: "📮 엽서 보기 ({count}개)",
                closeMailbox: "✕ 우체통 닫기"
            },
            modal: {
                title: "✍️ 엽서 작성하기",
                selectStamp: "어떤 도장을 찍어주실건가요?",
                nickname: "닉네임",
                nicknamePlaceholder: "어떻게 불러드릴까요? (비워두면 '익명의 방문자')",
                message: "한줄 메시지 (선택)",
                messagePlaceholder: "더 전하고 싶은 말이 있으시면 적어주세요!",
                submitDefault: "📮 우체통에 넣기",
                submitSelected: "📮 우체통에 넣기",
                submitSending: "📮 우체통에 넣는 중...",
                submitSelectStamp: "도장을 선택해주세요"
            },
            stamps: {
                awesome: {
                    name: "멋져요",
                    description: "정말 멋진 콘텐츠!"
                },
                interesting: {
                    name: "흥미로워요",
                    description: "흥미롭고 유익해요"
                },
                helpful: {
                    name: "도움돼요",
                    description: "많은 도움이 됐어요"
                },
                inspiring: {
                    name: "영감받았어요",
                    description: "새로운 아이디어를 얻었어요"
                },
                thank_you: {
                    name: "고마워요",
                    description: "감사한 마음을 전해요"
                },
                love_it: {
                    name: "사랑해요",
                    description: "정말 사랑하는 콘텐츠!"
                }
            },
            messages: {
                success: "엽서를 우체통에 넣었어요! 📮✨",
                selectStampAlert: "도장을 선택해주세요!",
                submitError: "엽서 등록에 실패했습니다. 다시 시도해주세요.",
                loadingPostcards: "엽서들을 불러오고 있어요... 📮",
                loadingError: "엽서를 불러오는데 실패했어요 😢",
                retry: "다시 시도"
            },
            rateLimit: {
                notice: "⏰ 너무 빨라요",
                countdown: "{seconds}초 후 다시 시도할 수 있어요"
            },
            list: {
                title: "📮 도착한 엽서들 ({count}개)"
            }
        }
    }
};