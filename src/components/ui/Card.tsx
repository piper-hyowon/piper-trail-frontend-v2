import styled from 'styled-components';

export const Card = styled.div`
  background-color: ${({theme}) => theme.colors.background};
  border: 2px solid ${({theme}) => `${theme.colors.primary}30`};
  border-radius: ${({theme}) => theme.borderRadius};
  padding: ${({theme}) => theme.spacing.lg};
  margin-bottom: ${({theme}) => theme.spacing.md};
  transition: ${({theme}) => theme.transitions.default};

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    border-color: ${({theme}) => theme.colors.primary};
  }
`;

export const CardTitle = styled.h2`
  color: ${({theme}) => theme.colors.primary};
  margin-bottom: ${({theme}) => theme.spacing.sm};
  font-size: ${({theme}) => theme.fontSizes.large};
`;

export const CardContent = styled.div`
  margin-bottom: ${({theme}) => theme.spacing.md};
`;

export const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({theme}) => theme.spacing.md};
  padding-top: ${({theme}) => theme.spacing.sm};
  border-top: 1px solid ${({theme}) => `${theme.colors.primary}30`};
`;