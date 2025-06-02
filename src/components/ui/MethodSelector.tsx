import React from 'react';
import styled from 'styled-components';

interface MethodSelectorProps {
    methods: string[];
    selectedMethod: string;
    onSelect: (method: string) => void;
}

const StyledSelect = styled.select`
  background-color: ${({theme}) => theme.colors.background};
  border: 2px solid ${({theme}) => `${theme.colors.primary}50`};
  border-radius: ${({theme}) => theme.borderRadius};
  color: ${({theme}) => theme.colors.text};
  padding: ${({theme}) => `${theme.spacing.sm} ${theme.spacing.md}`};
  font-family: 'Roboto Mono', monospace;
  width: 110px;

  &:focus {
    border-color: ${({theme}) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({theme}) => `${theme.colors.primary}30`};
    outline: none;
  }
`;

const MethodSelector: React.FC<MethodSelectorProps> = ({methods, selectedMethod, onSelect}) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onSelect(e.target.value);
    };

    return (
        <StyledSelect value={selectedMethod} onChange={handleChange}>
            {methods.map(method => (
                <option key={method} value={method}>{method}</option>
            ))}
        </StyledSelect>
    );
};

export default MethodSelector;