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

  /* 드래그 방지 */
  img {
    -webkit-user-drag: none; /* Webkit/Chrome/Safari */
    pointer-events: auto; /* 클릭은 가능하도록 */
  }

  /* 프로필, 로고, 장식용 이미지는 선택도 방지 */
  .logo-image,
  .profile-image,
  .decorative-image,
  .no-drag {
    -webkit-user-drag: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  /* 모바일 드래그/선택 방지 */
  @media (max-width: 768px) {
    img {
      -webkit-touch-callout: none;
    }
  }

  article img,
  .post-content img,
  .content-image {
    -webkit-user-drag: auto;
    -webkit-user-select: auto;
    -moz-user-select: auto;
    -ms-user-select: auto;
    user-select: auto;
  }

  /* 텍스트는 항상 선택 가능 */
  p, span, div, h1, h2, h3, h4, h5, h6, li, td, th {
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
  }

  /* 코드 블록 가능 */
  code, pre, .code-block {
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    -ms-user-select: text !important;
    user-select: text !important;
  }

  /* 버튼과 인터랙티브 요소 선택 방지 */
  button, a, label, select {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
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