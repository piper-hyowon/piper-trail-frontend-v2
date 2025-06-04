import {createGlobalStyle} from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'CatBold';
    src: url('/fonts/cat.ttf') format('truetype');
    font-display: swap;
    font-weight: bold;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    height: 100%;
    width: 100%;
    overflow-x: hidden; /* 수평 스크롤바 방지 */
  }

  body {
    font-family: 'Roboto', sans-serif;
    background-color: ${({theme}) => theme.colors.background};
    color: ${({theme}) => theme.colors.text};
    transition: background-color 0.3s ease, color 0.3s ease;
    line-height: 1.5;
    font-size: ${({theme}) => theme.fontSizes.medium};
    letter-spacing: 0.01em;
  }

  a {
    color: ${({theme}) => theme.colors.primary};
    text-decoration: none;
    transition: ${({theme}) => theme.transitions.default};

    &:hover {
      text-decoration: underline;
    }
  }

  button {
    cursor: pointer;
    font-family: 'Roboto', sans-serif;
    font-size: ${({theme}) => theme.fontSizes.medium};
    border-radius: ${({theme}) => theme.borderRadius};
    border: none;
    padding: ${({theme}) => `${theme.spacing.sm} ${theme.spacing.md}`};
    background-color: ${({theme}) => theme.colors.primary};
    color: white;
    transition: ${({theme}) => theme.transitions.default};

    &:hover {
      opacity: 0.9;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  input, select, textarea {
    font-family: 'Roboto', sans-serif;
    font-size: ${({theme}) => theme.fontSizes.medium};
    border-radius: ${({theme}) => theme.borderRadius};
    border: 2px solid ${({theme}) => `${theme.colors.primary}50`};
    padding: ${({theme}) => theme.spacing.sm};
    background-color: ${({theme}) => theme.colors.background};
    color: ${({theme}) => theme.colors.text};
    transition: ${({theme}) => theme.transitions.default};

    &:focus {
      outline: none;
      border-color: ${({theme}) => theme.colors.primary};
      box-shadow: 0 0 0 3px ${({theme}) => `${theme.colors.primary}30`};
    }
  }

  /* 기본 마진/패딩 설정 */
  h1, h2, h3, h4, h5, h6 {
    margin-bottom: ${({theme}) => theme.spacing.md};
    color: ${({theme}) => theme.colors.text};
  }

  p {
    margin-bottom: ${({theme}) => theme.spacing.md};
  }

  section {
    margin-bottom: ${({theme}) => theme.spacing.lg};
  }

  .mono {
    font-family: 'Roboto Mono', monospace;
  }
`;