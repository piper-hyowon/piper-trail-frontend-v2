import React from 'react'

interface CameraControlsProps {
    onMove: (direction: 'up' | 'down' | 'left' | 'right' | 'reset') => void
    isDay?: boolean
}

const CameraControls: React.FC<CameraControlsProps> = ({onMove, isDay}) => {
    const buttonStyle = {
        backgroundColor: isDay ? 'rgba(34,197,170,0.2)' : 'rgba(59, 130, 246, 0.2)',
        transition: 'all 0.2s ease'
    }

    const resetButtonStyle = {
        backgroundColor: isDay ? 'rgba(34,197,154,0.4)' : 'rgba(59, 130, 246, 0.4)',
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
                bottom: '70px',
                right: '20px',
                zIndex: 10,
                pointerEvents: 'auto'
            }}
        >
            <div
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    backdropFilter: 'blur(4px)',
                    borderRadius: '16px',
                    padding: '12px'
                }}
            >
                <table style={{borderSpacing: '4px'}}>
                    <tbody>
                    <tr>
                        <td></td>
                        <td>
                            <button
                                onClick={() => onMove('up')}
                                style={{
                                    ...buttonStyle,
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    border: 'none',
                                    cursor: 'pointer',
                                    outline: 'none'
                                }}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
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
                                style={{
                                    ...buttonStyle,
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    border: 'none',
                                    cursor: 'pointer',
                                    outline: 'none'
                                }}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                ←
                            </button>
                        </td>
                        <td>
                            <button
                                onClick={() => onMove('reset')}
                                style={{
                                    ...resetButtonStyle,
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    border: 'none',
                                    cursor: 'pointer',
                                    outline: 'none'
                                }}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                title="원점으로"
                            >
                                ⊙
                            </button>
                        </td>
                        <td>
                            <button
                                onClick={() => onMove('right')}
                                style={{
                                    ...buttonStyle,
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    border: 'none',
                                    cursor: 'pointer',
                                    outline: 'none'
                                }}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
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
                                style={{
                                    ...buttonStyle,
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    border: 'none',
                                    cursor: 'pointer',
                                    outline: 'none'
                                }}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
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