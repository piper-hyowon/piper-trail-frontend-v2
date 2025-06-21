import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
    useCallback,
} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import apiClient from "../services/apiClient";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type AcceptHeader = "application/json" | "text/html";
export type ApiStatus = "idle" | "loading" | "success" | "error";

export interface LoginCredentials {
    username: string;
    password: string;
    totpCode?: string;
}

interface ApiContextType {
    method: HttpMethod;
    apiUrl: string;
    apiData: any | null;
    statusCode: number | null;
    acceptHeader: AcceptHeader;
    apiStatus: ApiStatus;
    apiError: string | null;
    setMethod: (method: HttpMethod) => void;
    setApiUrl: (url: string) => void;
    setStatusCode: (code: number) => void;
    setAcceptHeader: (header: AcceptHeader) => void;
    fetchApiData: (url?: string, method?: HttpMethod, body?: any) => Promise<any>;
    navigateTo: (url: string, method?: HttpMethod) => void;
    setApiData: (data: any) => void;
    clearApiError: () => void;
    clearApiState: () => void;
    clearApiStatus: () => void;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<boolean>;
    logout: () => void;
    setApiStatus: (status: ApiStatus) => void;
    setApiError: (error: string | null) => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: ReactNode }> = ({
                                                                   children,
                                                               }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [apiUrl, setApiUrl] = useState<string>(
        location.pathname + location.search
    );
    const [method, setMethod] = useState<HttpMethod>("GET");
    const [acceptHeader, setAcceptHeader] =
        useState<AcceptHeader>("application/json");
    const [apiData, setApiData] = useState<any | null>(null);
    const [statusCode, setStatusCode] = useState<number | null>(200);
    const [apiStatus, setApiStatus] = useState<ApiStatus>("success");
    const [apiError, setApiError] = useState<string | null>(null);

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        const token = sessionStorage.getItem('accessToken');
        return !!token;
    });

    const clearApiError = useCallback(() => {
        setApiError(null);
        setApiStatus("idle");
    }, []);

    const clearApiStatus = useCallback(() => {
        setStatusCode(null);
        setApiError(null);
        setApiStatus("idle");
    }, []);

    const clearApiState = useCallback(() => {
        setStatusCode(null);
        setApiUrl('');
        setApiError(null);
        setApiStatus("idle");
        setApiData(null);
    }, []);

    const fetchApiData = useCallback(
        async (
            url: string = apiUrl,
            methodToUse: HttpMethod = method,
            body?: any
        ) => {
            console.log(`API UI: ${methodToUse} ${url}`);

            setApiStatus("loading");
            setApiError(null);

            try {
                let statusCode: number;

                switch (methodToUse) {
                    case 'GET':
                        // GET은 항상 성공 (React Router가 실제 네비게이션 처리)
                        statusCode = 200;
                        break;

                    case 'POST':
                        // POST도 성공 (NavigationBar에서 이미 폼 처리함)
                        statusCode = 200;
                        break;

                    case 'PUT':
                        // PUT 성공 (NavigationBar에서 이미 폼 처리함)
                        statusCode = 200;
                        break;

                    case 'DELETE':
                        // DELETE 성공 (NavigationBar에서 이미 확인 처리함)
                        statusCode = 200;
                        break;

                    case 'PATCH':
                        // PATCH 미지원
                        statusCode = 405;
                        throw new Error('PATCH method not supported');

                    default:
                        statusCode = 405;
                        throw new Error('Unsupported method');
                }

                setStatusCode(statusCode);
                setApiStatus("success");
                setApiData(null);

                return {status: statusCode};

            } catch (error: any) {
                console.error("API simulation error:", error);
                setApiStatus("error");

                if (error.message?.includes('not implemented') || error.message?.includes('Unsupported')) {
                    setStatusCode(405);
                    setApiError("405 Method Not Allowed");
                } else {
                    setStatusCode(500);
                    setApiError("Internal Server Error");
                }

                throw error;
            }
        },
        [apiUrl, method]
    );

    const navigateTo = useCallback(
            (url: string, newMethod?: HttpMethod) => {
                setStatusCode(200);
                setApiStatus("success");
                setApiError(null);

                if (newMethod) {
                    setMethod(newMethod);
                } else {
                    setMethod("GET")
                }
                const correctedUrl = url.startsWith("/") ? url : `/${url}`;
                setApiUrl(decodeURIComponent(correctedUrl));
                navigate(correctedUrl);
            },
            [navigate, clearApiStatus]
        )
    ;

    // URL 변경 시 동기화 및 상태 클리어
    useEffect(() => {
        const currentLocationPath = location.pathname + location.search;
        if (currentLocationPath !== apiUrl) {
            setApiUrl(decodeURIComponent(currentLocationPath));
            // URL이 변경 = 새로운 GET 요청 성공
            setStatusCode(200);
            setApiStatus("success");
            setApiError(null);
        }
    }, [location, apiUrl]);

    const login = useCallback(
        async (credentials: LoginCredentials): Promise<boolean> => {
            try {
                setApiStatus("loading");

                if (!credentials.totpCode) {
                    // 1단계
                    try {
                        const response = await apiClient.login({
                            username: credentials.username,
                            password: credentials.password
                        });
                        console.log(response); // QR Code 받는 용도..

                        if (response.requiresTwoFactor) {
                            setApiStatus("idle");
                            return false; // 2FA 단계로 진행
                        }
                    } catch (error: any) {
                        if (error.message?.includes('2FA') || error.message?.includes('two-factor')) {
                            setApiStatus("idle");
                            return false; // 2FA 단계로 진행
                        }

                        setApiStatus("error");
                        setStatusCode(401);
                        setApiError("아이디 또는 비밀번호가 올바르지 않습니다.");
                        return false;
                    }
                } else {
                    // 2단계: 2FA 인증
                    try {
                        const response = await apiClient.twoFactorAuth({
                            username: credentials.username,
                            totp: credentials.totpCode
                        });

                        // 토큰 저장
                        apiClient.setTokens(response.accessToken, response.refreshToken);
                        setIsAuthenticated(true);
                        setApiStatus("success");
                        setStatusCode(200);
                        return true;

                    } catch (error: any) {
                        setApiStatus("error");
                        setStatusCode(401);
                        setApiError("인증 코드가 올바르지 않습니다.");
                        return false;
                    }
                }
            } catch (error) {
                console.error("Login failed:", error);
                setApiStatus("error");
                setStatusCode(401);
                setApiError("로그인에 실패했습니다.");
                return false;
            }
        },
        []
    );

    const logout = useCallback(() => {
        apiClient.clearTokens();
        setIsAuthenticated(false);
        setApiStatus("idle");
        setApiError(null);
    }, []);

    return (
        <ApiContext.Provider
            value={{
                method,
                apiUrl,
                apiData,
                statusCode,
                acceptHeader,
                apiStatus,
                apiError,
                setMethod,
                setApiUrl,
                setStatusCode,
                setAcceptHeader,
                setApiData,
                fetchApiData,
                navigateTo,
                clearApiError,
                clearApiState,
                clearApiStatus,
                isAuthenticated,
                login,
                logout,
                setApiStatus,
                setApiError,
            }}
        >
            {children}
        </ApiContext.Provider>
    );
};

export const useApi = () => {
    const context = useContext(ApiContext);
    if (context === undefined) {
        throw new Error("useApi must be used within an ApiProvider");
    }
    return context;
};