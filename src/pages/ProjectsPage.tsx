import React, {useState} from 'react';
import styled from 'styled-components';
import {useLanguage} from '../context/LanguageContext';

const GitHubIcon =
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path
            d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>

interface ProjectLink {
    type: 'github' | 'live' | 'preview';
    url: string;
    label?: string;
}

interface Project {
    id: number;
    title: {
        ko: string;
        en: string;
    };
    description: {
        ko: string;
        en: string;
    };

    techStack: {
        backend?: string[];
        blockchain?: string[];
        frontend?: string[];
        database?: string[];
        deployment?: string[];
        architecture?: string[];
    };

    type: ('personal' | 'team')[];

    status: 'completed' | 'ongoing';
    links?: ProjectLink[];
    imageUrl?: string;

    highlights: {
        technical: {
            ko: string[];
            en: string[];
        };
        service: {
            ko: string[];
            en: string[];
        };
    };

    period: {
        start: string;
        end?: string;
    };

    myRole?: {
        ko: string[];
        en: string[];
        summary?: {
            ko: string;
            en: string;
        };
    };
}

const ProjectsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({theme}) => theme.spacing.md};
`;

const FilterContainer = styled.div`
  display: flex;
  gap: ${({theme}) => theme.spacing.xs};
  margin-bottom: ${({theme}) => theme.spacing.lg};
  flex-wrap: wrap;
  justify-content: center;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  padding: ${({theme}) => theme.spacing.xs} ${({theme}) => theme.spacing.sm};
  border: 2px solid ${({theme, $active}) =>
          $active ? theme.colors.primary : `${theme.colors.primary}30`};
  background: ${({theme, $active}) =>
          $active ? theme.colors.primary : theme.colors.background};
  color: ${({theme, $active}) =>
          $active ? theme.colors.background : theme.colors.primary};
  border-radius: ${({theme}) => theme.borderRadius};
  cursor: pointer;
  font-weight: bold;
  font-size: ${({theme}) => theme.fontSizes.small};
  transition: ${({theme}) => theme.transitions.default};

  &:hover {
    background: ${({theme, $active}) =>
            $active ? theme.colors.primary : `${theme.colors.primary}20`};
    transform: translateY(-1px);
  }
`;

const ProjectsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({theme}) => theme.spacing.md};
`;

const ProjectCard = styled.div`
  background: ${({theme}) => theme.colors.background};
  border-radius: ${({theme}) => theme.borderRadius};
  padding: ${({theme}) => theme.spacing.md};
  box-shadow: 0 4px 12px ${({theme}) => `${theme.colors.primary}20`};
  border: 1px solid ${({theme}) => `${theme.colors.primary}20`};
  transition: ${({theme}) => theme.transitions.default};
  position: relative;
  overflow: visible;
  display: grid;
  grid-template-columns: 150px 1fr 180px;
  grid-template-rows: auto auto auto auto auto auto;
  gap: ${({theme}) => theme.spacing.md};
  align-items: start;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px ${({theme}) => `${theme.colors.primary}30`};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({theme}) => theme.gradients.seaGradient};
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto auto auto auto auto auto;
    gap: ${({theme}) => theme.spacing.sm};
    padding: ${({theme}) => theme.spacing.sm};
  }
`;

const ProjectImage = styled.div<{ $imageUrl?: string }>`
  width: 150px;
  height: 120px;
  background: ${({$imageUrl, theme}) =>
          $imageUrl
                  ? `url(${$imageUrl}) center/cover`
                  : theme.gradients.seaGradient
  };
  border-radius: ${({theme}) => theme.borderRadius};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  grid-column: 1;
  grid-row: 1;

  @media (max-width: 768px) {
    width: 100%;
    height: 100px;
    grid-column: 1;
    grid-row: 1;
  }
`;

const ProjectMainInfo = styled.div`
  grid-column: 2;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 0;

  @media (max-width: 768px) {
    grid-column: 1;
    grid-row: 2;
  }
`;

const ProjectTitle = styled.h3`
  color: ${({theme}) => theme.colors.primary};
  margin: 0 0 ${({theme}) => theme.spacing.xs} 0;
  font-size: ${({theme}) => theme.fontSizes.large};
`;

const ProjectDescription = styled.p`
  color: ${({theme}) => `${theme.colors.text}90`};
  line-height: 1.5;
  margin: 0;
  font-size: ${({theme}) => theme.fontSizes.small};
`;

