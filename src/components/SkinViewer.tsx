import React, { useState, useEffect } from 'react';
import { ReactSkinview3d as Skinview3d } from 'react-skinview3d';
import type { SkinViewer as SkinViewerInstance } from 'skinview3d';

import type { ViewMode, PoseType } from '../hooks/useSkin';

interface SkinViewerProps {
    skinUrl: string;
    model: 'classic' | 'slim';
    pose: PoseType;
    viewMode: ViewMode;
    width?: number;
    height?: number;
    zoom?: number;
    headScale?: number;
    headOffsetX?: number;
    headOffsetY?: number;
    bodyOffsetX?: number;
    bodyOffsetY?: number;
    cameraDistance?: number;
}

// Static pose configurations (rotation values in radians)
const POSES: Record<PoseType, {
    head: [number, number, number];
    leftArm: [number, number, number];
    rightArm: [number, number, number];
    leftLeg: [number, number, number];
    rightLeg: [number, number, number];
}> = {
    standing: {
        head: [0, 0, 0],
        leftArm: [0, 0, 0],
        rightArm: [0, 0, 0],
        leftLeg: [0, 0, 0],
        rightLeg: [0, 0, 0],
    },
    waving: {
        head: [0, 0.2, 0],
        leftArm: [0.1, 0, 0.1],
        rightArm: [-2.5, 0, -0.3],  // Arm raised up waving
        leftLeg: [0, 0, 0],
        rightLeg: [0.1, 0, 0],
    },
    jumping: {
        head: [-0.2, 0, 0],  // Looking up
        leftArm: [-0.8, 0, -0.5],  // Arms up
        rightArm: [-0.8, 0, 0.5],
        leftLeg: [0.3, 0, 0],
        rightLeg: [-0.3, 0, 0],
    },
    pointing: {
        head: [0, 0.4, 0],
        leftArm: [0, 0, 0.1],
        rightArm: [-1.5, 0, 0],  // Arm pointing forward
        leftLeg: [0, 0, 0],
        rightLeg: [0.15, 0, 0],
    },
    crossed: {
        head: [0.1, 0, 0],
        leftArm: [-1.2, 0, 0.8],  // Arms crossed
        rightArm: [-1.2, 0, -0.8],
        leftLeg: [0, 0, 0.15],
        rightLeg: [0, 0, -0.15],
    },
    relaxed: {
        head: [0.1, 0.15, 0],
        leftArm: [0.15, 0, 0.15],
        rightArm: [0.15, 0, -0.15],
        leftLeg: [0, 0, 0.1],
        rightLeg: [0.2, 0, -0.1],
    },
};

const SkinViewer: React.FC<SkinViewerProps> = ({
    skinUrl,
    model,
    pose,
    viewMode,
    width = 300,
    height = 400,
    zoom = 2.9,
    headScale = 1.0,
    headOffsetX = 0,
    headOffsetY = 0,
    bodyOffsetX = 0,
    bodyOffsetY = 0,
    cameraDistance = 30
}) => {
    const [viewer, setViewer] = useState<SkinViewerInstance | null>(null);

    useEffect(() => {
        if (viewer && viewMode === 'full-body') {
            const poseData = POSES[pose] || POSES.standing;

            // Apply static pose
            viewer.animation = null;

            // Configure camera
            viewer.zoom = zoom;
            viewer.controls.enableZoom = true; // Enable interactive zoom again
            viewer.camera.position.set(0, 10, cameraDistance);
            viewer.controls.target.set(0, 10, 0);
            viewer.controls.autoRotate = false;
            viewer.controls.enableRotate = true;

            // Apply pose to player model parts
            if (viewer.playerObject) {
                const skin = viewer.playerObject.skin;
                if (skin) {
                    skin.head.rotation.set(...poseData.head);
                    skin.leftArm.rotation.set(...poseData.leftArm);
                    skin.rightArm.rotation.set(...poseData.rightArm);
                    skin.leftLeg.rotation.set(...poseData.leftLeg);
                    skin.rightLeg.rotation.set(...poseData.rightLeg);
                }
            }
        }
    }, [pose, viewMode, zoom, viewer, cameraDistance]);

    // Render 2D head view
    if (viewMode === 'head-2d') {
        let displayUrl = skinUrl;

        if (skinUrl.includes('mc-heads.net/skin/')) {
            const part = skinUrl.split('/').pop();
            displayUrl = `https://minotar.net/helm/${part}/400`;
        }

        return (
            <div
                style={{
                    width,
                    height,
                    transform: `translate(${headOffsetX}px, ${headOffsetY}px)`
                }}
                className="flex items-center justify-center bg-transparent overflow-hidden transition-transform duration-300"
            >
                <img
                    src={displayUrl}
                    alt="Skin Head"
                    className="max-w-full max-h-full transition-all duration-500 hover:scale-110 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
                    style={{
                        imageRendering: 'pixelated',
                        transform: `scale(${headScale})`
                    }}
                />
            </div>
        );
    }

    // Render 3D full-body view
    return (
        <div style={{ transform: `translate(${bodyOffsetX}px, ${bodyOffsetY}px)` }} className="transition-transform duration-300">
            <Skinview3d
                skinUrl={skinUrl}
                height={height}
                width={width}
                onReady={({ viewer }) => {
                    setViewer(viewer);
                    // Initial setup
                    viewer.controls.enableZoom = true;
                    viewer.zoom = zoom;
                    viewer.camera.position.set(0, 10, cameraDistance);
                }}
                options={{
                    model: model === 'slim' ? 'slim' : 'default',
                    zoom: zoom,
                    enableControls: true,
                    preserveDrawingBuffer: true,
                }}
            />
        </div>
    );
};

export default SkinViewer;
