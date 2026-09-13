"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

function fibonacciSphere(count: number, radius: number, jitter = 0.012) {
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

function glowTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.35, "rgba(255,255,255,0.55)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makePoints(
  positions: Float32Array,
  size: number,
  color: number,
  opacity: number,
  map: THREE.Texture | null,
) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color,
    size,
    map: map ?? undefined,
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
    metalness: 0.86,
    roughness: 0.3,
    ...extras,
  });
}

function buildRocket() {
  const rocket = new THREE.Group();
  const hull = metal(0xe4e9f1);
  const dark = metal(0x1b2028, { roughness: 0.46, metalness: 0.72 });
  const accent = metal(0x10b981, { emissive: 0x065f46, emissiveIntensity: 0.55 });
  const noseMat = metal(0x2a3038, { roughness: 0.35 });

  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.62, 28), noseMat);
  nose.position.y = 1.28;
  rocket.add(nose);

  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.26, 0.1, 28), accent);
  collar.position.y = 0.94;
  rocket.add(collar);

  const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.32, 0.62, 32), hull);
  upper.position.y = 0.58;
  rocket.add(upper);

  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.325, 0.325, 0.055, 32), accent);
  band.position.y = 0.24;
  rocket.add(band);

  const mid = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.34, 0.78, 32), hull);
  mid.position.y = -0.18;
  rocket.add(mid);

  const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.15, 0.68), accent);
  stripe.position.y = 0.16;
  rocket.add(stripe);

  const lower = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.28, 0.32, 32), dark);
  lower.position.y = -0.72;
  rocket.add(lower);

  const windowGlass = new THREE.Mesh(
    new THREE.SphereGeometry(0.085, 24, 16),
    new THREE.MeshStandardMaterial({
      color: 0xd8f3ff,
      emissive: 0x38bdf8,
      emissiveIntensity: 1.05,
      metalness: 0.15,
      roughness: 0.08,
    }),
  );
  windowGlass.position.set(0, 0.52, 0.29);
  rocket.add(windowGlass);

  const windowRing = new THREE.Mesh(new THREE.TorusGeometry(0.095, 0.014, 12, 28), dark);
  windowRing.position.copy(windowGlass.position);
  windowRing.lookAt(0, 0.52, 1);
  rocket.add(windowRing);

  const finGeom = new THREE.BoxGeometry(0.06, 0.42, 0.34);
  finGeom.translate(0.36, -0.68, 0);
  const finTip = new THREE.ConeGeometry(0.12, 0.28, 3);
  finTip.rotateZ(-Math.PI / 2);
  finTip.translate(0.58, -0.78, 0);
  for (let i = 0; i < 4; i++) {
    const fin = new THREE.Mesh(finGeom, dark);
    fin.rotation.y = (i * Math.PI) / 2;
    rocket.add(fin);
    const tip = new THREE.Mesh(finTip, accent);
    tip.rotation.y = (i * Math.PI) / 2;
    rocket.add(tip);
  }

  const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.23, 0.26, 24), dark);
  nozzle.position.y = -1.0;
  rocket.add(nozzle);

  const throat = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.14, 0.1, 20),
    new THREE.MeshStandardMaterial({
      color: 0xffb36b,
      emissive: 0xff6a1a,
      emissiveIntensity: 1.9,
      metalness: 0.3,
      roughness: 0.35,
    }),
  );
  throat.position.y = -1.16;
  rocket.add(throat);

  const plume = new THREE.Mesh(
    new THREE.ConeGeometry(0.16, 0.62, 20, 1, true),
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
  plume.position.y = -1.52;
  rocket.add(plume);

  rocket.userData.plume = plume;
  return rocket;
}