const ProjectMetaInfo = styled.div`
  grid-column: 3;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  gap: ${({theme}) => theme.spacing.xs};
  align-items: flex-end;
  min-height: 0;

  @media (max-width: 768px) {
    grid-column: 1;
    grid-row: 3;
    align-items: flex-start;
  }
`;

const ProjectTypes = styled.div`
  display: flex;
  gap: ${({theme}) => theme.spacing.xs};
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-bottom: ${({theme}) => theme.spacing.sm};

  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;

const ProjectTypeTag = styled.span<{ $type: string }>`
  padding: ${({theme}) => `2px ${theme.spacing.xs}`};
  border-radius: 4px;
  font-size: ${({theme}) => theme.fontSizes.small};
  font-weight: 500;
  background: ${({$type, theme}) => {
    switch ($type) {
      case 'personal':
        return `${theme.colors.primary}15`;
      case 'team':
        return `${theme.colors.secondary}15`;
      case 'opensource':
        return `${theme.colors.accent}15`;
      default:
        return `${theme.colors.text}15`;
    }
  }};
  color: ${({$type, theme}) => {
    switch ($type) {
      case 'personal':
        return theme.colors.primary;
      case 'team':
        return theme.colors.secondary;
      case 'opensource':
        return theme.colors.accent;
      default:
        return theme.colors.text;
    }
  }};
`;

const ProjectStatus = styled.span<{ $status: string }>`
  padding: ${({theme}) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: 16px;
  font-size: ${({theme}) => theme.fontSizes.small};
  font-weight: bold;
  background: ${({$status, theme}) =>
          $status === 'completed' ? `${theme.colors.success}20` : `${theme.colors.warning}20`
  };
  color: ${({$status, theme}) =>
          $status === 'completed' ? theme.colors.success : theme.colors.warning
  };
`;

const ProjectMeta = styled.div`
  font-size: ${({theme}) => theme.fontSizes.small};
  color: ${({theme}) => `${theme.colors.text}80`};
  text-align: right;

  > div {
    margin-bottom: ${({theme}) => theme.spacing.sm};
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    text-align: left;

    > div {
      white-space: normal;
    }
  }
`;

const RoleExpandedContainer = styled.div<{ $isExpanded: boolean }>`
  grid-column: 1 / -1;
  grid-row: 3;
  margin-top: ${({theme}) => theme.spacing.md};
  padding: ${({theme}) => theme.spacing.sm};
  background: ${({theme}) => `${theme.colors.primary}05`};
  border-radius: ${({theme}) => theme.borderRadius};
  border-left: 3px solid ${({theme}) => theme.colors.primary};

  ul {
    color: ${({theme}) => `${theme.colors.text}95`};
    padding-left: ${({theme}) => theme.spacing.sm};
    columns: 2;
    column-gap: ${({theme}) => theme.spacing.md};

    li {
      margin-bottom: ${({theme}) => theme.spacing.xs};
      line-height: 1.4;
      break-inside: avoid;
      font-size: ${({theme}) => theme.fontSizes.small};
    }
  }

  @media (max-width: 768px) {
    grid-row: 5;
    margin-top: ${({theme}) => theme.spacing.sm};

    ul {
      columns: 1;
    }
  }
`;

const ExpandableRole = styled.div`
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  .role-summary {
    display: flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
    color: ${({theme}) => `${theme.colors.text}95`};
  }


  .expand-icon {
    font-size: 12px;
    transition: transform 0.2s ease;
    color: ${({theme}) => theme.colors.primary};

    &.expanded {
      transform: rotate(90deg);
    }
  }

  @media (max-width: 768px) {
    .role-summary {
      white-space: normal;
    }
  }
`;

const TechStackSection = styled.div`
  grid-column: 1 / -1;
  grid-row: 4;
  margin-top: ${({theme}) => theme.spacing.xs};

  @media (max-width: 768px) {
    grid-column: 1;
    grid-row: 6;
    margin-top: 0;
  }
`;

const TechRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({theme}) => theme.spacing.xs};
  flex-wrap: wrap;
  gap: ${({theme}) => theme.spacing.xs};
`;

const TechLabel = styled.span`
  font-weight: bold;
  color: ${({theme}) => theme.colors.primary};
  font-size: ${({theme}) => theme.fontSizes.small};
  min-width: 100px;
`;

const TechTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({theme}) => theme.spacing.xs};
`;

const TechTag = styled.span`
  padding: ${({theme}) => `2px ${theme.spacing.xs}`};
  background: ${({theme}) => `${theme.colors.primary}15`};
  color: ${({theme}) => theme.colors.primary};
  border-radius: 4px;
  font-size: ${({theme}) => theme.fontSizes.small};
  font-weight: 500;
