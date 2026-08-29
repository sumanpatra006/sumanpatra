"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useReducedMotion } from "@/app/hooks/useReducedMotion";

export function RoboticHeadCanvas() {
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
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Master Head Group (Tilts and rotates to look at cursor)
    const headGroup = new THREE.Group();
    scene.add(headGroup);

    // ── 1. Cranium & Forehead (Sculpted Cyber Geometry) ──
    const craniumGeo = new THREE.IcosahedronGeometry(1.25, 2);
    const craniumMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(accentPrimaryHex),
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const craniumMesh = new THREE.Mesh(craniumGeo, craniumMat);
    craniumMesh.scale.set(1.0, 1.15, 1.1);
    craniumMesh.position.set(0, 0.2, 0);
    headGroup.add(craniumMesh);

    // ── 2. Cyber Faceplate & Cheekbones ──
    const faceplateGeo = new THREE.ConeGeometry(0.95, 1.4, 6, 2, true);
    const faceplateMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(accentSecondaryHex),
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const faceplateMesh = new THREE.Mesh(faceplateGeo, faceplateMat);
    faceplateMesh.rotation.x = Math.PI;
    faceplateMesh.position.set(0, -0.35, 0.45);
    headGroup.add(faceplateMesh);

    // ── 3. Cybernetic Glowing Ocular Visor / Eyes ──
    const visorGeo = new THREE.BoxGeometry(1.2, 0.22, 0.6);
    const visorMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(accentPrimaryHex),
      transparent: true,
      opacity: 0.85,
    });
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.position.set(0, 0.18, 0.9);
    headGroup.add(visorMesh);

    // Visor Scanner Beam Line
    const beamGeo = new THREE.PlaneGeometry(1.35, 0.04);
    const beamMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#ffffff"),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95,
    });
    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    beamMesh.position.set(0, 0.18, 1.21);
    headGroup.add(beamMesh);

    // ── 4. Cyber Audio Sensors / Ear Nodes ──
    const earGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.2, 8);
    const earMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(accentPrimaryHex),
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });

    const leftEar = new THREE.Mesh(earGeo, earMat);
    leftEar.rotation.z = Math.PI / 2;
    leftEar.position.set(-1.15, 0.1, 0.1);
    headGroup.add(leftEar);

    const rightEar = new THREE.Mesh(earGeo, earMat);
    rightEar.rotation.z = Math.PI / 2;
    rightEar.position.set(1.15, 0.1, 0.1);
    headGroup.add(rightEar);

    // ── 5. Articulated Neck Joint & Pivot Base ──
    const neckGeo = new THREE.CylinderGeometry(0.45, 0.6, 0.8, 8, 2, true);
    const neckMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(accentSecondaryHex),
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const neckMesh = new THREE.Mesh(neckGeo, neckMat);
    neckMesh.position.set(0, -1.1, -0.1);
    headGroup.add(neckMesh);

    // ── 6. Ambient Halo / Orbital Data Grid ──
    const haloGeo = new THREE.TorusGeometry(1.8, 0.015, 8, 48);
    const haloMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(accentPrimaryHex),
      transparent: true,
      opacity: 0.25,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.rotation.x = Math.PI / 2.3;
    haloMesh.position.set(0, 0.3, 0);
    headGroup.add(haloMesh);

    // ── 7. Ambient Cyber Dust Particles ──
    const particleCount = 100;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 8;
      positions[i + 1] = (Math.random() - 0.5) * 8;
      positions[i + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: new THREE.Color(accentPrimaryHex),
      size: 0.035,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ── Mouse Parallax Coordinates Tracking ──
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      targetMouseX = (event.clientX / innerWidth - 0.5) * 2;
      targetMouseY = (event.clientY / innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // MutationObserver to sync with globals.css theme changes
    const observer = new MutationObserver(() => {
      const updatedStyle = getComputedStyle(document.documentElement);
      const newAccent = updatedStyle.getPropertyValue("--accent-primary").trim();
      const newSecondary = updatedStyle.getPropertyValue("--accent-secondary").trim();
      if (newAccent) {
        craniumMat.color.set(newAccent);
        visorMat.color.set(newAccent);
        earMat.color.set(newAccent);
        haloMat.color.set(newAccent);
        particleMat.color.set(newAccent);
      }
      if (newSecondary) {
        faceplateMat.color.set(newSecondary);
        neckMat.color.set(newSecondary);
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
        // Smooth lerp tracking (Head smoothly looks towards mouse position)
        currentMouseX += (targetMouseX - currentMouseX) * 0.06;
        currentMouseY += (targetMouseY - currentMouseY) * 0.06;

        // Head looks at cursor: Y rotation = horizontal look, X rotation = vertical look
        headGroup.rotation.y = currentMouseX * 0.75 + Math.sin(elapsedTime * 0.5) * 0.05;
        headGroup.rotation.x = currentMouseY * 0.5 + Math.cos(elapsedTime * 0.4) * 0.03;
        headGroup.rotation.z = currentMouseX * -0.15;

        // Floating breath-like bobbing
        headGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.08;

        // Visor scanner pulse
        beamMesh.position.x = Math.sin(elapsedTime * 2.5) * 0.4;

        // Halo slow rotation
        haloMesh.rotation.z = elapsedTime * 0.2;

        // Ambient particles slow rotation
        particles.rotation.y = elapsedTime * 0.03;
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
      craniumGeo.dispose();
      craniumMat.dispose();
      faceplateGeo.dispose();
      faceplateMat.dispose();
      visorGeo.dispose();
      visorMat.dispose();
      beamGeo.dispose();
      beamMat.dispose();
      earGeo.dispose();
      earMat.dispose();
      neckGeo.dispose();
      neckMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
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
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}
