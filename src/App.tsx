import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import {ThemeProvider} from './context/ThemeContext';
import {GlobalStyles} from './styles/GlobalStyles';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import {ApiProvider} from "./context/ApiContext.tsx";
import {LanguageProvider} from "./context/LanguageContext.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import PostListPage from "./pages/PostListPage.tsx";
import {BLOG_CATEGORIES} from "./config/navigation.config.ts";
import ProjectsPage from "./pages/ProjectsPage.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import PostcardsPage from "./pages/PostcardsPage.tsx";
import DolphinPage from "./pages/DolphinPage.tsx";
import {EasterEggProvider} from "./context/EasterEggDolphinContext.tsx";

const VALID_CATEGORIES = BLOG_CATEGORIES.map(e => e.name);

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            // refetchOnWindowFocus: false,
        }

    }

})

const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <LanguageProvider>
                    <EasterEggProvider>
                        <GlobalStyles/>
                        <Router>
                            <ApiProvider>
                                <Layout>
                                    <Routes>
                                        <Route path="/" element={<HomePage/>}/>

                                        {/*Static*/}
                                        <Route path="/about" element={<AboutPage/>}/>
                                        <Route path="/projects" element={<ProjectsPage/>}/>


                                        {/*Interactive*/}
                                        <Route path="/postcards" element={<PostcardsPage/>}/>
                                        <Route path="/dolphin" element={<DolphinPage/>}/>


                                        {/*Blog Category*/}
                                        {VALID_CATEGORIES.map(category => (
                                            <React.Fragment key={category}>
                                                <Route path={`/${category}`} element={<PostListPage/>}/>
                                                <Route path={`/${category}/:postSlug`} element={<PostDetailPage/>}/>
                                            </React.Fragment>
                                        ))}

                                        {/* 미분류 포스트 (null, uncategorized) */}
                                        <Route path="/null" element={<PostListPage/>}/>
                                        <Route path="/uncategorized" element={<PostListPage/>}/>
                                        <Route path="/tag/:tagName" element={<PostListPage/>}/>

                                        <Route path="/404" element={<NotFoundPage/>}/>


                                        <Route path="*" element={<Navigate to="/404" replace/>}/>
                                    </Routes>
                                </Layout>
                            </ApiProvider>
                        </Router>

                        {import.meta.env.NODE_ENV === 'development' && (
                            <ReactQueryDevtools initialIsOpen={false}/>
                        )}
                    </EasterEggProvider>
                </LanguageProvider>
            </ThemeProvider>
        </QueryClientProvider>

    );
};

export default App;