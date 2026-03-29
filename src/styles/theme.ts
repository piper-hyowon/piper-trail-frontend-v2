export type ThemeMode = 'light' | 'dark';

export interface Theme {
    zIndex: {
        footer: number;
        statusBar: number;
        navigation: number;
        modal: number;
        modalOverlay: number;
        tooltip: number;
    };
    gradients: {
        skyToTransparent: string;
        transparentToSea: string;
        seaGradient: string;
        contentBackground: string;
        purpleGradient: string;
        orangeGradient: string;
        pinkGradient: string;
        techGradient: string;
        socialGradient: string;
        seriesGradient: string;
        seriesAccent: string;
        fairyGradient: string;
        magicGradient: string;
        dreamGradient: string;
        postcardWarmGradient: string;
        postcardSoftGradient: string;
        postcardVintageGradient: string;
        bbosongGradient: string;
    };
    colors: {
        background: string;
        secondaryBackground: string;
        backgroundTertiary: string;
        surface?: string;
        text: string;
        primary: string;
        secondary: string;
        accent?: string;
        success: string;
        warning: string;
        error: string;
        purple: string;
        pink: string;
        orange: string;
        indigo: string;
        emerald: string;
        rose: string;
        commentText: {
            black: string;
            blue: string;
            red: string;
            green: string;
        };
        series: {
            primary: string;
            secondary: string;
            card: string;
            badge: string;
        };
        fairy: {
            lavender: string;
            mint: string;
            peach: string;
            sky: string;
            rose: string;
            gold: string;
        };
        postcard: {
            creamBase: string;
            warmBeige: string;
            softBrown: string;
            chocolateBrown: string;
            lightCream: string;
            cardBackground: string;
            textWarm: string;
            textSoft: string;
            accent: string;
            whale: string;
            octopus: string;
            seal: string;
            turtle: string;
            heartPink: string;
            envelope: string;
        };
        bbosong: {
            base: string;
            soft: string;
            warm: string;
            accent: string;
            muted: string;
            text: string;
            textSoft: string;
            tag: string;
            border: string;
            cardBg: string;
        };
    };

    shadows: {
        fairy: string;
        fairyGlow: string;
        magic: string;
        postcardSoft: string;
        postcardWarm: string;
        bbosongSoft: string;
    },

    seaColors: string[];
    skyColors: string[];
    borderRadius: string;
    fontSizes: {
        xxsmall: string,
        xsmall: string,
        small: string;
        medium: string;
        large: string;
        xlarge: string;
        xxlarge: string;
    };
    spacing: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
    transitions: {
        default: string;
    };
}

