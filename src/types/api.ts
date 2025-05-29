export interface PaginatedResponse<T> {
    content: T[];
    page: number;
    size: number;
    total: number;
}

export interface PostSummary {
    id: string;
    title: string;
    slug: string;
    preview: string;
    category: string;
    tags: string[];
    viewCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface LinkInfo {
    href: string;
    method: string;
    title: string;
}

export interface PostDetail extends PostSummary {
    content: string;
    links: Map<string, LinkInfo>;
}

export interface CreatePostRequest {
    title: string;
    markdownContent: string;
    category?: string;
    tags: string[];
}

export interface UpdatePostRequest {
    title: string;
    markdownContent: string;
    category?: string;
    tags: string[];
}

export interface PostSearchRequest {
    keyword: string;
    category?: string;
    tags?: string[];
    page: number;
    size: number;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
}

export enum FontFamily {
    DEFAULT = 'DEFAULT',
    SERIF = 'SERIF',
    SANS_SERIF = 'SANS_SERIF',
    MONOSPACE = 'MONOSPACE'
}

export enum TextColor {
    DEFAULT = 'DEFAULT',
    BLACK = 'BLACK',
    BLUE = 'BLUE',
    RED = 'RED',
    GREEN = 'GREEN'
}

export enum StampType {
    AWESOME = "AWESOME",
    INTERESTING = "INTERESTING",
    HELPFUL = "HELPFUL",
    INSPIRING = "INSPIRING",
    THANK_YOU = "THANK_YOU",
    LOVE_IT = "LOVE_IT"
}

export interface CreateCommentRequest {
    author: string;
    password: string;
    content: string;
    fontFamily: FontFamily;
    textColor: TextColor;
}

export interface DeleteCommentRequest {
    password: string;
}

export interface CommentResponse {
    id: string;
    author: string;
    content: string;
    fontFamily: FontFamily;
    textColor: TextColor;
    createdAt: Date;
    reviewNeeded: boolean;
}

export interface CommentReviewRequest {
    approved: boolean;
    reason: string;
}

export interface CommentAdminResponse {
    id: string;
    postId: string;
    author: string;
    content: string;
    fontFamily: FontFamily;
    textColor: TextColor;
    ipAddress: string;
    approved: boolean;
    hidden: boolean
    needsReview: boolean;
    riskScore: number;
    reviewedAt: Date;
    reviewResponse: string;
    createdAt: Date;
    updatedAt: Date;

}

export interface PostStatisticsResponse {
    postId: string;
    title: string;
    slug: string;
    totalViews: number;
    uniqueVisitors: number;
    returningVisitors: number;
    viewsByDay: Map<Date, number>;
    viewsByReferrer: Map<String, Number>;
    viewsByRegion: Map<String, Number>;
}

export interface PopularPost {
    id: string;
    title: string;
    slug: string;
    viewCount: number;
}

export interface DashboardSummaryResponse {
    totalPosts: number;
    totalViews: number;
    todayViews: number;
    thisWeeksViews: number;
    uniqueVisitors: number;
    topPosts: PopularPost[];
    topReferrers: Map<string, number>;
    weeklyTrend: Map<Date, number>;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface TwoFactorRequest {
    username: string;
    totp: string;
}

export interface AuthResponse {
    accessToken: string; // 2단계 인증 완료시 포함
    refreshToken: string; // 2단계 인증 완료시 포함
    qrCodeDataUrl: string; // TOTP 설정 필요시(최초1 회)
    accessTokenExpiresInSeconds: number;

}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export class PostcardResponse {
    id: string;
    stampType: StampType;
    nickname: string;
    message: string;
    createdAt: Date
}

