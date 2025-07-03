import React from 'react';
import styled from 'styled-components';

interface TagListProps {
    tags: string[];
    selectedTags?: string[];
    onTagClick?: (tag: string) => void;
    maxVisible?: number;
    variant?: 'default' | 'subtle';
}

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px; // 간격 줄임
  margin: ${({theme}) => theme.spacing.xs} 0;
  align-items: center;
`;

// Subtle 버전 태그 (리스트용)
const Tag = styled.div<{ selected?: boolean; $variant?: string }>`
  background-color: ${({theme, selected, $variant}) => {
    if ($variant === 'subtle') {
      return selected
              ? `${theme.colors.primary}20`
              : `${theme.colors.text}08`;
    }
    return selected
            ? theme.colors.primary
            : `${theme.colors.primary}20`;
  }};

  color: ${({theme, selected, $variant}) => {
    if ($variant === 'subtle') {
      return selected
              ? theme.colors.primary
              : `${theme.colors.text}70`;  // 70% 불투명도
    }
    return selected ? '#ffffff' : theme.colors.text;
  }};

  padding: ${({theme, $variant}) =>
          $variant === 'subtle'
                  ? '2px 8px'  // 더 작은 패딩
                  : `${theme.spacing.xs} ${theme.spacing.sm}`
  };

  border-radius: 10px;
  font-size: ${({theme, $variant}) =>
          $variant === 'subtle'
                  ? theme.fontSizes.xxsmall  // 더 작은 폰트
                  : theme.fontSizes.small
  };
  font-weight: ${({$variant}) => $variant === 'subtle' ? 500 : 400};
  cursor: pointer;
  transition: ${({theme}) => theme.transitions.default};
  white-space: nowrap;

  border: 1px solid ${({theme, selected, $variant}) => {
    if ($variant === 'subtle') {
      return selected
              ? `${theme.colors.primary}30`
              : 'transparent';
    }
    return 'transparent';
  }};

  &:hover {
    background-color: ${({theme, selected, $variant}) => {
      if ($variant === 'subtle') {
        return `${theme.colors.primary}15`;
      }
      return selected
              ? theme.colors.primary
              : `${theme.colors.primary}40`;
    }};

    color: ${({theme, $variant}) =>
            $variant === 'subtle' ? theme.colors.primary : 'inherit'
    };

    transform: translateY(-1px);
  }
`;

const MoreTag = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  font-size: ${({theme}) => theme.fontSizes.xxsmall};
  color: ${({theme}) => theme.colors.text};
  opacity: 0.5;
  font-weight: 600;
  cursor: pointer;
  transition: opacity ${({theme}) => theme.transitions.default};

  &:hover {
    opacity: 0.8;
  }
`;

const TagList: React.FC<TagListProps> = ({
                                             tags,
                                             selectedTags = [],
                                             onTagClick,
                                             maxVisible = tags.length,  // 기본값: 모든 태그 표시
                                             variant = 'default'
                                         }) => {
    const handleTagClick = (tag: string, event: React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        if (onTagClick) {
            onTagClick(tag);
        }
    };

    const visibleTags = tags.slice(0, maxVisible);
    const remainingCount = tags.length - maxVisible;

    return (
        <TagsContainer>
            {visibleTags.map(tag => (
                <Tag
                    key={tag}
                    selected={selectedTags.includes(tag)}
                    $variant={variant}
                    onClick={(event) => handleTagClick(tag, event)}
                >
                    #{tag}
                </Tag>
            ))}
            {remainingCount > 0 && (
                <MoreTag
                    onClick={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        // 필요시 전체 태그 보기 기능 추가
                    }}
                >
                    +{remainingCount}
                </MoreTag>
            )}
        </TagsContainer>
    );
};

export default TagList;