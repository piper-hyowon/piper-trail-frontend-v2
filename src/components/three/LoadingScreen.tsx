import {Html} from '@react-three/drei';

export const CanvasLoadingScreen = () => (
    <Html center>
        <div className="text-center text-white">
            <img
                src="/images/cartoon-snail-loading.gif"
                alt="loading"
                width={500}
                height={500}
                className="object-contain"
                style={{ width: '500px', height: '500px' }}
            />
        </div>
    </Html>
);