import React from 'react';
import styled from 'styled-components';

interface TagListProps {
    tags: string[];
    selectedTags?: string[];
    onTagClick?: (tag: string) => void;
}

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({theme}) => theme.spacing.xs};
  margin: ${({theme}) => theme.spacing.sm} 0;
`;

const Tag = styled.div<{ selected?: boolean }>`
  background-color: ${({theme, selected}) =>
          selected ? theme.colors.primary : `${theme.colors.primary}20`
  };
  color: ${({theme, selected}) =>
          selected ? '#ffffff' : theme.colors.text
  };
  padding: ${({theme}) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({theme}) => theme.borderRadius};
  font-size: ${({theme}) => theme.fontSizes.small};
  cursor: pointer;
  transition: ${({theme}) => theme.transitions.default};

  &:hover {
    background-color: ${({theme, selected}) =>
            selected ? theme.colors.primary : `${theme.colors.primary}40`
    };
  }
`;

const TagList: React.FC<TagListProps> = ({tags, selectedTags = [], onTagClick}) => {
    const handleTagClick = (tag: string, event: React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        if (onTagClick) {
            onTagClick(tag);
        }
    };

    return (
        <TagsContainer>
            {tags.map(tag => (
                <Tag
                    key={tag}
                    selected={selectedTags.includes(tag)}
                    onClick={(event) => handleTagClick(tag, event)}
                >
                    #{tag}
                </Tag>
            ))}
        </TagsContainer>
    );
};

export default TagList;