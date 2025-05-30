import React from 'react';
import styled from 'styled-components';
import type {Theme} from "../../styles/theme.ts";
import {useLanguage} from "../../context/LanguageContext.tsx";

interface ToggleButtonProps {
    theme: Theme
}

const ToggleButton = styled.button<ToggleButtonProps>`
  background: none;
  border: 1px solid ${({theme}) => theme.colors.primary}40;
  border-radius: ${({theme}) => theme.borderRadius};
  padding: ${({theme}) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  color: ${({theme}) => theme.colors.primary};
  cursor: pointer;
  transition: ${({theme}) => theme.transitions.default};
  font-size: ${({theme}) => theme.fontSizes.small};

  &:hover {
    background-color: ${({theme}) => `${theme.colors.secondary}20`};
  }
`;

const LanguageToggle: React.FC = () => {
    const {language, toggleLanguage} = useLanguage();

    return (
        <ToggleButton onClick={toggleLanguage}>
            {language === 'en' ? '한국어' : 'English'}
        </ToggleButton>
    );
};

export default LanguageToggle;