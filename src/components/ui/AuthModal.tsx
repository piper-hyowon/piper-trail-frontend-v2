import React, {useState} from 'react';
import styled from 'styled-components';

interface LoginCredentials {
    username: string;
    password: string;
    totpCode?: string;
}

interface AuthModalProps {
    onLogin: (credentials: LoginCredentials) => Promise<boolean>;
    onCancel: () => void;
    message?: string;
}

interface AuthState {
    step: 'login' | 'twoFactor';
    username: string;
    password: string;
    totpCode: string;
    error: string;
    isLoading: boolean;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: ${({theme}) => theme.colors.background};
  border-radius: ${({theme}) => theme.borderRadius};
  padding: ${({theme}) => theme.spacing.lg};
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  margin-bottom: ${({theme}) => theme.spacing.md};
`;

const ModalTitle = styled.h2`
  color: ${({theme}) => theme.colors.primary};
  margin-bottom: ${({theme}) => theme.spacing.sm};
`;

const MessageText = styled.p`
  color: ${({theme}) => theme.colors.text}80;
  font-size: ${({theme}) => theme.fontSizes.small};
  margin-bottom: ${({theme}) => theme.spacing.md};
`;

const FormField = styled.div`
  margin-bottom: ${({theme}) => theme.spacing.md};
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: ${({theme}) => theme.spacing.xs};
  font-weight: bold;
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

const ErrorMessage = styled.div`
  color: ${({theme}) => theme.colors.error};
  font-size: ${({theme}) => theme.fontSizes.small};
  margin-bottom: ${({theme}) => theme.spacing.md};
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({theme}) => theme.spacing.md};
  margin-top: ${({theme}) => theme.spacing.lg};
`;

const LoginButton = styled.button`
  background-color: ${({theme}) => theme.colors.primary};
  color: white;
  font-weight: bold;
  padding: ${({theme}) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border: none;
  border-radius: ${({theme}) => theme.borderRadius};
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background-color: ${({theme}) => theme.colors.text}40;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  background-color: transparent;
  color: ${({theme}) => theme.colors.text};
  font-weight: bold;
  padding: ${({theme}) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border: 1px solid ${({theme}) => theme.colors.text}40;
  border-radius: ${({theme}) => theme.borderRadius};
  cursor: pointer;

  &:hover {
    background-color: ${({theme}) => theme.colors.text}10;
  }
`;

const TwoFactorInfo = styled.div`
  background-color: ${({theme}) => theme.colors.primary}10;
  border-radius: ${({theme}) => theme.borderRadius};
  padding: ${({theme}) => theme.spacing.md};
  margin-bottom: ${({theme}) => theme.spacing.md};

  p {
    margin: 0;
    color: ${({theme}) => theme.colors.primary};
    font-size: ${({theme}) => theme.fontSizes.small};
  }
`;

const AuthModal: React.FC<AuthModalProps> = ({onLogin, onCancel, message}) => {
    const [authState, setAuthState] = useState<AuthState>({
        step: 'login',
        username: '',
        password: '',
        totpCode: '',
        error: '',
        isLoading: false
    });

    const updateAuthState = (updates: Partial<AuthState>) => {
        setAuthState(prev => ({...prev, ...updates}));
    };

    const handleFirstStepSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!authState.username.trim() || !authState.password.trim()) {
            updateAuthState({error: '아이디와 비밀번호를 모두 입력해주세요.'});
            return;
        }

        updateAuthState({error: '', isLoading: true});

