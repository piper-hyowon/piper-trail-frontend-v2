import React from 'react';
import styled from 'styled-components';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({theme}) => theme.spacing.sm};
  margin: ${({theme}) => theme.spacing.lg} 0;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  min-width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({theme, $active}) =>
          $active ? theme.colors.primary : theme.colors.background
  };
  color: ${({theme, $active}) =>
          $active ? '#ffffff' : theme.colors.text
  };
  border: 2px solid ${({theme, $active}) =>
          $active ? theme.colors.primary : `${theme.colors.primary}30`
  };
  border-radius: ${({theme}) => theme.borderRadius};
  font-weight: ${({$active}) => $active ? 'bold' : 'normal'};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: ${({theme, $active}) =>
            $active ? theme.colors.primary : `${theme.colors.primary}20`
    };
  }
`;

const Pagination: React.FC<PaginationProps> = ({
                                                   currentPage,
                                                   totalPages,
                                                   onPageChange
                                               }) => {
    const getPageButtons = () => {
        const buttons = [];

        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);

        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <PageButton
                    key={i}
                    $active={i === currentPage}
                    onClick={() => onPageChange(i)}
                >
                    {i}
                </PageButton>
            );
        }

        return buttons;
    };

    return (
        <PaginationContainer>
            <PageButton
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                &lt;
            </PageButton>

            {getPageButtons()}

            <PageButton
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                &gt;
            </PageButton>
        </PaginationContainer>
    );
};

export default Pagination;