export const theme: Record<ThemeMode, Theme> = {
    light: {
        zIndex: {
            footer: 100,
            statusBar: 150,
            navigation: 200,
            modal: 9999,
            modalOverlay: 9998,
            tooltip: 10000,
        },
        seaColors: ['#40E0D0', 'rgba(126,206,213,0.46)', '#00CED1'],
        skyColors: ['#BBDEFB', '#FFCCBC', '#FFE0B2'],
        gradients: {
            skyToTransparent: 'linear-gradient(to top, #BBDEFB, rgba(187, 222, 251, 0.8), rgba(187, 222, 251, 0.1))',
            transparentToSea: 'linear-gradient(to bottom, rgba(126, 206, 213, 0.3), rgba(126, 206, 213, 0.6), #00CED1)',
            seaGradient: 'linear-gradient(to bottom, #7eced5, #40E0D0)',
            contentBackground: 'linear-gradient(to bottom, rgba(187, 222, 251, 0.1), rgba(255, 255, 255, 1), rgba(126, 206, 213, 0.1))',
            purpleGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            orangeGradient: 'linear-gradient(135deg, #ff9a56 0%, #ff6b6b 100%)',
            pinkGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            techGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            socialGradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            seriesGradient: 'linear-gradient(135deg, #E8B4F3 0%, #B4D4F1 50%, #D4F1E8 100%)',
            seriesAccent: 'linear-gradient(135deg, #FFD3BA 0%, #FFB5E8 50%, #D4B5FF 100%)',
            fairyGradient: 'linear-gradient(135deg, #C3B4F3 0%, #E8D4F1 25%, #F1D4E8 50%, #D4E8F1 75%, #B4F3E8 100%)',
            magicGradient: 'radial-gradient(circle at 30% 50%, rgba(255, 181, 232, 0.3) 0%, rgba(212, 181, 255, 0.3) 25%, rgba(181, 234, 255, 0.3) 50%, transparent 70%)',
            dreamGradient: 'linear-gradient(135deg, #FFEAA7 0%, #FDCB6E 25%, #FFB5E8 50%, #C7ECEE 75%, #DFE6E9 100%)',
            postcardWarmGradient: '#50b7ad',
            postcardSoftGradient: '#50b7ad',
            postcardVintageGradient: 'rgba(164,213,254,0.69)',
            bbosongGradient: 'linear-gradient(135deg, #FFF8F0 0%, #FFE8D6 50%, #FFDCC8 100%)',
        },
        colors: {
            background: '#FEFEFE',
            secondaryBackground: '#F8FFFE',
            surface: '#FFFFFF',
            backgroundTertiary: 'transparent',
            text: '#1A1A1A',
            primary: '#00B5A3',
            secondary: '#6DB4C4',
            accent: '#87CEEB',
            success: '#2E8B57',
            warning: '#D2691E',
            error: '#CD5C5C',
            purple: '#8B5FBF',
            pink: '#E91E63',
            orange: '#FF7043',
            indigo: '#5C6BC0',
            emerald: '#26A69A',
            rose: '#EC407A',
            commentText: {
                black: '#1A1A1A',
                blue: '#1E6091',
                red: '#B22222',
                green: '#228B22',
            },
            series: {
                primary: '#B4A7D6',
                secondary: '#FFD3BA',
                card: 'rgba(195, 180, 243, 0.08)',
                badge: '#C3B4F3',
            },
            fairy: {
                lavender: '#E8D4F1',
                mint: '#B4F3E8',
                peach: '#FFE5CC',
                sky: '#D4E8F1',
                rose: '#FFD1DC',
                gold: '#FFF3CD',
            },
            postcard: {
                creamBase: '#F5F0E8',
                warmBeige: '#EAE0D5',
                softBrown: '#C8B5A0',
                chocolateBrown: '#8B7355',
                lightCream: '#F8F5F0',
                cardBackground: '#FEFCF8',
                textWarm: '#6B5B4A',
                textSoft: '#8B7D6B',
                accent: '#D4A574',
                whale: '#A8A398',
                octopus: '#D4C4A8',
                seal: '#C8B5A0',
                turtle: '#B8A890',
                heartPink: '#E8C4A8',
                envelope: '#F2E8D8',
            },
            bbosong: {
                base: '#FFF8F0',        // 따뜻한 크림 베이스
                soft: '#FFE8D6',        // 부드러운 복숭아
                warm: '#FFDCC8',        // 따뜻한 살구
                accent: '#D4845A',      // 포인트 브라운-오렌지
                muted: '#E8B99A',       // 뮤트 포인트
                text: '#4A2E1A',        // 메인 텍스트 (따뜻한 다크브라운)
                textSoft: '#8B6550',    // 보조 텍스트
                tag: '#FFF0E6',         // 태그 배경
                border: '#E8C9B0',      // 테두리
                cardBg: '#FFFCFA',      // 카드 배경
            },
        },

        shadows: {
            fairy: '0 4px 20px rgba(195, 180, 243, 0.25)',
            fairyGlow: '0 0 30px rgba(232, 212, 241, 0.4)',
            magic: '0 10px 40px rgba(180, 167, 214, 0.3)',
            postcardSoft: '0 4px 20px rgba(200, 181, 160, 0.15)',
            postcardWarm: '0 8px 32px rgba(139, 115, 85, 0.12)',
            bbosongSoft: '0 4px 20px rgba(212, 132, 90, 0.12)',
        },
        borderRadius: '12px',
        fontSizes: {
            xxsmall: '9px',
            xsmall: '11px',
            small: '13px',
            medium: '15px',
            large: '17px',
            xlarge: '21px',
            xxlarge: '27px',
        },
        spacing: {
            xs: '4px',
            sm: '8px',
            md: '16px',
            lg: '24px',
            xl: '32px',
        },
        transitions: {
            default: '0.3s ease',
        },
    },
    dark: {
        zIndex: {
            footer: 100,
            statusBar: 150,
            navigation: 200,
            modal: 9999,
            modalOverlay: 9998,
            tooltip: 10000,
        },
        seaColors: ['#154459', '#206a7a', '#2a7f91'],
        skyColors: ['#0A1931', 'rgba(24,90,219,0.44)', '#5BC0BE'],
        gradients: {
            skyToTransparent: 'linear-gradient(to top, #0A1931, rgba(10, 25, 49, 0.8), rgba(10, 25, 49, 0.3))',
            transparentToSea: 'linear-gradient(to bottom, rgba(32, 106, 122, 0.3), rgba(32, 106, 122, 0.6), #206a7a)',
            seaGradient: 'linear-gradient(to bottom, #206a7a, #154459)',
            contentBackground: 'linear-gradient(to bottom, rgba(10, 25, 49, 0.15), rgba(18, 18, 18, 1), rgba(32, 106, 122, 0.15))',
            purpleGradient: 'linear-gradient(135deg, #6a5acd 0%, #9370db 100%)',
            orangeGradient: 'linear-gradient(135deg, #ff8a65 0%, #ff7043 100%)',
            pinkGradient: 'linear-gradient(135deg, #f48fb1 0%, #ec407a 100%)',
            techGradient: 'linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%)',
            socialGradient: 'linear-gradient(135deg, #66bb6a 0%, #4caf50 100%)',
            seriesGradient: 'linear-gradient(135deg, #9B88B4 0%, #7EA3C4 50%, #88C4B4 100%)',
            seriesAccent: 'linear-gradient(135deg, #D4A894 0%, #D49BC4 50%, #A894D4 100%)',
            fairyGradient: 'linear-gradient(135deg, #8B7AA3 0%, #A894B1 25%, #B194A8 50%, #94A8B1 75%, #7AA38B 100%)',
            magicGradient: 'radial-gradient(circle at 30% 50%, rgba(212, 152, 196, 0.3) 0%, rgba(168, 148, 212, 0.3) 25%, rgba(148, 186, 212, 0.3) 50%, transparent 70%)',
            dreamGradient: 'linear-gradient(135deg, #BFA06A 0%, #BA9B6E 25%, #D49BC4 50%, #97B5B7 75%, #9FA6A9 100%)',
            postcardWarmGradient: 'linear-gradient(135deg, #3A342D 0%, #4A3F35 50%, #5A4E40 100%)',
            postcardSoftGradient: 'linear-gradient(to bottom, #2D2A25 0%, #3A342D 100%)',
            postcardVintageGradient: 'radial-gradient(circle at center, #3A342D 0%, #2D2A25 70%, #252018 100%)',
            bbosongGradient: 'linear-gradient(135deg, #2A1F1A 0%, #3A2820 50%, #2E2018 100%)',
        },
        colors: {
            background: '#121212',
            secondaryBackground: '#1E1E1E',
            surface: '#2A2A2A',
            backgroundTertiary: 'transparent',
            text: '#E0E0E0',
            primary: '#4FC3F7',
            secondary: '#42A5F5',
            accent: '#80DEEA',
            success: '#4CAF50',
            warning: '#FF9800',
            error: '#F44336',
            purple: '#BA68C8',
            pink: '#F06292',
            orange: '#FF8A65',
            indigo: '#7986CB',
            emerald: '#4DB6AC',
            rose: '#F48FB1',
            commentText: {
                black: '#E0E0E0',
                blue: '#42A5F5',
                red: '#EF5350',
                green: '#66BB6A',
            },
            series: {
                primary: '#A894D4',
                secondary: '#D4A894',
                card: 'rgba(168, 148, 212, 0.12)',
                badge: '#9B88B4',
            },
            fairy: {
                lavender: '#A894B1',
                mint: '#7AA38B',
                peach: '#BFA299',
                sky: '#94A8B1',
                rose: '#BFA1AC',
                gold: '#BFB39D',
            },
            postcard: {
                creamBase: '#3A342D',
                warmBeige: '#4A3F35',
                softBrown: '#5A4E40',
                chocolateBrown: '#6B5B4A',
                lightCream: '#2D2A25',
                cardBackground: '#252018',
                textWarm: '#C8B5A0',
                textSoft: '#B8A890',
                accent: '#8B7355',
                whale: '#6B6158',
                octopus: '#8B7D6B',
                seal: '#7A6B58',
                turtle: '#6B5B4A',
                heartPink: '#9B7D6B',
                envelope: '#5A4E40',
            },
            bbosong: {
                base: '#2A1F1A',        // 다크 따뜻한 베이스
                soft: '#3A2820',        // 다크 부드러운 브라운
                warm: '#4A3228',        // 다크 따뜻한 브라운
                accent: '#E8A07A',      // 다크 포인트 (밝은 살구)
                muted: '#A06848',       // 다크 뮤트 포인트
                text: '#F0D8C8',        // 다크 메인 텍스트 (밝은 크림)
                textSoft: '#B8907A',    // 다크 보조 텍스트
                tag: '#3A2820',         // 다크 태그 배경
                border: '#5A3E30',      // 다크 테두리
                cardBg: '#231A15',      // 다크 카드 배경
            },
        },

        shadows: {
            fairy: '0 4px 20px rgba(195, 180, 243, 0.25)',
            fairyGlow: '0 0 30px rgba(232, 212, 241, 0.4)',
            magic: '0 10px 40px rgba(180, 167, 214, 0.3)',
            postcardSoft: '0 4px 20px rgba(0, 0, 0, 0.3)',
            postcardWarm: '0 8px 32px rgba(0, 0, 0, 0.4)',
            bbosongSoft: '0 4px 20px rgba(0, 0, 0, 0.35)',
        },
        borderRadius: '12px',
        fontSizes: {
            xxsmall: '9px',
            xsmall: '11px',
            small: '13px',
            medium: '15px',
            large: '17px',
            xlarge: '21px',
            xxlarge: '27px',
        },
        spacing: {
            xs: '4px',
            sm: '8px',
            md: '16px',
            lg: '24px',
            xl: '32px',
        },
        transitions: {
            default: '0.3s ease',
        },
    }
};