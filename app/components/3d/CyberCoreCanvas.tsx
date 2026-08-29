"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useReducedMotion } from "@/app/hooks/useReducedMotion";

export function CyberCoreCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Read current theme accent color from computed CSS
    const computedStyle = getComputedStyle(document.documentElement);
    const accentPrimaryHex = computedStyle.getPropertyValue("--accent-primary").trim() || "#00f0ff";
    const accentSecondaryHex = computedStyle.getPropertyValue("--accent-secondary").trim() || "#818cf8";

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 4.8;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group that tilts with mouse
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Central Wireframe Geometry (Icosahedron Core)
    const coreGeo = new THREE.IcosahedronGeometry(1.1, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(accentPrimaryHex),
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreMesh);

    // Inner glowing solid mini-node
    const innerGeo = new THREE.OctahedronGeometry(0.4, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(accentSecondaryHex),
      wireframe: false,
      transparent: true,
      opacity: 0.85,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    // 2. Concentric Orbital Rings
    const ring1Geo = new THREE.RingGeometry(1.6, 1.63, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(accentPrimaryHex),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    const ring2Geo = new THREE.RingGeometry(1.9, 1.93, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(accentSecondaryHex),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    coreGroup.add(ring2);

    // 3. Floating Ambient Particles
    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 5;
      positions[i + 1] = (Math.random() - 0.5) * 5;
      positions[i + 2] = (Math.random() - 0.5) * 4;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: new THREE.Color(accentPrimaryHex),
      size: 0.04,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Tracking with Easing
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      targetMouseX = (event.clientX / innerWidth - 0.5) * 2;
      targetMouseY = -(event.clientY / innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // MutationObserver to update colors if user switches data-theme live
    const observer = new MutationObserver(() => {
      const updatedStyle = getComputedStyle(document.documentElement);
      const newAccent = updatedStyle.getPropertyValue("--accent-primary").trim();
      const newSecondary = updatedStyle.getPropertyValue("--accent-secondary").trim();
      if (newAccent) {
        coreMat.color.set(newAccent);
        ring1Mat.color.set(newAccent);
        particleMat.color.set(newAccent);
      }
      if (newSecondary) {
        innerMat.color.set(newSecondary);
        ring2Mat.color.set(newSecondary);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "style", "class"],
    });

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      if (!prefersReduced) {
        // Smooth lerp mouse tracking
        currentMouseX += (targetMouseX - currentMouseX) * 0.05;
        currentMouseY += (targetMouseY - currentMouseY) * 0.05;

        // Core base rotation + mouse tilt
        coreGroup.rotation.y = elapsedTime * 0.3 + currentMouseX * 0.8;
        coreGroup.rotation.x = currentMouseY * 0.6;
        coreGroup.rotation.z = Math.sin(elapsedTime * 0.4) * 0.1;

        // Counter-rotating rings
        ring1.rotation.z = elapsedTime * 0.4;
        ring2.rotation.x = elapsedTime * -0.3;

        // Inner node fast spin
        innerMesh.rotation.y = elapsedTime * -0.8;
        innerMesh.rotation.x = elapsedTime * 0.5;

        // Particle subtle drift
        particles.rotation.y = elapsedTime * 0.05;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [prefersReduced]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[320px] md:h-[420px] flex items-center justify-center pointer-events-none select-none"
      aria-hidden="true"
    />
  );
}
