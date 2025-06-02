import React, {KeyboardEvent} from 'react';
import styled from 'styled-components';

interface UrlInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    suggestions?: string[];
}

const InputContainer = styled.div`
  flex: 1;
  position: relative;
`;

const StyledInput = styled.input`
  width: 100%;
  background-color: ${({theme}) => theme.colors.background};
  border: 2px solid ${({theme}) => `${theme.colors.primary}50`};
  border-radius: ${({theme}) => theme.borderRadius};
  color: ${({theme}) => theme.colors.text};
  padding: ${({theme}) => `${theme.spacing.sm} ${theme.spacing.md}`};
  font-family: 'Roboto Mono', monospace;

  &:focus {
    border-color: ${({theme}) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({theme}) => `${theme.colors.primary}30`};
    outline: none;
  }
`;

const SuggestionsContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${({theme}) => theme.colors.background};
  border: 1px solid ${({theme}) => theme.colors.primary};
  border-radius: ${({theme}) => theme.borderRadius};
  margin-top: ${({theme}) => theme.spacing.xs};
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
`;

const SuggestionItem = styled.div`
  padding: ${({theme}) => `${theme.spacing.sm} ${theme.spacing.md}`};
  cursor: pointer;

  &:hover {
    background-color: ${({theme}) => `${theme.colors.secondary}30`};
  }
`;

const UrlInput: React.FC<UrlInputProps> = ({value, onChange, onSubmit, suggestions = []}) => {
    const [showSuggestions, setShowSuggestions] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
        setShowSuggestions(true);
    };

    // 엔터 키
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onSubmit();
            setShowSuggestions(false);
        }
    };

    // 자동완성 제안 클릭 시
    const handleSuggestionClick = (suggestion: string) => {
        onChange(suggestion);
        setShowSuggestions(false);
        // 잠시 후 제출 (상태 업데이트가 반영되도록)
        setTimeout(onSubmit, 10);
    };

    // 포커스를 잃었을 때
    const handleBlur = () => {
        // 클릭 이벤트가 발생할 시간을 주기 위해 지연
        setTimeout(() => setShowSuggestions(false), 200);
    };

    // 현재 입력값에 맞게 필터링
    const filteredSuggestions = suggestions.filter(
        suggestion => suggestion.toLowerCase().includes(value.toLowerCase())
    );

    return (
        <InputContainer>
            <StyledInput
                type="text"
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggestions(true)}
                onBlur={handleBlur}
                placeholder="Enter URL path"
            />

            {showSuggestions && filteredSuggestions.length > 0 && (
                <SuggestionsContainer>
                    {filteredSuggestions.map((suggestion, index) => (
                        <SuggestionItem
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            {suggestion}
                        </SuggestionItem>
                    ))}
                </SuggestionsContainer>
            )}
        </InputContainer>
    );
};

export default UrlInput;