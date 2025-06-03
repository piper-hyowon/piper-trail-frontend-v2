import React from 'react';
import styled from 'styled-components';

interface ApiLinkProps {
    method: string;
    path: string;
    title: string;
    onClick: () => void;
}

const ApiLinkContainer = styled.button<{ $method: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${({theme}) => theme.spacing.xs};
  padding: ${({theme}) => theme.spacing.xs} ${({theme}) => theme.spacing.sm};
  border-radius: ${({theme}) => theme.borderRadius};
  border: 1px solid;
  background: transparent;
  cursor: pointer;
  font-size: ${({theme}) => theme.fontSizes.small};
  font-weight: 500;
  transition: ${({theme}) => theme.transitions.default};
  text-decoration: none;

  ${({$method, theme}) => {
    switch ($method.toUpperCase()) {
      case 'GET':
        return `
          color: ${theme.colors.success || '#28a745'};
          border-color: ${theme.colors.success || '#28a745'};
          &:hover {
            background: ${theme.colors.success || '#28a745'}15;
            transform: translateY(-1px);
          }
        `;
      case 'POST':
        return `
          color: ${theme.colors.primary};
          border-color: ${theme.colors.primary};
          &:hover {
            background: ${theme.colors.primary}15;
            transform: translateY(-1px);
          }
        `;
      case 'PUT':
        return `
          color: ${theme.colors.warning || '#ffc107'};
          border-color: ${theme.colors.warning || '#ffc107'};
          &:hover {
            background: ${theme.colors.warning || '#ffc107'}15;
            transform: translateY(-1px);
          }
        `;
      case 'DELETE':
        return `
          color: ${theme.colors.error};
          border-color: ${theme.colors.error};
          &:hover {
            background: ${theme.colors.error}15;
            transform: translateY(-1px);
          }
        `;
      default:
        return `
          color: ${theme.colors.text};
          border-color: ${theme.colors.text}50;
          &:hover {
            background: ${theme.colors.text}10;
            transform: translateY(-1px);
          }
        `;
    }
  }}
  &:active {
    transform: translateY(0);
  }
`;

const MethodBadge = styled.span<{ $method: string }>`
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;

  ${({$method, theme}) => {
    switch ($method.toUpperCase()) {
      case 'GET':
        return `
          background: ${theme.colors.success || '#28a745'}20;
          color: ${theme.colors.success || '#28a745'};
        `;
      case 'POST':
        return `
          background: ${theme.colors.primary}20;
          color: ${theme.colors.primary};
        `;
      case 'PUT':
        return `
          background: ${theme.colors.warning || '#ffc107'}20;
          color: ${theme.colors.warning || '#ffc107'};
        `;
      case 'DELETE':
        return `
          background: ${theme.colors.error}20;
          color: ${theme.colors.error};
        `;
      default:
        return `
          background: ${theme.colors.text}20;
          color: ${theme.colors.text};
        `;
    }
  }}
`;

const LinkText = styled.span`
  flex: 1;
  text-align: left;
`;

const PathText = styled.code`
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.8em;
  opacity: 0.8;
  background: transparent;
  padding: 0;
  border: none;
`;

const ApiLink: React.FC<ApiLinkProps> = ({method, path, title, onClick}) => {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onClick();
    };

    return (
        <ApiLinkContainer $method={method} onClick={handleClick}>
            <MethodBadge $method={method}>{method.toUpperCase()}</MethodBadge>
            <LinkText>{title}</LinkText>
            <PathText>{path}</PathText>
        </ApiLinkContainer>
    );
};

export default ApiLink;