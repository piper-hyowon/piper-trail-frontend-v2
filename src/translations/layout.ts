export const layoutTranslations = {
    en: {
        layout: {
            blogTitle: 'Footprints out of the well',
            adminAccess: 'Admin access only',
            login: 'Login',
            auth: {
                authenticated: 'Authenticated',
                notAuthenticated: 'Not authenticated',
                adminLogin: 'Admin Login',
                logout: 'Logout',
                logoutSuccess: 'You have been logged out.',
                loginRequired: 'Please log in to use admin features',
                modal: {
                    login: 'Login',
                    twoFactorAuth: 'Two-Factor Authentication',
                    username: 'Username',
                    password: 'Password',
                    authCode: 'Authentication Code',
                    usernamePlaceholder: 'Enter your username',
                    passwordPlaceholder: 'Enter your password',
                    authCodePlaceholder: '000000',
                    cancel: 'Cancel',
                    back: 'Back',
                    next: 'Next',
                    loggingIn: 'Logging in...',
                    authenticating: 'Authenticating...',
                    twoFactorInfo: 'Enter the 6-digit code from your authenticator app.',
                    errors: {
                        fillRequired: 'Please enter both username and password.',
                        invalidCredentials: 'Invalid username or password.',
                        enterAuthCode: 'Please enter the authentication code.',
                        invalidAuthCode: 'Invalid authentication code.',
                        authError: 'An error occurred during authentication.'
                    }
                }
            },
            method: {
                changed: 'Method has been changed to <strong>{method}</strong>.',
                notAllowed: '<strong>405 Method Not Allowed</strong> - This page does not support {method}.',
                postDataError: 'Unable to retrieve post data.'
            },
            form: {
                createPost: 'Create New {category} Post',
                editPost: 'Edit {category} Post',
                postCreated: 'Post has been created!',
                postUpdated: 'Post has been updated!',
                postDeleted: 'Post has been deleted!',
                createFailed: 'Failed to create post.',
                updateFailed: 'Failed to update post.',
                deleteFailed: 'Failed to delete post.'
            }
        }
    },
    ko: {
        layout: {
            blogTitle: '우물 밖으로의 발자국을 기록하는 공간',
            adminAccess: '관리자 전용',
            login: '로그인',
            auth: {
                authenticated: '인증됨',
                notAuthenticated: '인증되지 않음',
                adminLogin: '관리자 로그인',
                logout: '로그아웃',
                logoutSuccess: '로그아웃 되었습니다.',
                loginRequired: '관리자 기능을 사용하려면 로그인하세요',
                modal: {
                    login: '로그인',
                    twoFactorAuth: '2단계 인증',
                    username: '아이디',
                    password: '비밀번호',
                    authCode: '인증 코드',
                    usernamePlaceholder: '아이디를 입력하세요',
                    passwordPlaceholder: '비밀번호를 입력하세요',
                    authCodePlaceholder: '000000',
                    cancel: '취소',
                    back: '뒤로',
                    next: '다음',
                    loggingIn: '로그인 중...',
                    authenticating: '인증 중...',
                    twoFactorInfo: '인증 앱에서 생성된 6자리 코드를 입력하세요.',
                    errors: {
                        fillRequired: '아이디와 비밀번호를 모두 입력해주세요.',
                        invalidCredentials: '아이디 또는 비밀번호가 올바르지 않습니다.',
                        enterAuthCode: '인증 코드를 입력해주세요.',
                        invalidAuthCode: '인증 코드가 올바르지 않습니다.',
                        authError: '인증 중 오류가 발생했습니다.'
                    }
                }
            },
            method: {
                changed: '메서드가 <strong>{method}</strong>로 변경되었습니다.',
                notAllowed: '<strong>405 Method Not Allowed</strong> - 이 페이지는 {method}를 지원하지 않습니다.',
                postDataError: '포스트 데이터를 가져올 수 없습니다.'
            },
            form: {
                createPost: '새 {category} 포스트 작성',
                editPost: '{category} 포스트 수정',
                postCreated: '포스트가 생성되었습니다!',
                postUpdated: '포스트가 수정되었습니다!',
                postDeleted: '포스트가 삭제되었습니다!',
                createFailed: '포스트 생성에 실패했습니다.',
                updateFailed: '포스트 수정에 실패했습니다.',
                deleteFailed: '포스트 삭제에 실패했습니다.'
            }
        }
    }
};