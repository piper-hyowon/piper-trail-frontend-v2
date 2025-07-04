import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import apiClient from "../services/apiClient";
import {
    PostSearchRequest,
    CreatePostRequest,
    UpdatePostRequest,
    CreateCommentRequest,
    CommentReviewRequest,
    LoginRequest,
    TwoFactorRequest,
    StampType,
} from "../types/api";
import {useEffect} from "react";
import {useLanguage} from "../context/LanguageContext.tsx";

interface BasicPaginationParams {
    page?: number;
    size?: number;
    sort?: string;
}

// export const usePosts = (params?: BasicPaginationParams) => {
//     return useQuery({
//         queryKey: ['posts', params],
//         queryFn: () => apiClient.getPosts(params),
//     });
// };

const useSyncApiLanguage = () => {
    const {language} = useLanguage();

    useEffect(() => {
        apiClient.setLanguage(language);
    }, [language]);
};

export const usePostsByCategory = (
    categoryName: string | null,
    params?: BasicPaginationParams
) => {
    const {language} = useLanguage();
    useSyncApiLanguage();

    return useQuery({
        queryKey: ["posts", "category", categoryName, params, language],
        queryFn: () => apiClient.getPostsByCategory(categoryName, params),
        staleTime: 0, // TODO: 60 * 60 * 1000, // 1시간
        gcTime: 5 * 60 * 1000, // TODO: 2 * 60 * 60 * 1000, // 2시간
        enabled: categoryName !== undefined, // categoryName이 정의되어 있을 때만 실행 (null 포함)
    });
};

export const useBulkPostStats = (slugs: string[]) => {
    const {language} = useLanguage();
    useSyncApiLanguage();

    return useQuery({
        queryKey: ["post-stats", "bulk", slugs, language],
        queryFn: () => apiClient.getBulkPostStats(slugs),
        staleTime: 30 * 1000, // 30초
        gcTime: 2 * 60 * 1000, // 2분
        enabled: slugs.length > 0,
    });
};

export const usePostsByTag = (
    tagName: string,
    params?: BasicPaginationParams
) => {
    const {language} = useLanguage();
    useSyncApiLanguage();

    return useQuery({
        queryKey: ["posts", "tag", tagName, params, language],
        queryFn: () => apiClient.getPostsByTag(tagName, params),
        enabled: !!tagName, // tagName이 있을 때만 실행
        staleTime: 60 * 60 * 1000, // 1시간
        gcTime: 2 * 60 * 60 * 1000, // 2시간
    });
};

export const useSearchPosts = (searchRequest: PostSearchRequest) => {
    const {language} = useLanguage();
    useSyncApiLanguage();

    return useQuery({
        queryKey: ["posts", "search", searchRequest, language],
        queryFn: () => apiClient.searchPosts(searchRequest),
        enabled: !!searchRequest.keyword, // 검색어가 있을 때만 실행
        staleTime: 60 * 60 * 1000, // 1시간
        gcTime: 2 * 60 * 60 * 1000, // 2시간
    });
};

export const usePostStats = (slug: string) => {
    const {language} = useLanguage();
    useSyncApiLanguage();

    return useQuery({
        queryKey: ["post-stats", slug, language],
        queryFn: () => apiClient.getPostStats(slug),
        staleTime: 10 * 1000,
        gcTime: 5 * 60 * 1000,
        enabled: !!slug,
    });
};

export const usePost = (slug: string) => {
    const {language} = useLanguage();
    useSyncApiLanguage();

    return useQuery({
        queryKey: ["post", slug, language],
        queryFn: () => apiClient.getPost(slug),
        enabled: !!slug, // slug가 있을 때만 실행
        staleTime: 2 * 60 * 60 * 1000, // 2시간 (백엔드 HTTP 캐시)
        gcTime: 4 * 60 * 60 * 1000, // 4시간
    });
};

export const useCreatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (post: CreatePostRequest | FormData) => apiClient.createPost(post),
        onSuccess: () => {
            // React Query 메모리 캐시만 무효화 (HTTP 캐시는 서버에서 자동 처리)
            queryClient.invalidateQueries({queryKey: ["posts"]});
            queryClient.invalidateQueries({queryKey: ["categories"]});
            queryClient.invalidateQueries({queryKey: ["tags"]});
        },
    });
};

export const useUpdatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
                         postId,
                         post,
                     }: {
            postId: string;
            post: UpdatePostRequest | FormData;
        }) => apiClient.updatePost(postId, post),
        onSuccess: (_, variables) => {
            // React Query 메모리 캐시만 무효화
            queryClient.invalidateQueries({queryKey: ["posts"]});
            queryClient.invalidateQueries({queryKey: ["post", variables.postId]});
        },
    });
};

