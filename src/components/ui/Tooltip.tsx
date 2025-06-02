import React, {useState, ReactNode} from 'react';
import styled from 'styled-components';

interface TooltipContentProps {
    $isVisible: boolean;
}

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const TooltipContent = styled.div<TooltipContentProps>`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: ${({theme}) => theme.colors.background};
  color: ${({theme}) => theme.colors.text};
  padding: ${({theme}) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({theme}) => theme.borderRadius};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: ${({theme}) => theme.fontSizes.small};
  z-index: 100;
  white-space: nowrap;
  display: ${props => (props.$isVisible ? 'block' : 'none')};
  margin-top: ${({theme}) => theme.spacing.xs};
`;

interface TooltipProps {
    children: ReactNode;
    content: string;
}

const Tooltip: React.FC<TooltipProps> = ({children, content}) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    return (
        <TooltipContainer
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            <TooltipContent $isVisible={isVisible}>{content}</TooltipContent>
        </TooltipContainer>
    );
};

export default Tooltip;