        try {
            // 첫 번째 단계: username/password만 전송
            const success = await onLogin({
                username: authState.username,
                password: authState.password
            });

            if (success) {
                // 바로 로그인 성공 (2FA가 필요없는 경우는 없다고 가정)
                return;
            } else {
                // 2FA가 필요한 경우
                updateAuthState({
                    step: 'twoFactor',
                    error: ''
                });
            }
        } catch (err: any) {
            if (err.message?.includes('2FA') || err.message?.includes('two-factor')) {
                updateAuthState({
                    step: 'twoFactor',
                    error: ''
                });
            } else {
                updateAuthState({
                    error: '아이디 또는 비밀번호가 올바르지 않습니다.'
                });
            }
        } finally {
            updateAuthState({isLoading: false});
        }
    };

    const handleTwoFactorSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!authState.totpCode.trim()) {
            updateAuthState({error: '인증 코드를 입력해주세요.'});
            return;
        }

        updateAuthState({error: '', isLoading: true});

        try {
            const success = await onLogin({
                username: authState.username,
                password: authState.password,
                totpCode: authState.totpCode
            });

            if (!success) {
                updateAuthState({error: '인증 코드가 올바르지 않습니다.'});
            }
        } catch (err) {
            updateAuthState({error: '인증 중 오류가 발생했습니다.'});
        } finally {
            updateAuthState({isLoading: false});
        }
    };

    const handleBackToLogin = () => {
        updateAuthState({
            step: 'login',
            totpCode: '',
            error: ''
        });
    };

    return (
        <ModalOverlay onClick={onCancel}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <ModalHeader>
                    <ModalTitle>
                        {authState.step === 'login' ? '로그인' : '2단계 인증'}
                    </ModalTitle>
                    {message && <MessageText>{message}</MessageText>}
                </ModalHeader>

                {authState.step === 'login' ? (
                    <form onSubmit={handleFirstStepSubmit}>
                        {authState.error && <ErrorMessage>{authState.error}</ErrorMessage>}

                        <FormField>
                            <FormLabel htmlFor="username">아이디</FormLabel>
                            <FormInput
                                id="username"
                                type="text"
                                value={authState.username}
                                onChange={e => updateAuthState({username: e.target.value})}
                                placeholder="아이디를 입력하세요"
                                disabled={authState.isLoading}
                            />
                        </FormField>

                        <FormField>
                            <FormLabel htmlFor="password">비밀번호</FormLabel>
                            <FormInput
                                id="password"
                                type="password"
                                value={authState.password}
                                onChange={e => updateAuthState({password: e.target.value})}
                                placeholder="비밀번호를 입력하세요"
                                disabled={authState.isLoading}
                            />
                        </FormField>

                        <ButtonGroup>
                            <CancelButton type="button" onClick={onCancel} disabled={authState.isLoading}>
                                취소
                            </CancelButton>
                            <LoginButton type="submit" disabled={authState.isLoading}>
                                {authState.isLoading ? '로그인 중...' : '다음'}
                            </LoginButton>
                        </ButtonGroup>
                    </form>
                ) : (
                    <form onSubmit={handleTwoFactorSubmit}>
                        {authState.error && <ErrorMessage>{authState.error}</ErrorMessage>}

                        <TwoFactorInfo>
                            <p>인증 앱에서 생성된 6자리 코드를 입력하세요.</p>
                        </TwoFactorInfo>

                        <FormField>
                            <FormLabel htmlFor="totpCode">인증 코드</FormLabel>
                            <FormInput
                                id="totpCode"
                                type="text"
                                value={authState.totpCode}
                                onChange={e => updateAuthState({totpCode: e.target.value})}
                                placeholder="000000"
                                maxLength={6}
                                disabled={authState.isLoading}
                                autoComplete="one-time-code"
                            />
                        </FormField>

                        <ButtonGroup>
                            <CancelButton type="button" onClick={handleBackToLogin} disabled={authState.isLoading}>
                                뒤로
                            </CancelButton>
                            <LoginButton type="submit" disabled={authState.isLoading}>
                                {authState.isLoading ? '인증 중...' : '로그인'}
                            </LoginButton>
                        </ButtonGroup>
                    </form>
                )}
            </ModalContent>
        </ModalOverlay>
    );
};

export default AuthModal;
export type {LoginCredentials};