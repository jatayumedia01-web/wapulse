"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

function fibonacciSphere(count: number, radius: number, jitter = 0.018) {
  const positions = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    const radiusJitter = radius * (1 + (Math.random() - 0.5) * jitter);
    positions[i * 3] = Math.cos(theta) * r * radiusJitter;
    positions[i * 3 + 1] = y * radiusJitter;
    positions[i * 3 + 2] = Math.sin(theta) * r * radiusJitter;
  }
  return positions;
}

function starField(count: number, minR: number, maxR: number) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = minR + Math.random() * (maxR - minR);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
}

function makePoints(
  positions: Float32Array,
  size: number,
  color: number,
  opacity: number,
) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color,
    size,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  return new THREE.Points(geometry, material);
}

function metal(color: number, extras: THREE.MeshStandardMaterialParameters = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: 0.88,
    roughness: 0.28,
    ...extras,
  });
}

function buildRocket() {
  const rocket = new THREE.Group();
  const hull = metal(0xd9e0ea);
  const dark = metal(0x12151c, { roughness: 0.42, metalness: 0.7 });
  const accent = metal(0x10b981, { emissive: 0x064e3b, emissiveIntensity: 0.45 });
  const noseMat = metal(0xb7c0cc, { roughness: 0.2 });

  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.72, 28), noseMat);
  nose.position.y = 1.42;
  rocket.add(nose);

  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.12, 28), accent);
  collar.position.y = 1.02;
  rocket.add(collar);

  const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.7, 32), hull);
  upper.position.y = 0.61;
  rocket.add(upper);

  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.345, 0.345, 0.06, 32), accent);
  band.position.y = 0.24;
  rocket.add(band);

  const mid = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.36, 0.85, 32), hull);
  mid.position.y = -0.22;
  rocket.add(mid);

  const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.035, 1.35, 0.72), accent);
  stripe.position.y = 0.18;
  rocket.add(stripe);

  const lower = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.3, 0.38, 32), dark);
  lower.position.y = -0.82;
  rocket.add(lower);

  const windowGlass = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 24, 16),
    new THREE.MeshStandardMaterial({
      color: 0xb8e6ff,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.9,
      metalness: 0.2,
      roughness: 0.1,
    }),
  );
  windowGlass.position.set(0, 0.62, 0.3);
  rocket.add(windowGlass);

  const windowRing = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.016, 12, 28), dark);
  windowRing.position.copy(windowGlass.position);
  windowRing.lookAt(0, 0.62, 1);
  rocket.add(windowRing);

  const finShape = new THREE.Shape();
  finShape.moveTo(0, 0);
  finShape.lineTo(0.42, -0.18);
  finShape.lineTo(0.42, -0.42);
  finShape.lineTo(0, -0.28);
  finShape.closePath();
  const finGeom = new THREE.ExtrudeGeometry(finShape, { depth: 0.045, bevelEnabled: false });
  finGeom.translate(0.3, -0.62, -0.022);
  for (let i = 0; i < 4; i++) {
    const fin = new THREE.Mesh(finGeom, dark);
    fin.rotation.y = (i * Math.PI) / 2;
    rocket.add(fin);
  }

  const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.24, 0.28, 24), dark);
  nozzle.position.y = -1.12;
  rocket.add(nozzle);

  const throat = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.15, 0.1, 20),
    new THREE.MeshStandardMaterial({
      color: 0xffb36b,
      emissive: 0xff6a1a,
      emissiveIntensity: 1.8,
      metalness: 0.3,
      roughness: 0.35,
    }),
  );
  throat.position.y = -1.28;
  rocket.add(throat);

  const plume = new THREE.Mesh(
    new THREE.ConeGeometry(0.18, 0.72, 20, 1, true),
    new THREE.MeshBasicMaterial({
      color: 0xffc27a,
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  );
  plume.rotation.x = Math.PI;
  plume.position.y = -1.72;
  rocket.add(plume);

  rocket.userData.plume = plume;
  rocket.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.isMesh) {
      mesh.castShadow = false;
      mesh.receiveShadow = false;
    }
  });
  return rocket;
}

