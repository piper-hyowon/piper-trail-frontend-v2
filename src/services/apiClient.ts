import {
    PaginatedResponse,
    PostSummary,
    PostDetail,
    CreatePostRequest,
    UpdatePostRequest,
    PostSearchRequest,
    CreateCommentRequest,
    DeleteCommentRequest,
    CommentResponse,
    CommentReviewRequest,
    CommentAdminResponse,
    LoginRequest,
    TwoFactorRequest,
    AuthResponse,
    DashboardSummaryResponse,
    PostStatisticsResponse, PostcardResponse, StampType,
    PostStat
} from '../types/api';
import {Language} from "../context/LanguageContext.tsx";

class ApiClient {
    private baseURL: string;
    private accessToken: string | null = null;
    private refreshToken: string | null = null;
    private language: Language = 'ko';

    constructor(baseURL: string) {
        this.baseURL = baseURL;
        this.loadTokensFromStorage();
    }

    public setLanguage(language: Language) {
        this.language = language;
    }

    public getLanguage(): string {
        return this.language;
    }

    private addLanguageParam(url: string): string {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}lang=${this.language}`;
    }

    private loadTokensFromStorage() {
        this.accessToken = sessionStorage.getItem('accessToken');
        this.refreshToken = sessionStorage.getItem('refreshToken');
    }

    public setTokens(accessToken: string, refreshToken: string) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        sessionStorage.setItem('accessToken', accessToken);
        sessionStorage.setItem('refreshToken', refreshToken);
    }

    public clearTokens() {
        this.accessToken = null;
        this.refreshToken = null;
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseURL}${this.addLanguageParam(endpoint)}`;

        const headers: Record<string, string> = {
            'Accept-Language': this.language,
        };

        if (!(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        // 기존 헤더가 있으면 병합
        if (options.headers) {
            const optionsHeaders = options.headers as Record<string, string>;
            Object.assign(headers, optionsHeaders);
        }

        if (this.accessToken) {
            headers['Authorization'] = `Bearer ${this.accessToken}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            // 401 에러 시 토큰 갱신 시도
            if (response.status === 401 && this.refreshToken) {
                const refreshed = await this.attemptTokenRefresh();
                if (refreshed) {
                    // 갱신된 토큰으로 재시도
                    headers['Authorization'] = `Bearer ${this.accessToken}`;
                    const retryResponse = await fetch(url, {...options, headers});

                    if (!retryResponse.ok) {
                        throw new Error(`HTTP ${retryResponse.status}: ${retryResponse.statusText}`);
                    }

                    return await retryResponse.json();
                } else {
                    this.clearTokens();
                    throw new Error('Authentication failed - please login again');
                }
            }

            // 204 No Content 응답 처리
            if (response.status === 204) {
                return undefined as T;
            }

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    private async attemptTokenRefresh(): Promise<boolean> {
        if (!this.refreshToken) return false;

        try {
            const response = await fetch(`${this.baseURL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({refreshToken: this.refreshToken}),
            });

            if (response.ok) {
                const authResponse: AuthResponse = await response.json();
                this.setTokens(authResponse.accessToken, authResponse.refreshToken);
                return true;
            }
            return false;
        } catch {
            return false;
        }
    }

    // Auth API
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        return this.request<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

