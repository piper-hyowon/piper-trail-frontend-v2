export interface IslandObject {
    type: 'book' | 'mailbox' | 'palmTree' | 'question' | 'donut' | 'questionMark' | 'projects' | 'dolphin' | 'lamppost';
    config: {
        position: [number, number, number];
        scale: number;
    };
}

export interface IslandConfig {
    path: string;
    name: string;
    position: [number, number, number];
    objects: IslandObject[];
}

export const islands: IslandConfig[] = [
    {
        path: '/tech',
        name: 'tech',
        position: [50, 0, 100],
        objects: [
            {
                type: 'book',
                config: {
                    position: [8, 19, 0],
                    scale: 0.3,
                },
            },
            {
                type: 'palmTree',
                config: {
                    position: [26, 3, 4],
                    scale: 4,
                },
            },
            {
                type: 'palmTree',
                config: {
                    position: [14, 3, 18],
                    scale: 4,
                },
            },
        ],
    },
    {
        path: '/projects',
        name: 'projects',
        position: [120, 0, 50],
        objects: [
            {
                type: 'projects',
                config: {
                    position: [0, 10, 0],
                    scale: 12,
                },
            },
            {
                type: 'lamppost',
                config: {
                    position: [-20, 0, -15],
                    scale: 20,
                },
            },
        ],
    },
    {
        path: '/about',
        name: 'about',
        position: [30, 0, -13],
        objects: [
            {
                type: 'questionMark',
                config: {
                    position: [0, 30, 0],
                    scale: 12,
                },
            },
            {
                type: 'palmTree',
                config: {
                    position: [-3, 2, 0],
                    scale: 0.8,
                },
            },
        ],
    },
    {
        path: '/food',
        name: 'food',
        position: [-60, 0, 120],
        objects: [
            {
                type: 'donut',
                config: {
                    position: [0, 23, 8],
                    scale: 15,
                },
            },
            {
                type: 'palmTree',
                config: {
                    position: [3, 2, -13],
                    scale: 8,
                },
            },

        ],
    },
    {
        path: '/postcards',
        name: 'postcards',
        position: [160, 0, -70],
        objects: [
            {
                type: 'mailbox',
                config: {
                    position: [10, 11, 10],
                    scale: 13,
                },
            },
            {
                type: 'palmTree',
                config: {
                    position: [14, 4, 3],
                    scale: 6,
                },
            },
            {
                type: 'palmTree',
                config: {
                    position: [-10, 4, 5],
                    scale: 10,
                },
            },
            {
                type: 'palmTree',
                config: {
                    position: [-14, 4, 9],
                    scale: 7,
                },
            },
        ],
    },
];

export const createDefaultIsland = (categoryName: string, index: number): IslandConfig => {
    const positions = [
        [-18, 0, 15],
        [18, 0, 15],
        [25, 0, 0],
        [18, 0, -15],
        [-18, 0, -15],
        [-25, 0, 0],
        [0, 0, 22],
        [0, 0, -22],
    ];

    const position = positions[index % positions.length] || [20, 0, 20];

    return {
        path: `/${categoryName.toLowerCase()}`,
        name: categoryName.toLowerCase(),
        position: position,
        objects: [

            {
                type: 'palmTree',
                config: {
                    position: [2, 2, 2],
                    scale: 0.8,
                },
            },
        ],
    };
};
