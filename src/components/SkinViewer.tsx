import React, { useRef, useEffect } from 'react';
import { ReactSkinview3d as Skinview3d } from 'react-skinview3d';
import { WalkingAnimation, RunningAnimation, IdleAnimation } from 'skinview3d';
import type { SkinViewer as SkinViewerInstance } from 'skinview3d';

interface SkinViewerProps {
    skinUrl: string;
    model: 'classic' | 'slim';
    animation: 'idle' | 'walk' | 'run' | 'none';
    width?: number;
    height?: number;
}

const SkinViewer: React.FC<SkinViewerProps> = ({
    skinUrl,
    model,
    animation,
    width = 300,
    height = 400
}) => {
    const viewerRef = useRef<SkinViewerInstance | null>(null);

    useEffect(() => {
        if (viewerRef.current) {
            // Set selected animation (replaces previous one)
            switch (animation) {
                case 'walk':
                    viewerRef.current.animation = new WalkingAnimation();
                    break;
                case 'run':
                    viewerRef.current.animation = new RunningAnimation();
                    break;
                case 'idle':
                    viewerRef.current.animation = new IdleAnimation();
                    break;
                case 'none':
                default:
                    viewerRef.current.animation = null;
                    break;
            }
        }
    }, [animation]);

    return (
        <Skinview3d
            skinUrl={skinUrl}
            height={height}
            width={width}
            onReady={({ viewer }) => {
                viewerRef.current = viewer;
            }}
            options={{
                model: model === 'slim' ? 'slim' : 'default',
                zoom: 1.0,
                enableControls: true,
            }}
        />
    );
};

export default SkinViewer;
