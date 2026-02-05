import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import './IntroAnimation.css';

const IntroAnimation = ({ onComplete, enableSkip = true }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const cubeGroupRef = useRef(null);
  const trianglesRef = useRef([]);
  const animationIdRef = useRef(null);
  const [showButton, setShowButton] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(true);

  // Brand colors
  const CORP_COLORS = [
    0xFF007F, // Fuchsia (Front)
    0x40E0D0, // Turquoise (Back)
    0x007FFF, // Bright blue (Top)
    0xFFA500, // Orange (Bottom)
    0xFF0000, // Red (Right)
    0x40E0D0  // Turquoise (Left)
  ];

  // Create a pyramid (tetrahedron)
  const createPyramid = (color) => {
    const geometry = new THREE.ConeGeometry(1.0, 2.0, 4);
    const material = new THREE.MeshStandardMaterial({
      color: color,
      metalness: 0.3,
      roughness: 0.4,
      emissive: color,
      emissiveIntensity: 0.2
    });
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  };

  // Create the cube formed by 6 pyramids
  const createCube = () => {
    const cubeGroup = new THREE.Group();
    const triangles = [];

    // Initial positions of the 6 pyramids to form a cube
    const positions = [
      new THREE.Vector3(0, 0, 1.0),   // Front
      new THREE.Vector3(0, 0, -1.0),  // Back
      new THREE.Vector3(0, 1.0, 0),   // Top
      new THREE.Vector3(0, -1.0, 0),  // Bottom
      new THREE.Vector3(1.0, 0, 0),    // Right
      new THREE.Vector3(-1.0, 0, 0),  // Left
    ];

    const rotations = [
      new THREE.Euler(0, 0, 0),           // Front
      new THREE.Euler(0, Math.PI, 0),     // Back
      new THREE.Euler(-Math.PI / 2, 0, 0), // Top
      new THREE.Euler(Math.PI / 2, 0, 0),  // Bottom
      new THREE.Euler(0, -Math.PI / 2, 0), // Right
      new THREE.Euler(0, Math.PI / 2, 0),  // Left
    ];

    CORP_COLORS.forEach((color, index) => {
      const pyramid = createPyramid(color);
      pyramid.position.copy(positions[index]);
      pyramid.rotation.copy(rotations[index]);
      pyramid.userData.originalPosition = positions[index].clone();
      pyramid.userData.originalRotation = rotations[index].clone();
      cubeGroup.add(pyramid);
      triangles.push(pyramid);
    });

    return { cubeGroup, triangles };
  };

  // Create the shape of the letter "S"
  const createS = (triangles) => {
    const sPositions = [
      new THREE.Vector3(-2.0, 2.4, 0.0),
      new THREE.Vector3(2.0, 1.4, 0.0),
      new THREE.Vector3(-2.4, -1.4, 0.0),
      new THREE.Vector3(2.4, -2.4, 0.0),
      new THREE.Vector3(-0.4, 0.6, 0.0),
      new THREE.Vector3(0.4, -0.6, 0.0),
    ];

    const sRotations = [
      new THREE.Euler(0, 0, Math.PI / 3),
      new THREE.Euler(0, 0, -Math.PI / 8),
      new THREE.Euler(0, 0, Math.PI / 4),
      new THREE.Euler(0, 0, -Math.PI / 6),
      new THREE.Euler(0, 0, Math.PI / 5),
      new THREE.Euler(0, 0, -Math.PI / 7),
    ];

    triangles.forEach((mesh, index) => {
      mesh.userData.sPosition = sPositions[index];
      mesh.userData.sRotation = sRotations[index];
    });
  };

  // Start transition animation
  const startTransition = useCallback(() => {
    const cubeGroup = cubeGroupRef.current;
    const triangles = trianglesRef.current;
    if (!cubeGroup || !triangles.length) return;

    const tl = gsap.timeline();

    // PHASE 1: Slow rotation (2.5s)
    tl.to(cubeGroup.rotation, {
      y: Math.PI * 2,
      duration: 2.5,
      ease: "power1.inOut"
    }, 0);

    // PHASE 2: Explosion (1.5s)
    // 2.1: Fast rotation
    tl.to(cubeGroup.rotation, {
      y: "+=" + Math.PI * 4,
      x: "+=" + Math.PI * 2,
      duration: 0.5,
      ease: "power2.in"
    }, 2.5);

    // 2.2: Chaotic separation
    triangles.forEach((mesh, index) => {
      const randomX = (Math.random() - 0.5) * 8;
      const randomY = (Math.random() - 0.5) * 8;
      const randomZ = (Math.random() - 0.5) * 8;
      const randomRotX = (Math.random() - 0.5) * Math.PI * 2;
      const randomRotY = (Math.random() - 0.5) * Math.PI * 2;
      const randomRotZ = (Math.random() - 0.5) * Math.PI * 2;

      tl.to(mesh.position, {
        x: randomX,
        y: randomY,
        z: randomZ,
        duration: 1.0,
        ease: "power2.out"
      }, 3.0);

      tl.to(mesh.rotation, {
        x: randomRotX,
        y: randomRotY,
        z: randomRotZ,
        duration: 1.0,
        ease: "power2.out"
      }, 3.0);
    });

    // Light flash at maximum chaos
    tl.to({}, {
      duration: 0.3,
      onStart: () => {
        triangles.forEach(mesh => {
          gsap.to(mesh.material, {
            emissiveIntensity: 1.0,
            duration: 0.15,
            yoyo: true,
            repeat: 1
          });
        });
      }
    }, 3.5);

    // PHASE 3: Formation of the 'S' (1.5s)
    triangles.forEach((mesh, index) => {
      tl.to(mesh.position, {
        x: mesh.userData.sPosition.x,
        y: mesh.userData.sPosition.y,
        z: mesh.userData.sPosition.z,
        duration: 1.5,
        ease: "power2.inOut"
      }, 4.0);

      tl.to(mesh.rotation, {
        x: mesh.userData.sRotation.x,
        y: mesh.userData.sRotation.y,
        z: mesh.userData.sRotation.z,
        duration: 1.5,
        ease: "power2.inOut"
      }, 4.0);
    });

    // Initial rotation of the 'S'
    tl.to(cubeGroup.rotation, {
      y: Math.PI * 0.5,
      duration: 0.5,
      ease: "power2.out"
    }, 4.0);

    // PHASE 4: 'S' - Spin and stop (3.0s)
    tl.to(cubeGroup.rotation, {
      y: Math.PI * 2.5,
      duration: 2.0,
      ease: "power1.inOut"
    }, 5.5);

    tl.to(cubeGroup.rotation, {
      y: 0,
      duration: 1.0,
      ease: "power2.out"
    }, 7.5);

    // Final pause
    tl.to({}, {
      duration: 1.5,
      onComplete: () => {
        setShowButton(true);
      }
    }, 8.5);
  }, []);

  // Initialize Three.js
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-5, -5, -5);
    scene.add(directionalLight2);

    // Create cube
    const { cubeGroup, triangles } = createCube();
    scene.add(cubeGroup);
    cubeGroupRef.current = cubeGroup;
    trianglesRef.current = triangles;

    // Create 'S' shape
    createS(triangles);

    // Start animation
    startTransition();

    // Render loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      triangles.forEach(triangle => {
        triangle.geometry.dispose();
        triangle.material.dispose();
      });
      renderer.dispose();
    };
  }, [startTransition]);

  const handleButtonClick = () => {
    if (onComplete) {
      onComplete();
    }
  };

  const handleSkip = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="intro-animation-container">
      <div ref={containerRef} className="intro-animation-canvas" />
      {showSkipButton && enableSkip && (
        <button className="intro-skip-btn" onClick={handleSkip}>
          Skip Intro →
        </button>
      )}
      {showButton && (
        <div className="intro-tagline">
          <button className="intro-continue-btn" onClick={handleButtonClick}>
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default IntroAnimation;
