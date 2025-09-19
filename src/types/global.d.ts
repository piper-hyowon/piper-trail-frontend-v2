declare global {
    interface Window {
        prerenderReady: boolean;
        dataLayer: any[];
        gtag: (...args: any[]) => void;
        fs?: {
            readFile: (filepath: string, options?: { encoding?: string }) => Promise<any>;
        };
    }
}

export {};