"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { useReducedMotion } from "@/app/hooks/useReducedMotion";
import { Sparkles, Volume2, Heart } from "lucide-react";
import { mimiAudio } from "@/app/lib/catAudio";

export function CyberCatCompanion() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const [statusMessage, setStatusMessage] = useState("MIMI.EXE: ONLINE • PURRING NOMINAL");
  const [showHeart, setShowHeart] = useState(false);

  // Audio trigger on click
  const triggerMeow = useCallback(() => {
    const variants: ("standard" | "happy" | "purr")[] = ["happy", "standard", "purr"];
    const chosen = variants[Math.floor(Math.random() * variants.length)];
    mimiAudio.playMeow(chosen);
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1200);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Read current theme accent color from computed CSS
    const computedStyle = getComputedStyle(document.documentElement);
    const accentPrimaryHex = computedStyle.getPropertyValue("--accent-primary").trim() || "#0984e3";
    const accentSecondaryHex = computedStyle.getPropertyValue("--accent-secondary").trim() || "#00cec9";

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0.25, 4.8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // ── High-Contrast Studio & Cyber Lighting ──
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    // Main key light (Crisp White/Cyan Top-Right)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    // Primary Neon Rim Light (Electric Blue from side)
    const primaryRimLight = new THREE.DirectionalLight(new THREE.Color(accentPrimaryHex), 3.5);
    primaryRimLight.position.set(-4, 3, 2);
    scene.add(primaryRimLight);

    // Secondary Neon Underglow / Backlight (Cyan Neon)
    const secondaryRimLight = new THREE.DirectionalLight(new THREE.Color(accentSecondaryHex), 3.0);
    secondaryRimLight.position.set(2, -3, -4);
    scene.add(secondaryRimLight);

    // Master Mimi Group
    const catGroup = new THREE.Group();
    catGroup.position.set(0, -0.15, 0);
    scene.add(catGroup);

    // ── High-Contrast Futuristic Materials ──
    // 1. High-Contrast Titanium Metallic Chassis (Stands out sharply on Night Black #1e272e)
    const chassisMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xdfe6e9), // Bright titanium silver
      metalness: 0.85,
      roughness: 0.2,
    });

    // 2. High-Tech Slate Armor Panels
    const armorMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x2d3436), // Deep cybernetic slate
      metalness: 0.9,
      roughness: 0.3,
    });

    // 3. Primary Energy Glow
    const glowMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(accentPrimaryHex),
      transparent: true,
      opacity: 0.95,
    });

    // 4. Secondary Energy Glow
    const secondaryGlowMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(accentSecondaryHex),
      transparent: true,
      opacity: 0.95,
    });

    // ── 1. Mimi Body & Torso ──
    const bodyGeo = new THREE.CapsuleGeometry(0.68, 0.82, 12, 24);
    const bodyMesh = new THREE.Mesh(bodyGeo, chassisMat);
    bodyMesh.position.set(0, -0.45, 0);
    bodyMesh.rotation.z = Math.PI * 0.04;
    catGroup.add(bodyMesh);

    // Cyber Chest Core Plate (Dual-tone Slate with Neon energy line)
    const chestGeo = new THREE.BoxGeometry(0.66, 0.65, 0.38);
    const chestMesh = new THREE.Mesh(chestGeo, armorMat);
    chestMesh.position.set(0, -0.32, 0.52);
    catGroup.add(chestMesh);

    const chestStripeGeo = new THREE.BoxGeometry(0.12, 0.55, 0.4);
    const chestStripe = new THREE.Mesh(chestStripeGeo, secondaryGlowMat);
    chestStripe.position.set(0, -0.32, 0.54);
    catGroup.add(chestStripe);

    // Glowing Collar Ring & Mimi Nexus Bell
    const collarGeo = new THREE.TorusGeometry(0.58, 0.07, 12, 32);
    const collarMesh = new THREE.Mesh(collarGeo, glowMat);
    collarMesh.rotation.x = Math.PI / 2;
    collarMesh.position.set(0, 0.08, 0);
    catGroup.add(collarMesh);

    const bellGeo = new THREE.OctahedronGeometry(0.15, 0);
    const bellMesh = new THREE.Mesh(bellGeo, secondaryGlowMat);
    bellMesh.position.set(0, -0.02, 0.68);
    catGroup.add(bellMesh);

    // ── 2. Articulated Segmented Cyber Tail (Animated Wiggle) ──
    const tailBaseGroup = new THREE.Group();
    tailBaseGroup.position.set(0, -0.85, -0.45);
    catGroup.add(tailBaseGroup);

    const tailSegments: THREE.Group[] = [];
    const segmentCount = 8;
    let parentTailNode: THREE.Group = tailBaseGroup;

    for (let i = 0; i < segmentCount; i++) {
      const segGroup = new THREE.Group();
      segGroup.position.set(0, i === 0 ? 0 : 0.16, -0.06);

      const radius = Math.max(0.04, 0.085 - i * 0.007);
      const segGeo = new THREE.CylinderGeometry(radius * 0.85, radius, 0.18, 12);
      const isTip = i === segmentCount - 1;
      const isEven = i % 2 === 0;

      const segMesh = new THREE.Mesh(
        segGeo,
        isTip ? secondaryGlowMat : isEven ? armorMat : chassisMat
      );
      segMesh.rotation.x = Math.PI * 0.28;
      segGroup.add(segMesh);

      // Add energy ring on every other segment
      if (i % 2 === 1) {
        const ringGeo = new THREE.TorusGeometry(radius * 1.25, 0.02, 8, 16);
        const ringMesh = new THREE.Mesh(ringGeo, glowMat);
        ringMesh.rotation.x = Math.PI / 2;
        segGroup.add(ringMesh);
      }

      parentTailNode.add(segGroup);
      tailSegments.push(segGroup);
      parentTailNode = segGroup;
    }

    // ── 3. Mimi Head Group (Tracks cursor gaze in 3D) ──
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.62, 0.1);
    catGroup.add(headGroup);

    // Titanium Cranium
    const headGeo = new THREE.SphereGeometry(0.74, 32, 32);
    headGeo.scale(1.08, 0.96, 1.02);
    const headMesh = new THREE.Mesh(headGeo, chassisMat);
    headGroup.add(headMesh);

    // Forehead Armor Visor Shell
    const foreheadGeo = new THREE.BoxGeometry(0.58, 0.36, 0.24);
    const foreheadMesh = new THREE.Mesh(foreheadGeo, armorMat);
    foreheadMesh.position.set(0, 0.42, 0.62);
    foreheadMesh.rotation.x = -Math.PI * 0.12;
    headGroup.add(foreheadMesh);

    // ── 4. Animated Triangular Mecha Ears ──
    const earGeo = new THREE.ConeGeometry(0.34, 0.58, 4);
    earGeo.scale(1.0, 1.0, 0.5);

    const leftEarGroup = new THREE.Group();
    leftEarGroup.position.set(-0.48, 0.68, 0.1);
    leftEarGroup.rotation.z = Math.PI * 0.14;
    leftEarGroup.rotation.y = -Math.PI * 0.1;
    const leftEarMesh = new THREE.Mesh(earGeo, armorMat);
    leftEarGroup.add(leftEarMesh);

    const innerEarGeo = new THREE.ConeGeometry(0.19, 0.4, 4);
    innerEarGeo.scale(1.0, 1.0, 0.4);
    const leftInnerEar = new THREE.Mesh(innerEarGeo, glowMat);
    leftInnerEar.position.set(0, 0, 0.05);
    leftEarGroup.add(leftInnerEar);
    headGroup.add(leftEarGroup);

    const rightEarGroup = new THREE.Group();
    rightEarGroup.position.set(0.48, 0.68, 0.1);
    rightEarGroup.rotation.z = -Math.PI * 0.14;
    rightEarGroup.rotation.y = Math.PI * 0.1;
    const rightEarMesh = new THREE.Mesh(earGeo, armorMat);
    rightEarGroup.add(rightEarMesh);

    const rightInnerEar = new THREE.Mesh(innerEarGeo, glowMat);
    rightInnerEar.position.set(0, 0, 0.05);
    rightEarGroup.add(rightInnerEar);
    headGroup.add(rightEarGroup);

    // ── 5. Glowing LED Visor Eyes (Cyan Neon / Electric Blue) ──
    const eyeGeo = new THREE.CapsuleGeometry(0.12, 0.2, 8, 16);
    eyeGeo.scale(1.3, 0.92, 0.6);

    const leftEye = new THREE.Mesh(eyeGeo, secondaryGlowMat);
    leftEye.position.set(-0.29, 0.08, 0.72);
    leftEye.rotation.z = Math.PI * 0.12;
    headGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, secondaryGlowMat);
    rightEye.position.set(0.29, 0.08, 0.72);
    rightEye.rotation.z = -Math.PI * 0.12;
    headGroup.add(rightEye);

    // Snout / Nose
    const snoutGeo = new THREE.ConeGeometry(0.09, 0.08, 3);
    const snoutMesh = new THREE.Mesh(snoutGeo, glowMat);
    snoutMesh.rotation.x = Math.PI;
    snoutMesh.position.set(0, -0.09, 0.77);
    headGroup.add(snoutMesh);

    // Cyber Whiskers
    const whiskerMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(accentPrimaryHex),
      transparent: true,
      opacity: 0.85,
    });

    const createWhisker = (startX: number, startY: number, endX: number, endY: number) => {
      const points = [
        new THREE.Vector3(startX, startY, 0.68),
        new THREE.Vector3(endX, endY, 0.76),
      ];
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      return new THREE.Line(geo, whiskerMat);
    };

    headGroup.add(createWhisker(-0.16, -0.08, -0.7, -0.04));
    headGroup.add(createWhisker(-0.16, -0.16, -0.66, -0.24));
    headGroup.add(createWhisker(0.16, -0.08, 0.7, -0.04));
    headGroup.add(createWhisker(0.16, -0.16, 0.66, -0.24));

    // ── Mouse Cursor Tracking Coordinates ──
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    // Spin / Mischief Trigger on Click
    let spinAngle = 0;
    let isSpinning = false;
    let isJumping = false;
    let jumpProgress = 0;

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

    // Click on canvas triggers sound + 360 spin + playful dialogue
    const handleClick = () => {
      isSpinning = true;
      spinAngle = Math.PI * 2;
      isJumping = true;
      jumpProgress = 0;
      triggerMeow();

      const messages = [
        "MIMI.EXE: *MEOW!* > 0 BUGS IN PRODUCTION",
        "MIMI.EXE: *PURR* > LATENCY 14ms OPTIMIZED",
        "MIMI.EXE: *SWAT* > CACHE CLEARED & READY",
        "MIMI.EXE: *WINK* > ALL PACKAGES NOMINAL",
        "MIMI.EXE: *CHIRP* > FULL-STACK COMPANION ONLINE",
      ];
      setStatusMessage(messages[Math.floor(Math.random() * messages.length)]);
    };

    container.addEventListener("click", handleClick);

    // Theme color sync observer
    const observer = new MutationObserver(() => {
      const updatedStyle = getComputedStyle(document.documentElement);
      const newAccent = updatedStyle.getPropertyValue("--accent-primary").trim();
      const newSecondary = updatedStyle.getPropertyValue("--accent-secondary").trim();
      if (newAccent) {
        glowMat.color.set(newAccent);
        whiskerMat.color.set(newAccent);
        primaryRimLight.color.set(newAccent);
      }
      if (newSecondary) {
        secondaryGlowMat.color.set(newSecondary);
        secondaryRimLight.color.set(newSecondary);
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
      time += 0.025;

      if (!prefersReduced) {
        // Smooth mouse tracking lerp
        currentMouseX += (targetMouseX - currentMouseX) * 0.09;
        currentMouseY += (targetMouseY - currentMouseY) * 0.09;

        // Head looks at cursor in 3D
        headGroup.rotation.y = currentMouseX * 0.85 + Math.sin(time * 0.8) * 0.04;
        headGroup.rotation.x = currentMouseY * 0.6 + Math.cos(time * 0.6) * 0.03;
        headGroup.rotation.z = currentMouseX * -0.15;

        // Body follows subtle posture
        catGroup.rotation.y = currentMouseX * 0.25;

        // Animated Ear Twitches (Feline reaction)
        const earTwitch = Math.sin(time * 3.2) > 0.9 ? Math.sin(time * 26) * 0.18 : 0;
        leftEarGroup.rotation.z = Math.PI * 0.14 + earTwitch;
        rightEarGroup.rotation.z = -Math.PI * 0.14 - earTwitch;

        // ── Wiggling Tail Physics (Sinusoidal Chain Dynamics) ──
        tailSegments.forEach((seg, idx) => {
          const speedMultiplier = 2.8;
          const wave = Math.sin(time * speedMultiplier + idx * 0.55);
          const crossWave = Math.cos(time * (speedMultiplier * 0.7) + idx * 0.4);

          seg.rotation.y = wave * 0.22 + currentMouseX * 0.12;
          seg.rotation.x = crossWave * 0.14 + (isSpinning ? 0.3 : 0);
          seg.rotation.z = Math.sin(time * 1.5 + idx * 0.3) * 0.08;
        });

        // Periodic Eye Blink
        const isBlinking = Math.sin(time * 0.75) > 0.97;
        leftEye.scale.y = isBlinking ? 0.08 : 0.92;
        rightEye.scale.y = isBlinking ? 0.08 : 0.92;

        // Crystal Nexus Bell Rotation
        bellMesh.rotation.y = time * 2.2;
        bellMesh.rotation.x = time * 1.6;

        // Gentle breathing float & jump
        let jumpOffsetY = 0;
        if (isJumping) {
          jumpProgress += 0.08;
          jumpOffsetY = Math.sin(jumpProgress * Math.PI) * 0.25;
          if (jumpProgress >= 1) {
            isJumping = false;
          }
        }
        catGroup.position.y = -0.15 + Math.sin(time * 1.6) * 0.05 + jumpOffsetY;

        // 360 Spin on Click
        if (isSpinning) {
          catGroup.rotation.y += 0.28;
          spinAngle -= 0.28;
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
      chassisMat.dispose();
      headGeo.dispose();
      earGeo.dispose();
      eyeGeo.dispose();
      glowMat.dispose();
      armorMat.dispose();
      secondaryGlowMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [prefersReduced, triggerMeow]);

  return (
    <div className="relative w-full max-w-xs md:max-w-sm flex flex-col items-center select-none group cursor-pointer">
      {/* Heart / Sparkle Popup on click */}
      {showHeart && (
        <div className="absolute top-2 right-6 z-20 animate-bounce flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-primary/20 border border-border-accent text-accent-secondary text-xs font-mono backdrop-blur-md">
          <Heart className="w-3.5 h-3.5 fill-accent-secondary text-accent-secondary animate-pulse" />
          <span>MEOW!</span>
        </div>
      )}

      {/* 3D Mimi Canvas */}
      <div
        ref={containerRef}
        className="w-full h-[280px] md:h-[350px] flex items-center justify-center filter drop-shadow-[0_0_24px_rgba(9,132,227,0.25)]"
        title="Click Mimi for a playful meow & spin!"
      />

      {/* Mimi Status Tag */}
      <div className="flex items-center gap-2 px-3.5 py-1.5 bg-bg-surface/90 border border-border-accent rounded-full text-[11px] font-mono text-text-secondary backdrop-blur-md shadow-lg -mt-4 transition-all group-hover:border-accent-primary group-hover:text-text-primary group-hover:shadow-[0_0_16px_var(--accent-primary-dim)]">
        <Sparkles className="w-3.5 h-3.5 text-accent-secondary animate-pulse" />
        <span className="font-bold text-accent-primary">{statusMessage}</span>
        <span className="text-neutral-bright text-[10px] hidden sm:flex items-center gap-1">
          <Volume2 className="w-3 h-3 text-accent-secondary" />
          (click meow!)
        </span>
      </div>
    </div>
  );
}
