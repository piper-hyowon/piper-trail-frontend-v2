import React, {useState} from 'react';
import styled from 'styled-components';
import {useNavigate, useLocation} from 'react-router-dom';

interface SearchBarProps {
    className?: string;
}

const SearchWrapper = styled.form`
  background: ${({theme}) => `${theme.colors.background}E6`};
  backdrop-filter: blur(20px);
  border-radius: ${({theme}) => theme.borderRadius};
  border: 1px solid ${({theme}) => `${theme.colors.primary}30`};
  box-shadow: 0 4px 12px ${({theme}) => `${theme.colors.primary}15`};
  overflow: hidden;
  transition: ${({theme}) => theme.transitions.default};
  display: flex;
  align-items: center;
  width: 200px;
  min-width: 200px;

  &:focus-within {
    border-color: ${({theme}) => theme.colors.primary};
    box-shadow: 0 4px 20px ${({theme}) => `${theme.colors.primary}25`};
  }

  @media (max-width: 768px) {
    width: 220px;
    min-width: 200px;
  }

  @media (max-width: 480px) {
    width: 180px;
    min-width: 160px;
  }
`;

const SearchIcon = styled.div`
  color: ${({theme}) => `${theme.colors.primary}80`};
  margin-left: ${({theme}) => theme.spacing.sm};
  font-size: 0.9rem;
  flex-shrink: 0; 
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  color: ${({theme}) => theme.colors.text};
  font-size: ${({theme}) => theme.fontSizes.small};
  outline: none;
  padding: ${({theme}) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  min-width: 0;

  &::placeholder {
    color: ${({theme}) => `${theme.colors.text}60`};
  }
`;

const SearchButton = styled.button`
  background: ${({theme}) => theme.colors.primary};
  color: ${({theme}) => theme.colors.background};
  border: none;
  padding: ${({theme}) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  font-weight: 500;
  cursor: pointer;
  transition: ${({theme}) => theme.transitions.default};
  font-size: ${({theme}) => theme.fontSizes.small};
  flex-shrink: 0;
  white-space: nowrap;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    padding: ${({theme}) => `${theme.spacing.xs} ${theme.spacing.xs}`};
    font-size: 0.75rem;
  }
`;

const ClearButton = styled.button`
  color: ${({theme}) => `${theme.colors.text}60`};
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({theme}) => theme.spacing.xs};
  margin-right: ${({theme}) => theme.spacing.xs};
  flex-shrink: 0; 
  font-size: 0.9rem;

  &:hover {
    color: ${({theme}) => theme.colors.text};
  }
`;

const SearchBar: React.FC<SearchBarProps> = ({className}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // 현재 카테고리 추출
    const getCurrentCategory = () => {
        const pathOnly = location.pathname.split('?')[0];
        const pathParts = pathOnly.split('/').filter(Boolean);
        return pathParts.length > 0 ? pathParts[0] : '';
    };

    const currentCategory = getCurrentCategory();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (searchQuery.trim().length < 2) {
            return;
        }

        // /search 페이지로 이동 (카테고리와 검색어 포함)
        const searchParams = new URLSearchParams();
        searchParams.set('q', searchQuery.trim());
        searchParams.set('category', currentCategory);

        navigate(`/search?${searchParams.toString()}`);
    };

    const handleClear = () => {
        setSearchQuery('');
    };

    return (
        <SearchWrapper className={className} onSubmit={handleSubmit}>
            <SearchIcon>🔍</SearchIcon>

            <SearchInput
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            {searchQuery && (
                <ClearButton type="button" onClick={handleClear}>
                    ✕
                </ClearButton>
            )}

            <SearchButton
                type="submit"
                disabled={searchQuery.trim().length < 2}
            >
                Search
            </SearchButton>
        </SearchWrapper>
    );
};

export default SearchBar;