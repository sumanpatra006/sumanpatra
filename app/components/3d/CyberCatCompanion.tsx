"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useReducedMotion } from "@/app/hooks/useReducedMotion";
import { Sparkles, Zap } from "lucide-react";

export function CyberCatCompanion() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const [clickCount, setClickCount] = useState(0);
  const [statusMessage, setStatusMessage] = useState("NEKO.EXE: IDLE • TRACKING CURSOR");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Read current theme accent color from computed CSS
    const computedStyle = getComputedStyle(document.documentElement);
    const accentPrimaryHex = computedStyle.getPropertyValue("--accent-primary").trim() || "#00f0ff";
    const accentSecondaryHex = computedStyle.getPropertyValue("--accent-secondary").trim() || "#818cf8";
    const bgSurfaceHex = computedStyle.getPropertyValue("--bg-surface").trim() || "#0f172a";

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0.2, 5.0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // ── Lighting ──
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(new THREE.Color(accentPrimaryHex), 2.5);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(new THREE.Color(accentSecondaryHex), 2.0);
    rimLight.position.set(-3, -2, -3);
    scene.add(rimLight);

    // Master Cat Group
    const catGroup = new THREE.Group();
    catGroup.position.set(0, -0.2, 0);
    scene.add(catGroup);

    // ── Materials ──
    const bodyMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(bgSurfaceHex),
      metalness: 0.85,
      roughness: 0.25,
    });

    const armorMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x1e293b),
      metalness: 0.9,
      roughness: 0.2,
    });

    const glowMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(accentPrimaryHex),
      transparent: true,
      opacity: 0.9,
    });

    const secondaryGlowMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(accentSecondaryHex),
      transparent: true,
      opacity: 0.85,
    });

    // ── 1. Cat Body & Torso ──
    const bodyGeo = new THREE.CapsuleGeometry(0.7, 0.8, 8, 16);
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.position.set(0, -0.5, 0);
    bodyMesh.rotation.z = Math.PI * 0.05;
    catGroup.add(bodyMesh);

    // Chest Armor Plate
    const chestGeo = new THREE.BoxGeometry(0.65, 0.65, 0.35);
    const chestMesh = new THREE.Mesh(chestGeo, armorMat);
    chestMesh.position.set(0, -0.35, 0.55);
    catGroup.add(chestMesh);

    // Glowing Collar Ring
    const collarGeo = new THREE.TorusGeometry(0.62, 0.06, 8, 32);
    const collarMesh = new THREE.Mesh(collarGeo, glowMat);
    collarMesh.rotation.x = Math.PI / 2;
    collarMesh.position.set(0, 0.05, 0);
    catGroup.add(collarMesh);

    // Collar Core Bell / Nexus Crystal
    const coreCrystalGeo = new THREE.OctahedronGeometry(0.14, 0);
    const coreCrystalMesh = new THREE.Mesh(coreCrystalGeo, secondaryGlowMat);
    coreCrystalMesh.position.set(0, -0.05, 0.68);
    catGroup.add(coreCrystalMesh);

    // ── 2. Articulated Segmented Cyber Tail ──
    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, -0.9, -0.55);
    catGroup.add(tailGroup);

    const tailSegments: THREE.Mesh[] = [];
    const segmentCount = 6;
    for (let i = 0; i < segmentCount; i++) {
      const segGeo = new THREE.CylinderGeometry(0.08 - i * 0.008, 0.09 - i * 0.008, 0.22, 8);
      const segMesh = new THREE.Mesh(segGeo, i % 2 === 0 ? armorMat : glowMat);
      segMesh.position.set(0, i * 0.18, -i * 0.08);
      segMesh.rotation.x = Math.PI * 0.25;
      tailGroup.add(segMesh);
      tailSegments.push(segMesh);
    }

    // ── 3. Cat Head Group (Tracks cursor gaze in 3D) ──
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.55, 0.1);
    catGroup.add(headGroup);

    // Cranium
    const headGeo = new THREE.SphereGeometry(0.72, 24, 24);
    headGeo.scale(1.05, 0.95, 1.0);
    const headMesh = new THREE.Mesh(headGeo, bodyMat);
    headGroup.add(headMesh);

    // Forehead Cyber Armor Plating
    const foreheadGeo = new THREE.BoxGeometry(0.55, 0.35, 0.2);
    const foreheadMesh = new THREE.Mesh(foreheadGeo, armorMat);
    foreheadMesh.position.set(0, 0.4, 0.6);
    foreheadMesh.rotation.x = -Math.PI * 0.1;
    headGroup.add(foreheadMesh);

    // ── 4. Animated Triangular Mecha Ears ──
    const earGeo = new THREE.ConeGeometry(0.32, 0.55, 4);
    earGeo.scale(1.0, 1.0, 0.5);

    const leftEarGroup = new THREE.Group();
    leftEarGroup.position.set(-0.48, 0.65, 0.1);
    leftEarGroup.rotation.z = Math.PI * 0.15;
    leftEarGroup.rotation.y = -Math.PI * 0.1;
    const leftEarMesh = new THREE.Mesh(earGeo, armorMat);
    leftEarGroup.add(leftEarMesh);

    // Inner Ear Glow
    const innerEarGeo = new THREE.ConeGeometry(0.18, 0.38, 4);
    innerEarGeo.scale(1.0, 1.0, 0.4);
    const leftInnerEar = new THREE.Mesh(innerEarGeo, glowMat);
    leftInnerEar.position.set(0, 0, 0.05);
    leftEarGroup.add(leftInnerEar);
    headGroup.add(leftEarGroup);

    const rightEarGroup = new THREE.Group();
    rightEarGroup.position.set(0.48, 0.65, 0.1);
    rightEarGroup.rotation.z = -Math.PI * 0.15;
    rightEarGroup.rotation.y = Math.PI * 0.1;
    const rightEarMesh = new THREE.Mesh(earGeo, armorMat);
    rightEarGroup.add(rightEarMesh);

    const rightInnerEar = new THREE.Mesh(innerEarGeo, glowMat);
    rightInnerEar.position.set(0, 0, 0.05);
    rightEarGroup.add(rightInnerEar);
    headGroup.add(rightEarGroup);

    // ── 5. Glowing LED Visor Eyes (Blinks & tracks gaze) ──
    const eyeGeo = new THREE.CapsuleGeometry(0.11, 0.18, 6, 12);
    eyeGeo.scale(1.3, 0.9, 0.6);

    const leftEye = new THREE.Mesh(eyeGeo, glowMat);
    leftEye.position.set(-0.28, 0.08, 0.68);
    leftEye.rotation.z = Math.PI * 0.12;
    headGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, glowMat);
    rightEye.position.set(0.28, 0.08, 0.68);
    rightEye.rotation.z = -Math.PI * 0.12;
    headGroup.add(rightEye);

    // Snout / Nose
    const snoutGeo = new THREE.ConeGeometry(0.09, 0.08, 3);
    const snoutMesh = new THREE.Mesh(snoutGeo, secondaryGlowMat);
    snoutMesh.rotation.x = Math.PI;
    snoutMesh.position.set(0, -0.1, 0.74);
    headGroup.add(snoutMesh);

    // Cyber Whiskers (Glowing lines)
    const whiskerMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(accentPrimaryHex),
      transparent: true,
      opacity: 0.75,
    });

    const createWhisker = (startX: number, startY: number, endX: number, endY: number) => {
      const points = [
        new THREE.Vector3(startX, startY, 0.65),
        new THREE.Vector3(endX, endY, 0.72),
      ];
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      return new THREE.Line(geo, whiskerMat);
    };

    headGroup.add(createWhisker(-0.15, -0.08, -0.65, -0.04));
    headGroup.add(createWhisker(-0.15, -0.15, -0.62, -0.22));
    headGroup.add(createWhisker(0.15, -0.08, 0.65, -0.04));
    headGroup.add(createWhisker(0.15, -0.15, 0.62, -0.22));

    // ── Mouse Cursor Tracking Coordinates ──
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    // Spin / Mischief Trigger on Click
    let spinAngle = 0;
    let isSpinning = false;

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

    // Click on canvas triggers playful cat mischief
    const handleClick = () => {
      isSpinning = true;
      spinAngle = Math.PI * 2;
      setClickCount((c) => c + 1);

      const messages = [
        "NEKO.EXE: *PURR* > SPEED_OPTIMIZED",
        "NEKO.EXE: *MEOW* > REPLAY_QUEUE_CLEAR",
        "NEKO.EXE: *SWAT* > 0 BUGS DETECTED",
        "NEKO.EXE: *WINK* > ALL SERVICES NOMINAL",
      ];
      setStatusMessage(messages[Math.floor(Math.random() * messages.length)]);
    };

    container.addEventListener("click", handleClick);

    // Theme color sync
    const observer = new MutationObserver(() => {
      const updatedStyle = getComputedStyle(document.documentElement);
      const newAccent = updatedStyle.getPropertyValue("--accent-primary").trim();
      const newSecondary = updatedStyle.getPropertyValue("--accent-secondary").trim();
      if (newAccent) {
        glowMat.color.set(newAccent);
        whiskerMat.color.set(newAccent);
        keyLight.color.set(newAccent);
      }
      if (newSecondary) {
        secondaryGlowMat.color.set(newSecondary);
        rimLight.color.set(newSecondary);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "style", "class"],
    });

    // ── Animation Loop ──
    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      time += 0.02;

      if (!prefersReduced) {
        // Smooth lerp mouse tracking
        currentMouseX += (targetMouseX - currentMouseX) * 0.08;
        currentMouseY += (targetMouseY - currentMouseY) * 0.08;

        // Head smoothly looks at cursor in 3D
        headGroup.rotation.y = currentMouseX * 0.85 + Math.sin(time * 0.8) * 0.04;
        headGroup.rotation.x = currentMouseY * 0.6 + Math.cos(time * 0.6) * 0.03;
        headGroup.rotation.z = currentMouseX * -0.15;

        // Subtle body posture reaction
        catGroup.rotation.y = currentMouseX * 0.25;

        // Animated Ear Twitches (Periodic feline mischief)
        const earTwitch = Math.sin(time * 3) > 0.92 ? Math.sin(time * 25) * 0.15 : 0;
        leftEarGroup.rotation.z = Math.PI * 0.15 + earTwitch;
        rightEarGroup.rotation.z = -Math.PI * 0.15 - earTwitch;

        // Tail Wagging (Sine-wave physics)
        tailSegments.forEach((seg, idx) => {
          seg.rotation.z = Math.sin(time * 2.5 + idx * 0.4) * 0.18;
          seg.rotation.y = Math.cos(time * 2.0 + idx * 0.3) * 0.12;
        });

        // Periodic Eye Blink
        const isBlinking = Math.sin(time * 0.8) > 0.96;
        leftEye.scale.y = isBlinking ? 0.1 : 0.9;
        rightEye.scale.y = isBlinking ? 0.1 : 0.9;

        // Crystal nexus rotation
        coreCrystalMesh.rotation.y = time * 2;
        coreCrystalMesh.rotation.x = time * 1.5;

        // Gentle breathing float
        catGroup.position.y = -0.2 + Math.sin(time * 1.5) * 0.06;

        // 360 Spin on Click
        if (isSpinning) {
          catGroup.rotation.y += 0.25;
          spinAngle -= 0.25;
          if (spinAngle <= 0) {
            isSpinning = false;
            catGroup.rotation.y = 0;
          }
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("click", handleClick);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      bodyGeo.dispose();
      bodyMat.dispose();
      headGeo.dispose();
      earGeo.dispose();
      eyeGeo.dispose();
      glowMat.dispose();
      armorMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [prefersReduced]);

  return (
    <div className="relative w-full max-w-xs md:max-w-sm flex flex-col items-center select-none group cursor-pointer">
      {/* 3D Cat Canvas */}
      <div
        ref={containerRef}
        className="w-full h-[280px] md:h-[340px] flex items-center justify-center"
        title="Click NEKO.EXE for a playful spin!"
      />

      {/* Cyber Companion Status Tag */}
      <div className="flex items-center gap-2 px-3 py-1 bg-bg-surface/85 border border-border-accent rounded-full text-[10px] font-mono text-text-secondary backdrop-blur-md shadow-lg -mt-4 transition-all group-hover:border-accent-primary group-hover:text-text-primary">
        <Sparkles className="w-3 h-3 text-accent-primary animate-pulse" />
        <span className="font-bold text-accent-primary">{statusMessage}</span>
        <span className="text-neutral-bright text-[9px] hidden sm:inline">(click me!)</span>
      </div>
    </div>
  );
}
