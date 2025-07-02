export interface PaginatedResponse<T> {
    content: T[];
    page: number;
    size: number;
    total: number;
}

export interface PostSummary {
    id: string;
    title: string;
    titleEn: string;
    subtitle: string;
    subtitleEn: string;
    slug: string;
    category: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    series: SeriesInfoResponse | null;
}

export interface SeriesInfoResponse {
    seriesId: string;
    seriesTitle: string;
    seriesSlug: string;
    currentOrder: number;
    totalCount: number;
    isLatest: boolean;
}

export interface LinkInfo {
    href: string;
    method: string;
    title: string;
}

export interface PostDetail {
    id: string;
    title: string;
    titleEn: string;
    subtitle: string;
    subtitleEn: string;
    slug: string;
    category: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    content: string;
    contentEn: string;
    _links: Map<string, LinkInfo>;
    series: PostSeriesDetailResponse
}

export interface PostSeriesDetailResponse {
    seriesId: string;
    seriesTitle: string;
    seriesTitleEn?: string;
    seriesSlug: string;
    seriesDescription: string;
    seriesDescriptionEn?: string;
    currentOrder: number;
    totalCount: number;
    navigation: SeriesNavigationResponse;
}

export interface SeriesDetailResponse {
    id: string;
    slug: string;
    category: string;
    title: string;
    titleEn: string | null;
    description: string;
    descriptionEn: string | null;
    totalCount: number;
    tags: string[];
    createdAt: string;
    lastUpdated: string;
    posts: SeriesPostItem[];
}

export interface SeriesNavigationResponse {
    prev?: NavigationItem;
    next?: NavigationItem;
    allPosts: NavigationItem[];
}

export interface NavigationItem {
    id: string;
    title: string;
    slug: string;
    order: number;
    current: boolean;
}

export interface SeriesPostItem {
    id: string;
    slug: string;
    title: string;
    titleEn: string | null;
    subtitle: string;
    subtitleEn: string | null;
    order: number;
    createdAt: string;
    viewCount: number;
}

export interface SeriesNavigationResponse {
    prev?: NavigationItem;
    next?: NavigationItem;
    allPosts: NavigationItem[];
}

export interface NavigationItem {
    id: string;
    title: string;
    slug: string;
    order: number;
    current: boolean;
}

export interface PostStat {
    postId: string;
    slug: string;
    viewCount: number;
    lastUpdated: Date;
}

export interface CreatePostRequest {
    title: string;
    titleEn?: string;
    markdownContent: string;
    markdownContentEn?: string;
    subtitle: string;
    subtitleEn?: string;
    tags: string[];
    category: string;
}

export interface ImageMapping {
    id: string;
    placeholder: string;
    filename: string;
}

export interface UpdatePostRequest {
    title: string;
    titleEn?: string;
    markdownContent: string;
    markdownContentEn?: string;
    subtitle: string;
    subtitleEn?: string;
    tags: string[];
    category: string;
}

export interface PostSearchRequest {
    keyword: string;
    category?: string;
    tags?: string[];
    page: number;
    size: number;
    sortBy: string;
    sortDirection: "asc" | "desc";
}

export enum FontFamily {
    DEFAULT = "DEFAULT",
    SERIF = "SERIF",
    SANS_SERIF = "SANS_SERIF",
    MONOSPACE = "MONOSPACE",
}

export enum TextColor {
    DEFAULT = "DEFAULT",
    BLACK = "BLACK",
    BLUE = "BLUE",
    RED = "RED",
    GREEN = "GREEN",
}

export enum StampType {
    AWESOME = "AWESOME",
    INTERESTING = "INTERESTING",
    HELPFUL = "HELPFUL",
    INSPIRING = "INSPIRING",
    THANK_YOU = "THANK_YOU",
    LOVE_IT = "LOVE_IT",
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
    hidden: boolean;
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
    requiresTwoFactor: boolean;
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
    createdAt: Date;
}
