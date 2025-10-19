"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const Galaxy = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.autoClearColor = false;
        mountRef.current.appendChild(renderer.domElement);

        // Parameters
        const starCount = 1000;
        const innerRadius = 2;
        const outerRadius = 10;
        const positions = [];

        // Create disk galaxy stars
        const thickness = 3;
        for (let i = 0; i < starCount; i++) {
            const radius = Math.sqrt(
                Math.random() * (outerRadius ** 2 - innerRadius ** 2) + innerRadius ** 2
            );
            const angle = Math.random() * 2 * Math.PI;
            const x = radius * Math.cos(angle);
            const z = radius * Math.sin(angle);
            const y = (Math.random() - 0.5) * thickness;
            positions.push(x, y, z);
        }

        const starGeometry = new THREE.BufferGeometry();
        starGeometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(positions, 3)
        );

        const textureLoader = new THREE.TextureLoader();
        const starTexture = textureLoader.load(
            "https://threejs.org/examples/textures/sprites/circle.png"
        );

        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.05,
            map: starTexture,
            alphaTest: 0.5,
            transparent: true,
        });

        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        // Random velocities
        const starVelocities = [];
        for (let i = 0; i < starCount; i++) {
            starVelocities.push({
                x: Math.random() * 0.001 + 0.0002,
                y: 0.002 + 0.0005,
                z: Math.random() * 0.001 + 0.0002,
            });
        }

        camera.position.z = 6;

        // Animation
        const animate = () => {
            requestAnimationFrame(animate);
            renderer.setClearColor(0x000000, 0.05);

            stars.rotation.x += 0.0005;
            stars.rotation.y += 0.001;
            stars.rotation.z += 0.0005;

            const positionsAttr = starGeometry.getAttribute("position");
            for (let i = 0; i < starCount; i++) {
                const v = starVelocities[i];
                const i3 = i * 3;
                const x = positionsAttr.array[i3];
                const y = positionsAttr.array[i3 + 1];
                const z = positionsAttr.array[i3 + 2];

                const cosY = Math.cos(v.y);
                const sinY = Math.sin(v.y);
                positionsAttr.array[i3] = x * cosY - z * sinY;
                positionsAttr.array[i3 + 2] = x * sinY + z * cosY;

                const cosX = Math.cos(v.x);
                const sinX = Math.sin(v.x);
                positionsAttr.array[i3 + 1] = y * cosX - positionsAttr.array[i3 + 2] * sinX;
                positionsAttr.array[i3 + 2] = y * sinX + positionsAttr.array[i3 + 2] * cosX;

                const cosZ = Math.cos(v.z);
                const sinZ = Math.sin(v.z);
                positionsAttr.array[i3] = positionsAttr.array[i3] * cosZ - positionsAttr.array[i3 + 1] * sinZ;
                positionsAttr.array[i3 + 1] = positionsAttr.array[i3] * sinZ + positionsAttr.array[i3 + 1] * cosZ;
            }
            positionsAttr.needsUpdate = true;

            renderer.render(scene, camera);
        };

        animate();

        // Handle resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener("resize", handleResize);

        // Cleanup
        return () => {
            window.removeEventListener("resize", handleResize);
            if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
};

export default Galaxy;