`;

const HighlightsSection = styled.div`
  grid-column: 1 / -1;
  grid-row: 5;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({theme}) => theme.spacing.md};
  margin-top: ${({theme}) => theme.spacing.xs};

  @media (max-width: 768px) {
    grid-column: 1;
    grid-row: 7;
    grid-template-columns: 1fr;
    margin-top: 0;
    gap: ${({theme}) => theme.spacing.sm};
  }
`;

const HighlightCategory = styled.div``;

const HighlightTitle = styled.h4`
  margin: 0 0 ${({theme}) => theme.spacing.xs} 0;
  color: ${({theme}) => theme.colors.primary};
  font-size: ${({theme}) => theme.fontSizes.small};
  font-weight: 600;
`;

const HighlightList = styled.ul`
  margin: 0;
  padding-left: ${({theme}) => theme.spacing.sm};
  color: ${({theme}) => `${theme.colors.text}80`};
`;

const HighlightItem = styled.li<{ $isCategory?: boolean }>`
  margin-bottom: ${({$isCategory}) => $isCategory ? '8px' : '6px'};
  line-height: 1.5;
  font-size: ${({theme}) => theme.fontSizes.small};
  list-style: ${({$isCategory}) => $isCategory ? 'none' : 'disc'};

  ${({$isCategory, theme}) => $isCategory && `
    background: ${theme.colors.primary}05;
    padding: 4px 8px;
    margin-left: -20px;
    margin-right: -8px;
    border-left: 3px solid ${theme.colors.primary};
    font-weight: 600;
    color: ${theme.colors.primary};
  `}
`;

// 새로운 컴포넌트: 접을 수 있는 기술 하이라이트
const CollapsibleHighlights = styled.div``;

const CategoryHeader = styled.div<{ $expanded: boolean }>`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  margin: 8px 0 4px -20px;
  background: ${({theme}) => `${theme.colors.primary}05`};
  border-left: 3px solid ${({theme}) => theme.colors.primary};
  font-weight: 600;
  color: ${({theme}) => theme.colors.primary};
  font-size: ${({theme}) => theme.fontSizes.small};
  transition: all 0.2s ease;

  &:hover {
    background: ${({theme}) => `${theme.colors.primary}10`};
  }

  .arrow {
    font-size: 10px;
    transition: transform 0.2s ease;
    transform: ${({$expanded}) => $expanded ? 'rotate(90deg)' : 'rotate(0)'};
  }

  .count {
    margin-left: auto;
    font-size: 11px;
    opacity: 0.8;
  }
`;

const CategoryItems = styled.ul<{ $show: boolean }>`
  display: ${({$show}) => $show ? 'block' : 'none'};
  padding-left: ${({theme}) => theme.spacing.sm};
  margin: 0 0 8px 0;
`;

const ProjectLinks = styled.div`
  grid-column: 1 / -1;
  grid-row: 6;
  display: flex;
  gap: ${({theme}) => theme.spacing.xs};
  flex-wrap: wrap;
  margin-top: ${({theme}) => theme.spacing.xs};

  @media (max-width: 768px) {
    grid-column: 1;
    grid-row: 8;
    margin-top: 0;
  }