export const useDeletePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (postId: string) => apiClient.deletePost(postId),
        onSuccess: () => {
            // React Query 메모리 캐시만 무효화
            queryClient.invalidateQueries({queryKey: ["posts"]});
        },
    });
};

export const useCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: () => apiClient.getCategories(),
        staleTime: 24 * 60 * 60 * 1000,
        gcTime: 48 * 60 * 60 * 1000,
    });
};

export const useTags = () => {
    return useQuery({
        queryKey: ["tags"],
        queryFn: () => apiClient.getTags(),
        staleTime: 24 * 60 * 60 * 1000, // 1일
        gcTime: 48 * 60 * 60 * 1000, // 2일
    });
};

export const usePostComments = (postId: string, page = 0, size = 20) => {
    return useQuery({
        queryKey: ["comments", "post", postId, page, size],
        queryFn: () => apiClient.getPostComments(postId, page, size),
        enabled: !!postId,
    });
};

// 전체 댓글 조회 (/comments) - (대시보드에서 사용 인증 필요)
export const useAllComments = (page = 0, size = 20) => {
    return useQuery({
        queryKey: ["comments", "all", page, size],
        queryFn: () => apiClient.getAllComments(page, size),
    });
};

export const useCreateComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
                         postId,
                         comment,
                     }: {
            postId: string;
            comment: CreateCommentRequest;
        }) => apiClient.createComment(postId, comment),
        onSuccess: (_, variables) => {
            // React Query 메모리 캐시만 무효화 (HTTP 캐시는 서버가 자동 처리)
            queryClient.invalidateQueries({
                queryKey: ["comments", "post", variables.postId],
            });
            queryClient.invalidateQueries({queryKey: ["post", variables.postId]});
        },
    });
};

export const useDeleteComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
                         postId,
                         commentId,
                         password,
                     }: {
            postId: string;
            commentId: string;
            password: string;
        }) => apiClient.deleteComment(postId, commentId, {password}),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["comments", "post", variables.postId],
            });
            queryClient.invalidateQueries({queryKey: ["comments", "all"]});
        },
    });
};

// 댓글 검토 (/posts/{postId}/comments/{commentId}/review) - 인증 필요
export const useReviewComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
                         postId,
                         commentId,
                         review,
                     }: {
            postId: string;
            commentId: string;
            review: CommentReviewRequest;
        }) => apiClient.reviewComment(postId, commentId, review),
        onSuccess: (_, variables) => {
            // React Query 메모리 캐시만 무효화
            queryClient.invalidateQueries({queryKey: ["comments"]});
            queryClient.invalidateQueries({queryKey: ["dashboard"]});
        },
    });
};

export const usePostcards = (page = 0, size = 20) => {
    return useQuery({
        queryKey: ["postcards", page, size],
        queryFn: () => apiClient.getPostcards(page, size),
    });
};

export const useCreatePostcard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
                         stampType,
                         nickname,
                         message,
                     }: {
            stampType: StampType;
            nickname?: string;
            message?: string;
        }) => apiClient.createPostcard(stampType, nickname, message),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["postcards"]});
        },
    });
};

export const useSeriesDetail = (slug: string) => {
    return useQuery({
        queryKey: ['series', slug],
        queryFn: () => apiClient.getSeriesDetail(slug),
        enabled: !!slug,
    });
};

// 로그인 1단계 (/auth/login)
export const useLogin = () => {
    return useMutation({
        mutationFn: (credentials: LoginRequest) => apiClient.login(credentials),
    });
};

// 로그인 2단계 (/auth/two-factor)
export const useTwoFactorAuth = () => {
    return useMutation({
        mutationFn: (request: TwoFactorRequest) => apiClient.twoFactorAuth(request),
        onSuccess: (response) => {
            // 토큰 저장
            apiClient.setTokens(response.accessToken, response.refreshToken);
        },
    });
};

// 대시보드 요약 (/dashboard/summary) - 인증 필요
export const useDashboardSummary = () => {
    return useQuery({
        queryKey: ["dashboard", "summary"],
        queryFn: () => apiClient.getDashboardSummary(),
    });
};

// TODO: 함수 이름 개선
// 포스트 통계 (/dashboard/posts/{postId}/stats) - 인증 필요
export const usePostsStats = (postId: string) => {
    return useQuery({
        queryKey: ["dashboard", "posts-stats", postId],
        queryFn: () => apiClient.getPostStats(postId),
        enabled: !!postId,
    });
};