    async twoFactorAuth(request: TwoFactorRequest): Promise<AuthResponse> {
        return this.request<AuthResponse>('/auth/two-factor', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }

    async refreshTokens(): Promise<AuthResponse> {
        if (!this.refreshToken) {
            throw new Error('No refresh token available');
        }

        return this.request<AuthResponse>('/auth/refresh', {
            method: 'POST',
            body: JSON.stringify({refreshToken: this.refreshToken}),
        });
    }

    // Posts API
    async getPosts(params?: { page?: number; size?: number }): Promise<PaginatedResponse<PostSummary>> {
        const searchParams = new URLSearchParams();

        if (params) {
            if (params.page !== undefined) searchParams.append('page', params.page.toString());
            if (params.size !== undefined) searchParams.append('size', params.size.toString());
        }

        const queryString = searchParams.toString();
        return this.request<PaginatedResponse<PostSummary>>(`/posts${queryString ? `?${queryString}` : ''}`);
    }

    async getPost(slug: string): Promise<PostDetail> {
        return this.request<PostDetail>(`/posts/${slug}`);
    }

    async getPostStats(slug: string): Promise<PostStat> {
        return this.request<PostStat>(`/posts/${slug}/stats`);
    }

    async createPost(post: CreatePostRequest | FormData): Promise<PostDetail> {
        const body = post instanceof FormData ? post : JSON.stringify(post);
        return this.request<PostDetail>('/posts', {
            method: 'POST',
            body,
        });
    }

    async updatePost(postId: string, post: UpdatePostRequest | FormData): Promise<PostDetail> {
        const body = post instanceof FormData ? post : JSON.stringify(post);
        return this.request<PostDetail>(`/posts/${postId}`, {
            method: 'PUT',
            body,
        });
    }

    async deletePost(postId: string): Promise<void> {
        return this.request<void>(`/posts/${postId}`, {
            method: 'DELETE',
        });
    }

    async getPostsByCategory(categoryName: string | null, params?: {
        page?: number;
        size?: number;
        sort?: string;
    }): Promise<PaginatedResponse<PostSummary>> {
        const searchParams = new URLSearchParams();

        if (params) {
            if (params.page !== undefined) searchParams.append('page', params.page.toString());
            if (params.size !== undefined) searchParams.append('size', params.size.toString());
        }

        if (params?.sort) {
            const [sortBy, sortDir] = params.sort.split(',');
            if (sortBy) searchParams.append('sortBy', sortBy);
            if (sortDir) searchParams.append('sortDir', sortDir);
        }

        if (Date.now() < new Date('2025-07-01').getTime()) {
            searchParams.append('_cb', Date.now().toString());
        }

        const queryString = searchParams.toString();
        const category = categoryName === null ? 'null' : categoryName;
        return this.request<PaginatedResponse<PostSummary>>(`/posts/category/${category}${queryString ? `?${queryString}` : ''}`);
    }

    async getPostsByTag(tagName: string, params?: {
        page?: number;
        size?: number
        sort?: string;

    }): Promise<PaginatedResponse<PostSummary>> {
        const searchParams = new URLSearchParams();

        if (params) {
            if (params.page !== undefined) searchParams.append('page', params.page.toString());
            if (params.size !== undefined) searchParams.append('size', params.size.toString());
        }

        if (params?.sort) {
            const [sortBy, sortDir] = params.sort.split(',');
            if (sortBy) searchParams.append('sortBy', sortBy);
            if (sortDir) searchParams.append('sortDir', sortDir);
        }

        if (Date.now() < new Date('2025-07-01').getTime()) {
            searchParams.append('_cb', Date.now().toString());
        }

        const queryString = searchParams.toString();
        return this.request<PaginatedResponse<PostSummary>>(`/posts/tag/${tagName}${queryString ? `?${queryString}` : ''}`);
    }

    async searchPosts(searchRequest: PostSearchRequest): Promise<PaginatedResponse<PostSummary>> {
        const params = new URLSearchParams();

        Object.entries(searchRequest).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    value.forEach(v => params.append(key, v.toString()));
                } else {
                    params.append(key, value.toString());
                }
            }
        });

        if (Date.now() < new Date('2025-07-01').getTime()) {
            params.append('_cb', Date.now().toString());
        }

        return this.request<PaginatedResponse<PostSummary>>(`/posts/search?${params.toString()}`);
    }

    // Categories & Tags API
    async getCategories(): Promise<string[]> {
        return this.request<string[]>('/posts/categories');
    }

    async getTags(): Promise<string[]> {
        return this.request<string[]>('/posts/tags');
    }

    async getBulkPostStats(slugs: string[]): Promise<Record<string, PostStat>> {
        const params = new URLSearchParams();
        slugs.forEach(slug => params.append('slugs', slug));

        return this.request<Record<string, PostStat>>(`/posts/stats?${params.toString()}`);
    }

    // Comments API
    async getPostComments(postId: string, page = 0, size = 20): Promise<PaginatedResponse<CommentResponse>> {
        return this.request<PaginatedResponse<CommentResponse>>(`/posts/${postId}/comments?page=${page}&size=${size}`);
    }

    async getAllComments(page = 0, size = 20): Promise<PaginatedResponse<CommentAdminResponse>> {
        return this.request<PaginatedResponse<CommentAdminResponse>>(`/comments?page=${page}&size=${size}`);
    }

    async createComment(postId: string, comment: CreateCommentRequest): Promise<CommentResponse> {
        return this.request<CommentResponse>(`/posts/${postId}/comments`, {
            method: 'POST',
            body: JSON.stringify(comment),
        });
    }

    async deleteComment(postId: string, commentId: string, deleteRequest: DeleteCommentRequest): Promise<void> {
        return this.request<void>(`/posts/${postId}/comments/${commentId}`, {
            method: 'DELETE',
            body: JSON.stringify(deleteRequest),
        });
    }

    async reviewComment(postId: string, commentId: string, review: CommentReviewRequest): Promise<CommentAdminResponse> {
        return this.request<CommentAdminResponse>(`/posts/${postId}/comments/${commentId}/review`, {
            method: 'PATCH',
            body: JSON.stringify(review),
        });
    }

    // Dashboard API
    async getDashboardSummary(): Promise<DashboardSummaryResponse> {
        return this.request<DashboardSummaryResponse>('/dashboard/summary');
    }

    async getPostsStats(postId: string): Promise<PostStatisticsResponse> {
        return this.request<PostStatisticsResponse>(`/dashboard/posts/${postId}/stats`);
    }

    // Postcards API
    async getPostcards(page = 0, size = 20): Promise<PaginatedResponse<PostcardResponse>> {
        return this.request<PaginatedResponse<PostcardResponse>>(`/postcards?page=${page}&size=${size}`);
    }

    async createPostcard(stampType: StampType, nickname?: string, message?: string): Promise<any> {
        return this.request<any>(`/postcards`, {
            method: 'POST',
            body: JSON.stringify({
                stampType, nickname, message,
            }),
        });
    }

}

const apiClient = new ApiClient(
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
);

declare global {
    interface Window {
        apiClient: ApiClient;
    }
}
window.apiClient = apiClient;

export default apiClient;