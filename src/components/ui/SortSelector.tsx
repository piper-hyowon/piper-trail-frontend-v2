import React from 'react';
import styled from 'styled-components';

interface SortOption {
    value: string;
    label: string;
}

interface SortSelectorProps {
    options: SortOption[];
    currentSort: string;
    onSortChange: (sort: string) => void;
}

const SortContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({theme}) => theme.spacing.sm};
`;

const SortLabel = styled.span`
  font-weight: bold;
  color: ${({theme}) => theme.colors.text};
  font-size: ${({theme}) => theme.fontSizes.xsmall};
`;

const Select = styled.select`
  background-color: ${({theme}) => theme.colors.background};
  border: 2px solid ${({theme}) => `${theme.colors.primary}30`};
  border-radius: ${({theme}) => theme.borderRadius};
  color: ${({theme}) => theme.colors.text};
  padding: ${({theme}) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  font-size: ${({theme}) => theme.fontSizes.xsmall};


  &:focus {
    border-color: ${({theme}) => theme.colors.primary};
    outline: none;
  }
`;

const SortSelector: React.FC<SortSelectorProps> = ({
                                                       options,
                                                       currentSort,
                                                       onSortChange
                                                   }) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onSortChange(e.target.value);
    };

    return (
        <SortContainer>
            <SortLabel>Sort by:</SortLabel>
            <Select value={currentSort} onChange={handleChange}>
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </Select>
        </SortContainer>
    );
};

export default SortSelector;