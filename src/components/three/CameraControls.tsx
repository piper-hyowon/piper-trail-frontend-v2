import React from 'react'

interface CameraControlsProps {
    onMove: (direction: 'up' | 'down' | 'left' | 'right' | 'reset') => void
    isDay?: boolean
}

const CameraControls: React.FC<CameraControlsProps> = ({onMove, isDay}) => {
    const buttonStyle = {
        backgroundColor: isDay ? 'rgba(34,197,170,0.2)' : 'rgba(59, 130, 246, 0.2)', // green-500 or blue-500 with 20% opacity
        transition: 'all 0.2s ease'
    }

    const resetButtonStyle = {
        backgroundColor: isDay ? 'rgba(34,197,154,0.4)' : 'rgba(59, 130, 246, 0.4)', // green-500 or blue-500 with 40% opacity
        transition: 'all 0.2s ease'
    }

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
        const isReset = e.currentTarget.title === '원점으로'
        e.currentTarget.style.backgroundColor = isDay
            ? `rgba(34, 197, 94, ${isReset ? 0.5 : 0.3})`
            : `rgba(59, 130, 246, ${isReset ? 0.5 : 0.3})`
    }

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
        const isReset = e.currentTarget.title === '원점으로'
        e.currentTarget.style.backgroundColor = isDay
            ? `rgba(34, 197, 94, ${isReset ? 0.4 : 0.2})`
            : `rgba(59, 130, 246, ${isReset ? 0.4 : 0.2})`
    }
    return (
        <div
            style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                zIndex: 9999,
                pointerEvents: 'auto'
            }}
        >
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4">
                <table className="border-separate border-spacing-1">
                    <tbody>
                    <tr>
                        <td></td>
                        <td>
                            <button
                                onClick={() => onMove('up')}
                                style={buttonStyle}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl font-bold active:scale-95"
                            >
                                ↑
                            </button>
                        </td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>
                            <button
                                onClick={() => onMove('left')}
                                style={buttonStyle}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl font-bold active:scale-95"
                            >
                                ←
                            </button>
                        </td>
                        <td>
                            <button
                                onClick={() => onMove('reset')}
                                style={resetButtonStyle}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-lg font-bold active:scale-95"
                                title="원점으로"
                            >
                                ⊙
                            </button>
                        </td>
                        <td>
                            <button
                                onClick={() => onMove('right')}
                                style={buttonStyle}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl font-bold active:scale-95"
                            >
                                →
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>
                            <button
                                onClick={() => onMove('down')}
                                style={buttonStyle}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl font-bold active:scale-95"
                            >
                                ↓
                            </button>
                        </td>
                        <td></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default CameraControls