`;

const ProjectLink = styled.a`
  padding: ${({theme}) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  background: ${({theme}) => theme.colors.primary};
  color: ${({theme}) => theme.colors.background};
  text-decoration: none;
  border-radius: ${({theme}) => theme.borderRadius};
  font-weight: bold;
  font-size: ${({theme}) => theme.fontSizes.small};
  transition: ${({theme}) => theme.transitions.default};

  display: flex;
  align-items: center;
  gap: ${({theme}) => theme.spacing.xs};

  &:hover {
    background: ${({theme}) => theme.colors.secondary};
    transform: translateY(-1px);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({theme}) => theme.spacing.lg};
  color: ${({theme}) => `${theme.colors.text}60`};
  font-style: italic;
  background: ${({theme}) => theme.gradients.contentBackground};
  border-radius: ${({theme}) => theme.borderRadius};
  border: 1px solid ${({theme}) => `${theme.colors.primary}20`};
`;

const RoleSummaryContainer = styled.div`
  grid-column: 1 / -1;
  grid-row: 2;

  @media (max-width: 768px) {
    grid-column: 1;
    grid-row: 4;
  }
`;

const parseHighlights = (highlights: string[]) => {
    const categories: { name: string; items: string[] }[] = [];
    let currentCategory: { name: string; items: string[] } | null = null;

    highlights.forEach(item => {
        if (item.startsWith('//')) {
            if (currentCategory !== null && currentCategory.items.length > 0) {
                categories.push(currentCategory);
            }
            currentCategory = {
                name: item.replace('//', '').trim(),
                items: []
            };
        } else if (item && currentCategory !== null) {
            currentCategory.items.push(item);
        }
    });

    if (currentCategory && currentCategory.items.length) {
        categories.push(currentCategory);
    }

    return categories;
};

// 컴포넌트: 접을 수 있는 기술 하이라이트
const TechnicalHighlights: React.FC<{
    highlights: string[];
    language: 'ko' | 'en';
}> = ({ highlights, language }) => {
    const categories = parseHighlights(highlights);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    // 카테고리가 없으면 일반 리스트로 표시
    if (categories.length === 0) {
        return (
            <HighlightList>
                {highlights.map((item, index) => (
                    <HighlightItem key={index}>{item}</HighlightItem>
                ))}
            </HighlightList>
        );
    }

    const toggleCategory = (categoryName: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryName)) {
            newExpanded.delete(categoryName);
        } else {
            newExpanded.add(categoryName);
        }
        setExpandedCategories(newExpanded);
    };

    return (
        <CollapsibleHighlights>
            {categories.map((category, index) => (
                <div key={index}>
                    <CategoryHeader
                        $expanded={expandedCategories.has(category.name)}
                        onClick={() => toggleCategory(category.name)}
                    >
                        <span className="arrow">▶</span>
                        <span>{category.name}</span>
                        <span className="count">({category.items.length})</span>
                    </CategoryHeader>
                    <CategoryItems $show={expandedCategories.has(category.name)}>
                        {category.items.map((item, itemIndex) => (
                            <HighlightItem key={itemIndex}>{item}</HighlightItem>
                        ))}
                    </CategoryItems>
                </div>
            ))}
        </CollapsibleHighlights>
    );
};

const RoleSection: React.FC<{
    project: Project;
    language: 'ko' | 'en';
}> = ({project, language}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!project.myRole) return null;

    const summary = project.myRole.summary?.[language] || project.myRole[language][0];
    const hasDetails = project.myRole[language].length > 1;

    return (
        <>
            <RoleSummaryContainer>
                <ExpandableRole onClick={() => hasDetails && setIsExpanded(!isExpanded)}>
                    <div className="role-summary">
                        <strong>Role:</strong> {summary}
                        {hasDetails && (
                            <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
                                ▶
                            </span>
                        )}
                    </div>
                </ExpandableRole>
            </RoleSummaryContainer>

            {isExpanded && hasDetails && (
                <RoleExpandedContainer $isExpanded={isExpanded}>
                    <ul>
                        {project.myRole[language].map((role, index) => (
                            <li key={index}>{role}</li>
                        ))}
                    </ul>
                </RoleExpandedContainer>
            )}
        </>
    );
};

const projects: Project[] = [
    {
        id: 1,
        imageUrl: '/images/dolphin_capture.png',
        title: {
            ko: "취향 가득 RESTful Blog",
            en: "My Tasteful RESTful Blog"
        },
        description: {
            ko: "REST API와 HATEOAS 원칙을 체험할 수 있는 블로그 프로젝트",
            en: "A blog project to experience REST API and HATEOAS principles"
        },
        techStack: {
            backend: ["Java 21", "Spring Boot 3.4", "Spring Security"],
            frontend: ["React", "TypeScript"],
            database: ["MongoDB"],
            deployment: ["Render", "Vercel", "Cloudflare R2"],
            architecture: ["CQRS", "Event-Driven"]
        },
        type: ["personal"],
        status: "completed",
        links: [
            {type: "github", url: "https://github.com/piper-hyowon/piper-trail-backend"},
            {type: "live", url: "https://piper-trail.com"}
        ],
        highlights: {
            technical: {
                ko: [
                    "JWT(Access 1시간/Refresh 3일)+ Google Authenticator 호환 TOTP 2FA 인증",
                    ": 3단계 캐싱(React-Query → HTTP Etag/Cache-Control → Caffeine),  이벤트 기반 자동 무효화",
                    "도메인 이벤트 MongoDB 저장 (Post, Comment, Admin 로그인)",
                    "스팸 방어: 키워드(0.3)·빈도(0.4)·패턴(0.3) 가중치 기반 실시간 위험도 평가",
                    "방명록 IP별 Rate Limiting (분당/시간당)",
                    "Command/Query 분리"
                ],
                en: [
                    "JWT authentication (Access: 1h / Refresh: 3d) + TOTP 2FA compatible with Google Authenticator",
                    "3-tier caching (React-Query → HTTP Etag/Cache-Control → Caffeine) with event-driven automatic invalidation",
                    "Domain events stored in MongoDB (Post, Comment, Admin login)",
                    "Spam protection: real-time risk scoring based on keyword (0.3), frequency (0.4), and pattern (0.3) weights",
                    "Rate limiting on guestbook by IP (per minute/hour)",
                    "Command/Query segregation"
                ]
            },
            service: {
                ko: [
                    "관리자 2FA (Google Authenticator 호환)",
                    "익명 댓글 (비밀번호로 삭제)",
                    "스팸 감지 (0.4점 검토, 0.7점 차단)",
                    "6종 스탬프 방명록",
                    "마크다운 포스트 작성/수정",
                    "한/영 다국어 지원",
                ],
                en: [
                    "Admin 2FA (Google Authenticator compatible)",
                    "Anonymous comments (password-based deletion)",
                    "Spam detection (review >0.4, block >0.7)",
                    "6-stamp guestbook",
                    "Markdown post create/edit",
                    "KO/EN i18n",
                ]
            }
        },
        period: {
            start: "2024-11",
            end: "2025-01"
        },
        myRole: {
            ko: ["풀스택 개발, 인프라, 기획, 3D 모델링"],
            en: ["Full-stack Development, Infrastructure, Planning, 3D Modeling"],
        }
    },
    {
        id: 2,
        imageUrl: '/images/dBtree_capture.png',
        title: {
            ko: "dBtree (디비트리)",
            en: "dBtree"
        },
        description: {
            ko: "DB 퀴즈 풀고 레몬 수확🍋 — 무료 DBaaS 플랫폼",
            en: "Solve DB quizzes to harvest lemons 🍋 — Free DBaaS service with gamification"
        },
        techStack: {
            backend: ["Go 1.24", "Kubebuilder 4.7.1"],
            frontend: ["React", "TypeScript"],
            database: ["PostgreSQL", "Redis"],
            deployment: ["K3s", "AWS EC2", "Kubernetes", "AWS SES"],
            architecture: ["Hexagonal Architecture"]
        },
        type: ["personal"],
        status: "ongoing",
        links: [
            {type: "github", url: "https://github.com/piper-hyowon/dBtree"},
            {type: "live", url: "https://www.dbtree.cloud"}
        ],
        highlights: {
            technical: {
                ko: [
                    "// Kubernetes Operator 패턴",
                    "Kubebuilder로 CRD 정의, StatefulSet/Service/PVC 라이프사이클 자동 관리",
                    "Reconciliation Loop 구현으로 DB 인스턴스 상태 관리 자동화",
                    "// 레몬 수확 동시성 제어",
                    "Redis SETNX로 유저별 퀴즈 중복 시작 방지",
                    "PostgreSQL FOR UPDATE로 레몬 행 레벨 락 → 트랜잭션 내 원자적 처리",
                    "정답 후 5초 내 가장 빠른 1명만 수확 성공 보장",
                    "// Go 표준 라이브러리 활용",
                    "외부 프레임워크 없이 net/http로 HTTP 라우터/미들웨어 체인 직접 구현",
                    "Hexagonal Architecture + main.go에서 모든 의존성 수동 주입",
                    "도메인별 커스텀 에러 타입 30개+, runtime.Caller로 호출 위치 추적",
                    "// 인스턴스 생성 트랜잭션",
                    "DB 트랜잭션으로 메타데이터 생성 + 레몬 차감 원자적 처리",
                    "K8s 리소스 생성 실패시 defer로 레몬 자동 환불",
                    "PostgreSQL UNIQUE 제약으로 NodePort(30000-31999) 안전 할당",
                    "// 스케줄러",
                    "고루틴으로 레몬 재생성(1분), 인스턴스 과금(1시간) 주기 실행"
                ],
                en: [
                    "// Kubernetes Operator Pattern",
                    "CRD with Kubebuilder, auto-manage StatefulSet/Service/PVC lifecycle",
                    "DB instance state management automation with Reconciliation Loop",
                    "// Lemon Harvest Concurrency Control",
                    "Redis SETNX prevents duplicate quiz starts per user",
                    "PostgreSQL FOR UPDATE row-level lock → atomic transaction processing",
                    "Only fastest clicker within 5s after answer wins harvest",
                    "// Go Standard Library Focus",
                    "HTTP router/middleware chain from scratch with net/http, no frameworks",
                    "Hexagonal Architecture + manual DI in main.go",
                    "30+ domain error types, call location tracking with runtime.Caller",
                    "// Instance Creation Transaction",
                    "Atomic metadata creation + lemon deduction in DB transaction",
                    "Automatic lemon refund with defer on K8s resource failure",
                    "Safe NodePort(30000-31999) allocation with PostgreSQL UNIQUE",
                    "// Scheduler",
                    "Goroutines for lemon regrowth(1min), instance billing(1hr)"
                ]
            },
            service: {
                ko: [
                    "공유 레몬 나무: 10개 위치 고정, 수확시 1시간 후 재생성, 랜덤 퀴즈 할당",
                    "수확 메커니즘: 퀴즈 정답 → 5초 내 원 클릭 → DB 트랜잭션으로 선착순 1명만 성공",
                    "인스턴스 관리: MongoDB 지원, CPU/Memory/Disk 설정, 외부 접속용 NodePort 자동 할당",
                    "과금 시스템: 시간당 레몬 차감, 부족시 일시정지, 1시간 유예 후 자동 삭제",
                    "리소스 모니터링: EC2 가용 자원 실시간 체크, 생성 가능 여부 사전 검증",
                    "보안: 초기 패스워드 1회 표시, 서버 미저장, K8s Secret 관리"
                ],
                en: [
                    "Shared Lemon Tree: 10 fixed positions, 1-hour regrowth after harvest, random quiz assignment",
                    "Harvest Mechanism: Quiz answer → Click circle in 5s → Only 1 winner via DB transaction",
                    "Instance Management: MongoDB support, CPU/Memory/Disk config, auto NodePort allocation",
                    "Billing System: Hourly lemon deduction, pause on shortage, auto-delete after 1hr grace",
                    "Resource Monitoring: Real-time EC2 resource check, pre-validation for creation",
                    "Security: One-time password display, not stored in server, K8s Secret management"
                ]
            }
        },
        period: {
            start: "2025-02"
        },
        myRole: {
            ko: ["풀스택 개발, 인프라, 기획, 3D 모델링"],
            en: ["Full-stack Development, Infrastructure, Planning, 3D Modeling"],
        }
    },
    {
        id: 3,
        imageUrl: '/images/duzzle_capture.png',
        title: {
            ko: "Duzzle (더즐)",
            en: "Duzzle"
        },
        description: {
            ko: "블록체인 기반 NFT 굿즈 플랫폼",
            en: "A blockchain-based platform where users collect NFT goods through puzzle-based gameplay"
        },
        techStack: {
            blockchain: ["Solidity", "Polygon", "Hardhat", "OpenZeppelin"],
            backend: ["TypeScript", "NestJS", "socket.io"],
            frontend: ["React", "TypeScript", "Web3Auth", "Vite"],
            database: ["PostgreSQL", "Redis"],
            deployment: ["DigitalOcean", "AWS S3", "GitHub Actions"],
        },
        type: ["team"],
        status: "completed",
        links: [
            {type: "github", url: "https://github.com/piper-hyowon/duzzle"},
            {type: "preview", url: "https://www.try-duzzle.com/"}
        ],
        highlights: {
            technical: {
                ko: [
                    "// 스마트 컨트랙트 보안 및 최적화",
                    "ERC-20/ERC-721 스마트 컨트랙트 설계 및 구현",
                    "ReentrancyGuard로 재진입 공격 방지, AccessControl로 권한 관리",
                    "시즌별 제한된 NFT 발행으로 희소성 보장",
                    "데이터 타입 최소화로 가스비 최적화",
                    "Hardhat + TypeScript 테스트 코드 작성",
                    "// P2P NFT 거래 시스템 (NFTSwap 컨트랙트)",
                    "사용자는 approve만, 실제 거래 실행은 백엔드가 안전하게 처리",
                    "상태 머신 패턴으로 거래 단계 관리 (동시 수락 방지)",
                    "// 블록체인 데이터 수집 최적화",
                    "UTC 시간대별 Cron 스케줄러로 6시간 단위 자동 전환 (24시간 무료 운영)",
                    "5초 간격 온체인 데이터 DB 동기화",
                    "// 사용자 경험",
                    "Web3Auth 소셜 로그인으로 지갑 없는 Web3 온보딩",
                    "WebSocket 기반 실시간 미니게임",
                ],
                en: [
                    "// Smart Contract Security & Optimization",
                    "ERC-20/ERC-721 smart contract design and implementation",
                    "Reentrancy attack prevention with ReentrancyGuard, permission management with AccessControl",
                    "Scarcity ensured through season-limited NFT issuance",
                    "Gas optimization through data type minimization",
                    "Hardhat + TypeScript test code implementation",
                    "// P2P NFT Trading System (NFTSwap Contract)",
                    "Users only approve, backend safely executes actual transactions",
                    "Trade phase management with state machine pattern (preventing concurrent acceptance)",
                    "// Blockchain Data Collection Optimization",
                    "Automatic switching every 6 hours with UTC-based Cron scheduler (24-hour free operation)",
                    "5-second interval on-chain data DB synchronization",
                    "// User Experience",
                    "Wallet-free Web3 onboarding with Web3Auth social login",
                    "WebSocket-based real-time mini-games",
                ]
            },
            service: {
                ko: [
                    "쉽고 재미있는 Web3 온보딩 경험 제공",
                    "스토리 메뉴를 통한 학교 관련 정보/역사 학습",
                    "랜덤 퀘스트와 협력적 퍼즐 완성, 경쟁 요소(랭킹)으로 참여 유도",
                    "시즌제 운영으로 지속적인 콘텐츠 업데이트",
                    "블록체인 기반 캠퍼스 변화 영구 아카이빙",
                    "투명한 소유권 및 거래 내역 추적"
                ],
                en: [
                    "Easy and fun Web3 onboarding experience",
                    "Learning school-related information/history through Story menu",
                    "User engagement through random quests, collaborative puzzle completion, and competitive elements (ranking)",
                    "Continuous content updates with seasonal operations",
                    "Permanent archiving of campus changes on blockchain",
                    "Transparent ownership and transaction tracking"
                ]
            }
        },
        period: {
            start: "2024-03",
            end: "2024-12"
        },
        myRole: {
            ko: [
                "// 프로젝트 리더십",
                "팀 리더로서 기술 의사결정 및 프로젝트 방향 설정",
                "프로덕트 오너 & 스크럼 마스터 역할 수행",
                "전체 프로젝트 문서화 (기획서, 설계서, 보고서, 발표 자료)",
                "// 핵심 개발 영역",
                "스마트 컨트랙트 전체 설계 및 구현",
                "백엔드 API 서버 구축 및 배포",
                "블록체인 트랜잭션 수집 시스템 개발",
                "P2P NFT 거래 시스템 구현",
                "// 기타 기여",
                "프론트엔드 블록체인/WebSocket/3D 모델 연동",
                "3D 모델링 및 NFT 메타데이터 설계",
                "인프라 구축 (DigitalOcean, AWS S3)"
            ],
            en: [
                "// Project Leadership",
                "Technical decision-making and project direction as team leader",
                "Product Owner & Scrum Master roles",
                "Complete project documentation (planning, design, reports, presentations)",
                "// Core Development Areas",
                "Full smart contract design and implementation",
                "Backend API server development and deployment",
                "Blockchain transaction collection system development",
                "P2P NFT trading system implementation",
                "// Additional Contributions",
                "Frontend blockchain/WebSocket/3D model integration",
                "3D modeling and NFT metadata design",
                "Infrastructure setup (DigitalOcean, AWS S3)"
            ],
            summary: {
                ko: "팀 리더 & 풀스택 블록체인 개발",
                en: "Team Leader & Full-stack Blockchain Developer"
            }
        }
    }];

const ProjectsPage: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<string>('all');
    const {t, language} = useLanguage();

    const getAvailableFilters = () => {
        const allTypes = new Set<string>();
        projects.forEach(project => {
            project.type.forEach(type => allTypes.add(type));
        });

        return [
            {key: 'all', label: t('projects.filter.all')},
            ...Array.from(allTypes).map(type => ({
                key: type,
                label: t(`projects.filter.${type}` as any)
            }))
        ];
    };

    const filteredProjects = activeFilter === 'all'
        ? projects
        : projects.filter(project => project.type.includes(activeFilter as any));

    const getStatusLabel = (status: string) => {
        return t(`projects.status.${status}` as any);
    };

    const getLinkLabel = (type: string) => {
        switch (type) {
            case 'github':
                return 'GitHub';
            case 'live':
                return 'Live';
            case 'preview':
                return 'Preview';
            default:
                return type;
        }
    };

    const renderTechStack = (techStack: Project['techStack']) => {
        const categoryOrder = ['backend', 'frontend', 'database', 'deployment', 'blockchain', 'architecture'];

        return categoryOrder.map(category => {
            const techs = techStack[category as keyof typeof techStack];
            if (!techs || techs.length === 0) return null;

            const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);

            return (
                <TechRow key={category}>
                    <TechLabel>{categoryLabel}:</TechLabel>
                    <TechTags>
                        {(techs as string[]).map((tech, index) => (
                            <TechTag key={index}>{tech}</TechTag>
                        ))}
                    </TechTags>
                </TechRow>
            );
        }).filter(Boolean);
    };

    return (
        <ProjectsContainer>
            <FilterContainer>
                {getAvailableFilters().map(filter => (
                    <FilterButton
                        key={filter.key}
                        $active={activeFilter === filter.key}
                        onClick={() => setActiveFilter(filter.key)}
                    >
                        {filter.label}
                    </FilterButton>
                ))}
            </FilterContainer>

            {filteredProjects.length > 0 ? (
                <ProjectsGrid>
                    {filteredProjects.map(project => (
                        <ProjectCard key={project.id}>
                            <ProjectImage $imageUrl={project.imageUrl}>
                                {!project.imageUrl && '💻'}
                            </ProjectImage>

                            <ProjectMainInfo>
                                <ProjectTitle>{project.title[language]}</ProjectTitle>
                                <ProjectDescription>{project.description[language]}</ProjectDescription>
                            </ProjectMainInfo>

                            <ProjectMetaInfo>
                                <ProjectTypes>
                                    {project.type.map(type => (
                                        <ProjectTypeTag key={type} $type={type}>
                                            {t(`projects.filter.${type}` as any)}
                                        </ProjectTypeTag>
                                    ))}
                                </ProjectTypes>
                                <ProjectStatus $status={project.status}>
                                    {getStatusLabel(project.status)}
                                </ProjectStatus>
                                <ProjectMeta>
                                    <div>
                                        <strong>Period:</strong> {project.period.start} ~ {project.period.end || t('projects.status.ongoing')}
                                    </div>
                                </ProjectMeta>
                            </ProjectMetaInfo>

                            <RoleSection project={project} language={language}/>

                            <TechStackSection>
                                {renderTechStack(project.techStack)}
                            </TechStackSection>

                            <HighlightsSection>
                                <HighlightCategory>
                                    <HighlightTitle>Technical Highlights</HighlightTitle>
                                    <TechnicalHighlights
                                        highlights={project.highlights.technical[language]}
                                        language={language}
                                    />
                                </HighlightCategory>

                                <HighlightCategory>
                                    <HighlightTitle>Service Features</HighlightTitle>
                                    <HighlightList>
                                        {project.highlights.service[language].map((highlight, index) => (
                                            <HighlightItem key={index}>{highlight}</HighlightItem>
                                        ))}
                                    </HighlightList>
                                </HighlightCategory>
                            </HighlightsSection>

                            <ProjectLinks>
                                {project.links?.map((link, index) => (
                                    <ProjectLink key={index} href={link.url} target="_blank">
                                        {link.type === 'github' && GitHubIcon}
                                        <span>{link?.label ?? getLinkLabel(link.type)}</span>
                                    </ProjectLink>
                                ))}
                            </ProjectLinks>
                        </ProjectCard>
                    ))}
                </ProjectsGrid>
            ) : (
                <EmptyState>
                    {t('projects.empty.message')}
                </EmptyState>
            )}
        </ProjectsContainer>
    );
};

export default ProjectsPage;