export default function RocketScene() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const narrow = host.clientWidth < 640;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sprite = glowTexture();

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
    renderer.toneMappingExposure = 1.2;
    host.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.setAttribute("aria-hidden", "true");

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.028);

    const camera = new THREE.PerspectiveCamera(
      36,
      host.clientWidth / host.clientHeight,
      0.1,
      90,
    );
    camera.position.set(0, narrow ? 0.55 : 0.22, narrow ? 6.8 : 6.1);

    const world = new THREE.Group();
    scene.add(world);

    const planet = new THREE.Group();
    planet.add(
      makePoints(
        fibonacciSphere(narrow ? 4200 : 9000, 2.55, 0.016),
        narrow ? 0.046 : 0.052,
        0xffffff,
        0.95,
        sprite,
      ),
    );
    planet.add(
      makePoints(
        fibonacciSphere(narrow ? 900 : 1800, 2.62, 0.05),
        0.09,
        0xf8fafc,
        0.7,
        sprite,
      ),
    );
    const ringCount = narrow ? 520 : 1100;
    const ringPositions = new Float32Array(ringCount * 3);
    for (let i = 0; i < ringCount; i++) {
      const a = (i / ringCount) * Math.PI * 2 + Math.random() * 0.015;
      const r = 3.05 + (Math.random() - 0.5) * 0.1;
      ringPositions[i * 3] = Math.cos(a) * r;
      ringPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.06;
      ringPositions[i * 3 + 2] = Math.sin(a) * r;
    }
    const ring = makePoints(ringPositions, 0.04, 0xe2e8f0, 0.85, sprite);
    ring.rotation.x = 0.48;
    ring.rotation.z = -0.16;
    planet.add(ring);
    world.add(planet);

    const stars = makePoints(starField(narrow ? 700 : 1400, 10, 32), 0.045, 0xffffff, 0.75, sprite);
    scene.add(stars);

    const rocket = buildRocket();
    rocket.position.set(0.02, 0.06, 0.72);
    rocket.rotation.set(-0.16, 0.48, 0.1);
    rocket.scale.setScalar(narrow ? 0.78 : 0.92);
    world.add(rocket);

    scene.add(new THREE.AmbientLight(0x7b8aa0, 0.4));
    const key = new THREE.DirectionalLight(0xffffff, 2.15);
    key.position.set(3.2, 4.0, 3.6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x94a3b8, 1.2);
    rim.position.set(-4.0, 1.1, -2.2);
    scene.add(rim);
    const fill = new THREE.PointLight(0x10b981, 7.2, 8.5, 2);
    fill.position.set(-1.1, 0.35, 2.1);
    scene.add(fill);
    const engine = new THREE.PointLight(0xff7a2e, 10, 4.5, 2);
    engine.position.set(0.02, -1.35, 0.72);
    world.add(engine);

    const pointer = { x: 0, y: 0, down: false, lastX: 0, lastY: 0, velX: 0, velY: 0 };
    const spherical = { yaw: 0.12, pitch: -0.06 };

    const onPointerDown = (e: PointerEvent) => {
      pointer.down = true;
      pointer.lastX = e.clientX;
      pointer.lastY = e.clientY;
      host.setPointerCapture(e.pointerId);
    };
    const onPointerUp = (e: PointerEvent) => {
      pointer.down = false;
      try {
        host.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
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
        planet.rotation.y = t * 0.05;
        ring.rotation.z = -0.16 + t * 0.018;
        stars.rotation.y = t * 0.008;
        rocket.position.y = 0.06 + Math.sin(t * 1.15) * 0.05;
        if (!pointer.down) {
          spherical.yaw += 0.0014 + pointer.velX;
          spherical.pitch += pointer.velY;
          pointer.velX *= 0.94;
          pointer.velY *= 0.94;
        }
      }

      world.rotation.y = spherical.yaw;
      world.rotation.x = spherical.pitch;
      camera.position.x = pointer.x * 0.16;
      camera.position.y = (narrow ? 0.55 : 0.22) + pointer.y * -0.08;
      camera.lookAt(0, narrow ? 0.35 : 0.08, 0);
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
      sprite?.dispose();
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
