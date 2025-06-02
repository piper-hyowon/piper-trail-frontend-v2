import React, {useEffect} from 'react';
import styled from 'styled-components';
import {Card, CardTitle} from '../components/ui/Card';
import {useApi} from "../context/ApiContext";
import ThreeJsVisualization from "../components/three/ThreeJsVisualization.tsx";
import {ALL_CATEGORIES, ALL_CATEGORY_NAMES} from "../config/navigation.config";

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({theme}) => theme.spacing.lg};
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({theme}) => theme.spacing.md};
`;

const CategoryDescription = styled.p`
  color: ${({theme}) => theme.colors.text};
  margin-bottom: ${({theme}) => theme.spacing.md};
`;

const ApiLinkText = styled.div`
  font-family: 'Roboto Mono', monospace;
  color: ${({theme}) => theme.colors.secondary};
  margin-top: ${({theme}) => theme.spacing.sm};
`;

const ThreeJsContainer = styled.div`
  height: 700px;
  width: 100vw;
  margin: calc(-${({theme}) => theme.spacing.lg}) 0 calc(-${({theme}) => theme.spacing.lg}) 50%;
  transform: translateX(-50%);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
`;

const HomePage: React.FC = () => {
    const {acceptHeader, navigateTo, setAcceptHeader} = useApi();

    useEffect(() => {
        setAcceptHeader('text/html');
    }, [setAcceptHeader]);

    const is3DView = acceptHeader === 'text/html';

    const handleCategoryClick = (category: string) => {
        console.log('Category clicked:', category);
        navigateTo(`/${category}`);
    };

    return (
        <HomeContainer>
            {is3DView ? (
                <ThreeJsContainer>
                    <ThreeJsVisualization
                        categories={ALL_CATEGORY_NAMES.filter(e => e !== 'home')}
                        onIslandClick={handleCategoryClick}
                    />
                </ThreeJsContainer>
            ) : (
                <CategoriesGrid>
                    {ALL_CATEGORIES.map((category) => (
                        <Card key={category.name}
                              onClick={() => handleCategoryClick(category.name)}>
                            <CardTitle>{category.icon} {category.name}</CardTitle>
                            <CategoryDescription>{category.description}</CategoryDescription>
                            <ApiLinkText>/{category.name}</ApiLinkText>
                        </Card>
                    ))}
                </CategoriesGrid>
            )}
        </HomeContainer>
    );
};

export default HomePage;