export default function RocketScene() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const narrow = host.clientWidth < 768;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({
      antialias: !narrow,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, narrow ? 1.5 : 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    host.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.setAttribute("aria-hidden", "true");

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.046);

    const camera = new THREE.PerspectiveCamera(
      38,
      host.clientWidth / host.clientHeight,
      0.1,
      80,
    );
    camera.position.set(0.15, 0.35, narrow ? 7.4 : 6.35);

    const world = new THREE.Group();
    scene.add(world);

    const planet = new THREE.Group();
    planet.add(makePoints(fibonacciSphere(narrow ? 2800 : 6200, 2.85, 0.03), narrow ? 0.018 : 0.016, 0xffffff, 0.95));
    planet.add(makePoints(fibonacciSphere(narrow ? 700 : 1400, 2.92, 0.08), 0.034, 0xf8fafc, 0.55));
    const ringPositions = new Float32Array((narrow ? 420 : 900) * 3);
    for (let i = 0; i < ringPositions.length / 3; i++) {
      const a = (i / (ringPositions.length / 3)) * Math.PI * 2 + Math.random() * 0.02;
      const r = 3.35 + (Math.random() - 0.5) * 0.12;
      ringPositions[i * 3] = Math.cos(a) * r;
      ringPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.08;
      ringPositions[i * 3 + 2] = Math.sin(a) * r;
    }
    const ring = makePoints(ringPositions, 0.02, 0xe2e8f0, 0.7);
    ring.rotation.x = 0.42;
    ring.rotation.z = -0.18;
    planet.add(ring);
    world.add(planet);

    const stars = makePoints(starField(narrow ? 900 : 1800, 8, 28), 0.028, 0xffffff, 0.85);
    scene.add(stars);

    const rocket = buildRocket();
    rocket.position.set(0.05, 0.08, 0.55);
    rocket.rotation.set(-0.18, 0.42, 0.12);
    rocket.scale.setScalar(narrow ? 0.92 : 1.08);
    world.add(rocket);

    scene.add(new THREE.AmbientLight(0x6b7c93, 0.35));
    const key = new THREE.DirectionalLight(0xffffff, 2.1);
    key.position.set(3.4, 4.2, 3.8);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x94a3b8, 1.25);
    rim.position.set(-4.2, 1.2, -2.4);
    scene.add(rim);
    const fill = new THREE.PointLight(0x10b981, 6.5, 8, 2);
    fill.position.set(-1.2, 0.4, 2.2);
    scene.add(fill);
    const engine = new THREE.PointLight(0xff7a2e, 10, 4.5, 2);
    engine.position.set(0.05, -1.55, 0.55);
    world.add(engine);

    const pointer = { x: 0, y: 0, down: false, lastX: 0, lastY: 0, velX: 0, velY: 0 };
    const spherical = { yaw: 0.15, pitch: -0.08 };

    const onPointerDown = (e: PointerEvent) => {
      pointer.down = true;
      pointer.lastX = e.clientX;
      pointer.lastY = e.clientY;
      host.setPointerCapture(e.pointerId);
    };
    const onPointerUp = (e: PointerEvent) => {
      pointer.down = false;
      host.releasePointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      if (!pointer.down) return;
      const dx = e.clientX - pointer.lastX;
      const dy = e.clientY - pointer.lastY;
      pointer.velX = dx * 0.005;
      pointer.velY = dy * 0.004;
      spherical.yaw += pointer.velX;
      spherical.pitch = THREE.MathUtils.clamp(spherical.pitch + pointer.velY, -0.55, 0.45);
      pointer.lastX = e.clientX;
      pointer.lastY = e.clientY;
    };
    host.addEventListener("pointerdown", onPointerDown);
    host.addEventListener("pointerup", onPointerUp);
    host.addEventListener("pointerleave", onPointerUp);
    host.addEventListener("pointermove", onPointerMove);

    const onResize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(host);

    let frame = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      frame = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();
      const plume = rocket.userData.plume as THREE.Mesh;
      const plumeMat = plume.material as THREE.MeshBasicMaterial;
      plume.scale.set(1 + Math.sin(t * 18) * 0.08, 1 + Math.sin(t * 22) * 0.12, 1);
      plumeMat.opacity = 0.28 + Math.sin(t * 16) * 0.12;
      engine.intensity = 8.5 + Math.sin(t * 14) * 2.2;

      if (!reducedMotion) {
        planet.rotation.y = t * 0.045;
        ring.rotation.z = -0.18 + t * 0.02;
        stars.rotation.y = t * 0.008;
        rocket.position.y = 0.08 + Math.sin(t * 1.15) * 0.06;
        if (!pointer.down) {
          spherical.yaw += 0.0016;
          spherical.yaw += pointer.velX;
          spherical.pitch += pointer.velY;
          pointer.velX *= 0.94;
          pointer.velY *= 0.94;
        }
      }

      world.rotation.y = spherical.yaw;
      world.rotation.x = spherical.pitch;
      camera.position.x = 0.15 + pointer.x * 0.18;
      camera.position.y = 0.35 + pointer.y * -0.1;
      camera.lookAt(0, 0.15, 0);
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      host.removeEventListener("pointerdown", onPointerDown);
      host.removeEventListener("pointerup", onPointerUp);
      host.removeEventListener("pointerleave", onPointerUp);
      host.removeEventListener("pointermove", onPointerMove);
      renderer.dispose();
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const mat = mesh.material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else if (mat) mat.dispose();
      });
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={hostRef}
      data-testid="rocket-scene"
      className="absolute inset-0 h-full w-full touch-none"
    />
  );
}
