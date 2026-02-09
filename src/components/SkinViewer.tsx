import React, { useRef, useEffect } from 'react';
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
    height = 400
}) => {
    const viewerRef = useRef<SkinViewerInstance | null>(null);

    useEffect(() => {
        if (viewerRef.current && viewMode === 'full-body') {
            const viewer = viewerRef.current;
            const poseData = POSES[pose] || POSES.standing;

            // Apply static pose
            viewer.animation = null;

            // Configure camera for full body centered view
            viewer.zoom = 0.9;
            viewer.camera.position.set(0, 5, 45);
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
    }, [pose, viewMode]);

    // Render 2D head view
    if (viewMode === 'head-2d') {
        let displayUrl = skinUrl;

        if (skinUrl.includes('mc-heads.net/skin/')) {
            const part = skinUrl.split('/').pop();
            displayUrl = `https://minotar.net/helm/${part}/400`;
        }

        return (
            <div
                style={{ width, height }}
                className="flex items-center justify-center bg-transparent overflow-hidden"
            >
                <img
                    src={displayUrl}
                    alt="Skin Head"
                    className="max-w-full max-h-full transition-all duration-500 hover:scale-110 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
                    style={{ imageRendering: 'pixelated' }}
                />
            </div>
        );
    }

    // Render 3D full-body view
    return (
        <Skinview3d
            skinUrl={skinUrl}
            height={height}
            width={width}
            onReady={({ viewer }) => {
                viewerRef.current = viewer;
                // Trigger pose application after viewer is ready
                const poseData = POSES[pose] || POSES.standing;
                viewer.animation = null;
                viewer.zoom = 0.9;
                viewer.camera.position.set(0, 5, 45);
                viewer.controls.target.set(0, 10, 0);

                if (viewer.playerObject?.skin) {
                    const skin = viewer.playerObject.skin;
                    skin.head.rotation.set(...poseData.head);
                    skin.leftArm.rotation.set(...poseData.leftArm);
                    skin.rightArm.rotation.set(...poseData.rightArm);
                    skin.leftLeg.rotation.set(...poseData.leftLeg);
                    skin.rightLeg.rotation.set(...poseData.rightLeg);
                }
            }}
            options={{
                model: model === 'slim' ? 'slim' : 'default',
                zoom: 0.9,
                enableControls: true,
                preserveDrawingBuffer: true, // Required for screenshot/export
            }}
        />
    );
};

export default SkinViewer;
