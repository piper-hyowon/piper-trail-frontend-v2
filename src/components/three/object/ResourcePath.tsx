import React from 'react';
import {Html} from '@react-three/drei';
import {useTheme} from '../../../context/ThemeContext';
import {theme} from '../../../styles/theme';

interface ResourcePathProps {
    path: string;
    method?: string;
    fontPath?: string;
}

const ResourcePath: React.FC<ResourcePathProps> = ({
                                                       path,
                                                       method = 'GET',
                                                   }) => {
    const {themeMode} = useTheme();

    return (
        <Html position={[0, 40, 0]} center>
            <div style={{
                color: theme[themeMode].colors.text,
                fontSize: '16px',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                padding: '8px 12px',
                background: theme[themeMode].colors.background + 'DD',
                borderRadius: '6px',
                border: `2px solid ${theme[themeMode].colors.primary}`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                backdropFilter: 'blur(4px)'
            }}>
                <span style={{color: theme[themeMode].colors.primary}}>[{method}]</span>
                <br/>
                <span>{path}</span>
            </div>
        </Html>
    );
};

export default ResourcePath;