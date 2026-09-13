"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { HeroSceneStatus } from "./scene-types";

type Props = {
  onStatus?: (status: HeroSceneStatus) => void;
};

function glowTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.28, "rgba(255,255,255,0.7)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function nebulaTexture() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const g = ctx.createRadialGradient(128, 140, 10, 128, 128, 128);
  g.addColorStop(0, "rgba(16,185,129,0.55)");
  g.addColorStop(0.4, "rgba(56,189,248,0.18)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeTwinkleField(
  count: number,
  placer: (i: number, out: THREE.Vector3) => void,
  sizeMin: number,
  sizeMax: number,
  map: THREE.Texture | null,
  color: THREE.Color,
) {
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);
  const vec = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    placer(i, vec);
    positions[i * 3] = vec.x;
    positions[i * 3 + 1] = vec.y;
    positions[i * 3 + 2] = vec.z;
    sizes[i] = sizeMin + Math.random() * (sizeMax - sizeMin);
    phases[i] = Math.random() * Math.PI * 2;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uMap: { value: map },
      uColor: { value: color },
      uOpacity: { value: 0.95 },
    },
    vertexShader: `
      attribute float aSize;
      attribute float aPhase;
      uniform float uTime;
      varying float vAlpha;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float twinkle = 0.62 + 0.38 * sin(uTime * 1.7 + aPhase);
        vAlpha = twinkle;
        gl_PointSize = aSize * twinkle * (300.0 / max(1.1, -mv.z));
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      uniform sampler2D uMap;
      uniform vec3 uColor;
      uniform float uOpacity;
      varying float vAlpha;
      void main() {
        vec4 tex = texture2D(uMap, gl_PointCoord);
        float a = tex.a * uOpacity * vAlpha;
        if (a < 0.03) discard;
        gl_FragColor = vec4(uColor * 1.35, a);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
  return new THREE.Points(geometry, material);
}

function fibonacciPlacer(count: number, radius: number, jitter: number) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return (i: number, out: THREE.Vector3) => {
    const y = 1 - (i / Math.max(1, count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    const rad = radius * (1 + (Math.random() - 0.5) * jitter);
    out.set(Math.cos(theta) * r * rad, y * rad, Math.sin(theta) * r * rad);
  };
}

function ringPlacer(count: number, radius: number, spread: number) {
  return (i: number, out: THREE.Vector3) => {
    const a = (i / count) * Math.PI * 2 + Math.random() * 0.02;
    const r = radius + (Math.random() - 0.5) * spread;
    out.set(Math.cos(a) * r, (Math.random() - 0.5) * 0.05, Math.sin(a) * r);
  };
}

function starPlacer(minR: number, maxR: number) {
  return (_i: number, out: THREE.Vector3) => {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = minR + Math.random() * (maxR - minR);
    out.set(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi),
    );
  };
}

function metal(color: number, extras: THREE.MeshStandardMaterialParameters = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: 0.92,
    roughness: 0.22,
    envMapIntensity: 1.15,
    ...extras,
  });
}

function buildRocket() {
  const rocket = new THREE.Group();
  const hull = metal(0xe8edf4);
  const dark = metal(0x161b22, { roughness: 0.4, metalness: 0.78 });
  const accent = metal(0x10b981, { emissive: 0x064e3b, emissiveIntensity: 0.7 });
  const noseMat = metal(0x2c333c, { roughness: 0.28 });

  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.58, 40), noseMat);
  nose.position.y = 1.32;
  rocket.add(nose);

  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.16, 10), dark);
  tip.position.y = 1.66;
  rocket.add(tip);

  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 0.09, 36), accent);
  collar.position.y = 0.99;
  rocket.add(collar);

  const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.31, 0.58, 40), hull);
  upper.position.y = 0.65;
  rocket.add(upper);

  const seamA = new THREE.Mesh(new THREE.TorusGeometry(0.312, 0.01, 10, 40), dark);
  seamA.rotation.x = Math.PI / 2;
  seamA.position.y = 0.36;
  rocket.add(seamA);

  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.315, 0.315, 0.05, 40), accent);
  band.position.y = 0.28;
  rocket.add(band);

  const mid = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.335, 0.82, 40), hull);
  mid.position.y = -0.16;
  rocket.add(mid);

  const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.035, 1.22, 0.67), accent);
  stripe.position.y = 0.18;
  rocket.add(stripe);

  const panel = new THREE.Mesh(
    new THREE.BoxGeometry(0.62, 0.34, 0.02),
    metal(0xcbd5e1, { roughness: 0.18, metalness: 0.95 }),
  );
  panel.position.set(0, 0.02, 0.325);
  rocket.add(panel);

  const glassMat = new THREE.MeshStandardMaterial({
    color: 0xb8ecff,
    emissive: 0x38bdf8,
    emissiveIntensity: 1.35,
    metalness: 0.12,
    roughness: 0.08,
  });
  const ports = [
    [0, 0.62, 0.29],
    [0.13, 0.08, 0.325],
    [-0.13, 0.08, 0.325],
  ] as const;
  for (const [x, y, z] of ports) {
    const glass = new THREE.Mesh(new THREE.SphereGeometry(0.055, 20, 14), glassMat);
    glass.position.set(x, y, z);
    rocket.add(glass);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.062, 0.01, 10, 22), dark);
    ring.position.copy(glass.position);
    ring.lookAt(x, y, z + 1);
    rocket.add(ring);
  }

  const lower = new THREE.Mesh(new THREE.CylinderGeometry(0.335, 0.27, 0.3, 40), dark);
  lower.position.y = -0.72;
  rocket.add(lower);

  const rcsMat = accent;
  for (let i = 0; i < 4; i++) {
    const rcs = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.08), rcsMat);
    const a = (i * Math.PI) / 2 + Math.PI / 4;
    rcs.position.set(Math.cos(a) * 0.34, 0.42, Math.sin(a) * 0.34);
    rocket.add(rcs);
  }

  const finShape = new THREE.Shape();
  finShape.moveTo(0, 0);
  finShape.lineTo(0.52, -0.22);
  finShape.lineTo(0.5, -0.48);
  finShape.lineTo(0, -0.3);
  finShape.closePath();
  const finGeom = new THREE.ExtrudeGeometry(finShape, { depth: 0.05, bevelEnabled: false });
  finGeom.translate(0.28, -0.58, -0.025);
  for (let i = 0; i < 4; i++) {
    const fin = new THREE.Mesh(finGeom, dark);
    fin.rotation.y = (i * Math.PI) / 2;
    rocket.add(fin);
    const edge = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.22, 0.06), accent);
    edge.position.set(0.72, -0.92, 0);
    const holder = new THREE.Group();
    holder.rotation.y = (i * Math.PI) / 2;
    holder.add(edge);
    rocket.add(holder);
  }

  const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.24, 0.28, 32), dark);
  nozzle.position.y = -1.02;
  rocket.add(nozzle);

  const innerBell = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.13, 0.12, 24),
    new THREE.MeshStandardMaterial({
      color: 0xffb36b,
      emissive: 0xff6a1a,
      emissiveIntensity: 2.4,
      metalness: 0.2,
      roughness: 0.3,
    }),
  );
  innerBell.position.y = -1.18;
  rocket.add(innerBell);

  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 16, 12),
    new THREE.MeshBasicMaterial({ color: 0xfff4cc }),
  );
  core.position.y = -1.22;
  rocket.add(core);

  const plume = new THREE.Mesh(
    new THREE.ConeGeometry(0.15, 0.78, 24, 1, true),
    new THREE.MeshBasicMaterial({
      color: 0xffc27a,
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
      toneMapped: false,
    }),
  );
  plume.rotation.x = Math.PI;
  plume.position.y = -1.62;
  rocket.add(plume);

  const plumeCore = new THREE.Mesh(
    new THREE.ConeGeometry(0.06, 0.55, 16, 1, true),
    new THREE.MeshBasicMaterial({
      color: 0xfff3d0,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
      toneMapped: false,
    }),
  );
  plumeCore.rotation.x = Math.PI;
  plumeCore.position.y = -1.5;
  rocket.add(plumeCore);

  rocket.userData.plume = plume;
  rocket.userData.plumeCore = plumeCore;
  rocket.userData.core = core;
  return rocket;
}

function makeExhaust(count: number, map: THREE.Texture | null) {
  const positions = new Float32Array(count * 3);
  const speeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 0.16;
    positions[i * 3 + 1] = -1.25 - Math.random() * 1.4;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.16;
    speeds[i] = 0.9 + Math.random() * 1.6;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: 0xffd7a1,
    size: 0.045,
    map: map ?? undefined,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
    toneMapped: false,
  });
  const points = new THREE.Points(geometry, material);
  points.userData.speeds = speeds;
  return points;
}

export default function RocketScene({ onStatus }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef(onStatus);
  statusRef.current = onStatus;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const narrow = host.clientWidth < 640;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sprite = glowTexture();
    const nebulaMap = nebulaTexture();

    const renderer = new THREE.WebGLRenderer({
      antialias: !narrow,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, narrow ? 1.4 : 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.setClearColor(0x000000, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    host.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.setAttribute("aria-hidden", "true");

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.022);

    const camera = new THREE.PerspectiveCamera(
      34,
      host.clientWidth / host.clientHeight,
      0.1,
      90,
    );
    const baseZ = narrow ? 6.6 : 5.85;
    camera.position.set(0, narrow ? 0.5 : 0.18, baseZ);

    let envMap: THREE.Texture | null = null;
    try {
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envScene = new THREE.Scene();
      envScene.add(new THREE.HemisphereLight(0xb9d4ff, 0x0b1220, 1.2));
      const envKey = new THREE.DirectionalLight(0xffffff, 1.4);
      envKey.position.set(4, 6, 2);
      envScene.add(envKey);
      const envFill = new THREE.PointLight(0x10b981, 8, 20);
      envFill.position.set(-4, 1, 3);
      envScene.add(envFill);
      envMap = pmrem.fromScene(envScene, 0.04).texture;
      scene.environment = envMap;
      pmrem.dispose();
    } catch {
      scene.environment = null;
    }

    const world = new THREE.Group();
    scene.add(world);

    const nebula = new THREE.Mesh(
      new THREE.PlaneGeometry(9.5, 9.5),
      new THREE.MeshBasicMaterial({
        map: nebulaMap ?? undefined,
        transparent: true,
        opacity: 0.32,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    nebula.position.set(0.1, 0.1, -2.4);
    world.add(nebula);

    const planet = new THREE.Group();
    const shells = [
      makeTwinkleField(
        narrow ? 3800 : 8200,
        fibonacciPlacer(narrow ? 3800 : 8200, 2.48, 0.014),
        4.2,
        7.2,
        sprite,
        new THREE.Color(0xffffff),
      ),
      makeTwinkleField(
        narrow ? 800 : 1600,
        fibonacciPlacer(narrow ? 800 : 1600, 2.58, 0.05),
        8,
        14,
        sprite,
        new THREE.Color(0xf8fafc),
      ),
    ];
    shells.forEach((s) => planet.add(s));

    const ringA = makeTwinkleField(
      narrow ? 480 : 980,
      ringPlacer(narrow ? 480 : 980, 3.02, 0.1),
      4.5,
      8,
      sprite,
      new THREE.Color(0xe2e8f0),
    );
    ringA.rotation.x = 0.5;
    ringA.rotation.z = -0.18;
    planet.add(ringA);

    const ringB = makeTwinkleField(
      narrow ? 280 : 620,
      ringPlacer(narrow ? 280 : 620, 3.28, 0.08),
      3.6,
      6.5,
      sprite,
      new THREE.Color(0x99f6e4),
    );
    ringB.rotation.x = -0.72;
    ringB.rotation.y = 0.35;
    planet.add(ringB);
    world.add(planet);

    const stars = makeTwinkleField(
      narrow ? 600 : 1300,
      starPlacer(10, 30),
      5,
      10,
      sprite,
      new THREE.Color(0xffffff),
    );
    scene.add(stars);

    const rocket = buildRocket();
    rocket.position.set(0.02, 0.08, 0.78);
    rocket.rotation.set(-0.14, 0.46, 0.08);
    rocket.scale.setScalar(narrow ? 0.76 : 0.9);
    world.add(rocket);

    const exhaust = makeExhaust(narrow ? 160 : 360, sprite);
    rocket.add(exhaust);

    scene.add(new THREE.HemisphereLight(0xb7c7dd, 0x07090d, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 2.35);
    key.position.set(3.4, 4.2, 3.4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xa5b4c8, 1.35);
    rim.position.set(-4.2, 1.0, -2.4);
    scene.add(rim);
    const fill = new THREE.PointLight(0x10b981, 8.2, 9, 2);
    fill.position.set(-1.15, 0.4, 2.2);
    scene.add(fill);
    const engine = new THREE.PointLight(0xff7a2e, 12, 5, 2);
    engine.position.set(0.02, -1.4, 0.78);
    world.add(engine);

    const halo = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: sprite ?? undefined,
        color: 0x7dd3c7,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    halo.scale.set(4.8, 4.8, 1);
    halo.position.set(0, 0.1, -0.4);
    world.add(halo);

    const pointer = { x: 0, y: 0, down: false, lastX: 0, lastY: 0, velX: 0, velY: 0, moved: 0 };
    const spherical = { yaw: 0.1, pitch: -0.05 };
    let zoom = 1;
    let boost = 0;
    let lastStatus = "";

    const ignite = () => {
      boost = 1;
    };

    const onPointerDown = (e: PointerEvent) => {
      pointer.down = true;
      pointer.moved = 0;
      pointer.lastX = e.clientX;
      pointer.lastY = e.clientY;
      host.setPointerCapture(e.pointerId);
    };
    const onPointerUp = (e: PointerEvent) => {
      pointer.down = false;
      if (pointer.moved < 6) ignite();
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
      pointer.moved += Math.abs(dx) + Math.abs(dy);
      pointer.velX = dx * 0.005;
      pointer.velY = dy * 0.004;
      spherical.yaw += pointer.velX;
      spherical.pitch = THREE.MathUtils.clamp(spherical.pitch + pointer.velY, -0.6, 0.48);
      pointer.lastX = e.clientX;
      pointer.lastY = e.clientY;
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoom = THREE.MathUtils.clamp(zoom + e.deltaY * 0.0014, 0.72, 1.38);
    };
    const onDblClick = () => {
      spherical.yaw = 0.1;
      spherical.pitch = -0.05;
      zoom = 1;
    };
    const onIgniteEvent = () => ignite();

    host.addEventListener("pointerdown", onPointerDown);
    host.addEventListener("pointerup", onPointerUp);
    host.addEventListener("pointerleave", onPointerUp);
    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("wheel", onWheel, { passive: false });
    host.addEventListener("dblclick", onDblClick);
    window.addEventListener("wapulse-hero-ignite", onIgniteEvent);

    const onResize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, narrow ? 1.4 : 2));
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(host);

    let frame = 0;
    const timer = new THREE.Timer();
    timer.connect(document);

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      timer.update(now);
      const t = timer.getElapsed();
      const dt = Math.min(timer.getDelta(), 0.05);
      boost = Math.max(0, boost - dt * 1.15);

      const twinkleMats = [...shells, ringA, ringB, stars].map(
        (p) => p.material as THREE.ShaderMaterial,
      );
      for (const mat of twinkleMats) mat.uniforms.uTime.value = t;

      const plume = rocket.userData.plume as THREE.Mesh;
      const plumeCore = rocket.userData.plumeCore as THREE.Mesh;
      const core = rocket.userData.core as THREE.Mesh;
      const plumeMat = plume.material as THREE.MeshBasicMaterial;
      const coreMat = plumeCore.material as THREE.MeshBasicMaterial;
      const flicker = 1 + Math.sin(t * 22) * 0.1 + boost * 0.55;
      plume.scale.set(flicker, 1 + Math.sin(t * 18) * 0.14 + boost * 0.45, flicker);
      plumeCore.scale.set(1, 1 + boost * 0.5 + Math.sin(t * 26) * 0.1, 1);
      plumeMat.opacity = 0.26 + Math.sin(t * 16) * 0.1 + boost * 0.28;
      coreMat.opacity = 0.55 + boost * 0.3;
      core.scale.setScalar(1 + boost * 0.45 + Math.sin(t * 20) * 0.08);
      engine.intensity = 9 + Math.sin(t * 14) * 2.4 + boost * 10;
      const haloMat = halo.material as THREE.SpriteMaterial;
      haloMat.opacity = 0.18 + Math.sin(t * 1.4) * 0.04 + boost * 0.16;
      halo.scale.setScalar(4.6 + boost * 1.2 + Math.sin(t * 1.1) * 0.15);

      const pos = exhaust.geometry.getAttribute("position") as THREE.BufferAttribute;
      const speeds = exhaust.userData.speeds as Float32Array;
      for (let i = 0; i < pos.count; i++) {
        let y = pos.getY(i) - (speeds[i] + boost * 2.2) * dt;
        if (y < -2.7) {
          pos.setXYZ(i, (Math.random() - 0.5) * 0.14, -1.2 - Math.random() * 0.08, (Math.random() - 0.5) * 0.14);
        } else {
          pos.setY(i, y);
        }
      }
      pos.needsUpdate = true;

      if (!reducedMotion) {
        planet.rotation.y = t * 0.048;
        ringA.rotation.z = -0.18 + t * 0.02;
        ringB.rotation.z = t * -0.028;
        stars.rotation.y = t * 0.007;
        nebula.rotation.z = t * 0.01;
        rocket.position.y = 0.08 + Math.sin(t * 1.2) * 0.045 + boost * 0.18;
        rocket.rotation.x = -0.14 + pointer.y * 0.05;
        rocket.rotation.z = 0.08 + pointer.x * 0.06;
        if (!pointer.down) {
          spherical.yaw += 0.00125 + pointer.velX;
          spherical.pitch += pointer.velY;
          pointer.velX *= 0.93;
          pointer.velY *= 0.93;
        }
      }

      world.rotation.y = spherical.yaw;
      world.rotation.x = spherical.pitch;
      const breathe = reducedMotion ? 0 : Math.sin(t * 0.32) * 0.07;
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.2, 0.06);
      camera.position.y = THREE.MathUtils.lerp(
        camera.position.y,
        (narrow ? 0.5 : 0.18) + pointer.y * -0.1,
        0.06,
      );
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, baseZ * zoom + breathe, 0.08);
      camera.lookAt(0, narrow ? 0.32 : 0.06, 0);
      renderer.render(scene, camera);

      const nextStatus = `${boost > 0.08}|${zoom.toFixed(2)}|${pointer.down}`;
      if (nextStatus !== lastStatus) {
        lastStatus = nextStatus;
        statusRef.current?.({
          thrusting: boost > 0.08,
          zoom,
          orbiting: pointer.down,
        });
      }
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      timer.dispose();
      resizeObserver.disconnect();
      host.removeEventListener("pointerdown", onPointerDown);
      host.removeEventListener("pointerup", onPointerUp);
      host.removeEventListener("pointerleave", onPointerUp);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("wheel", onWheel);
      host.removeEventListener("dblclick", onDblClick);
      window.removeEventListener("wapulse-hero-ignite", onIgniteEvent);
      sprite?.dispose();
      nebulaMap?.dispose();
      envMap?.dispose();
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
