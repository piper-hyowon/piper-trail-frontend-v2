import React from 'react';
import styled from 'styled-components';

interface PaginationProps {
    currentPage: number; // 0-based from backend
    totalPages: number;
    onPageChange: (page: number) => void; // expects 0-based page
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
  cursor: pointer;
  transition: all 0.2s ease;

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

const PageInfo = styled.span`
  color: ${({theme}) => theme.colors.text};
  font-size: ${({theme}) => theme.fontSizes.small};
  margin: 0 ${({theme}) => theme.spacing.sm};
`;

const Pagination: React.FC<PaginationProps> = ({
                                                   currentPage, // 0-based
                                                   totalPages,
                                                   onPageChange
                                               }) => {
    // 0-based를 1-based로 변환해서 표시
    const displayCurrentPage = currentPage + 1;

    const getPageButtons = () => {
        const buttons = [];

        // 표시할 페이지 범위 계산 (1-based)
        let startPage = Math.max(1, displayCurrentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);

        // 끝에서 5페이지가 안되면 시작점 조정
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        // 첫 페이지가 시작점보다 크면 첫 페이지와 ... 추가
        if (startPage > 1) {
            buttons.push(
                <PageButton
                    key={1}
                    $active={displayCurrentPage === 1}
                    onClick={() => onPageChange(0)} // 0-based로 전달
                >
                    1
                </PageButton>
            );

            if (startPage > 2) {
                buttons.push(
                    <PageInfo key="start-ellipsis">...</PageInfo>
                );
            }
        }

        // 중간 페이지들
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <PageButton
                    key={i}
                    $active={i === displayCurrentPage}
                    onClick={() => onPageChange(i - 1)} // 0-based로 전달
                >
                    {i}
                </PageButton>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                buttons.push(
                    <PageInfo key="end-ellipsis">...</PageInfo>
                );
            }

            buttons.push(
                <PageButton
                    key={totalPages}
                    $active={displayCurrentPage === totalPages}
                    onClick={() => onPageChange(totalPages - 1)} // 0-based로 전달
                >
                    {totalPages}
                </PageButton>
            );
        }

        return buttons;
    };

    if (totalPages <= 1) {
        return null;
    }

    return (
        <PaginationContainer>
            <PageButton
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
                title="Previous page"
            >
                &lt;
            </PageButton>

            {getPageButtons()}

            <PageButton
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                title="Next page"
            >
                &gt;
            </PageButton>
        </PaginationContainer>
    );
};

export default Pagination;