const canvas = document.querySelector("#hero3d");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canvas && !prefersReducedMotion) {
  import("https://unpkg.com/three@0.160.0/build/three.module.js")
    .then((THREE) => initThreeScene(THREE))
    .catch(() => initCanvasFallback());
}

function initThreeScene(THREE) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 8.5);

  const group = new THREE.Group();
  scene.add(group);

  const warmLight = new THREE.PointLight(0xffdca8, 2.4, 18);
  warmLight.position.set(3, 2.4, 4);
  scene.add(warmLight);

  const roseLight = new THREE.PointLight(0xff7fa1, 1.8, 16);
  roseLight.position.set(-3, -1.8, 3);
  scene.add(roseLight);

  scene.add(new THREE.AmbientLight(0xffffff, 1.15));

  const rose = new THREE.MeshStandardMaterial({
    color: 0xb84f6a,
    roughness: 0.35,
    metalness: 0.12
  });
  const gold = new THREE.MeshStandardMaterial({
    color: 0xefd4a6,
    roughness: 0.26,
    metalness: 0.45
  });
  const ivory = new THREE.MeshStandardMaterial({
    color: 0xfff4ea,
    roughness: 0.48,
    metalness: 0.04
  });
  const sage = new THREE.MeshStandardMaterial({
    color: 0x6f8066,
    roughness: 0.42,
    metalness: 0.12
  });

  const compact = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.82, 0.16, 72), gold);
  compact.rotation.x = Math.PI / 2.4;
  compact.position.set(2.65, -0.9, -0.4);
  group.add(compact);

  const compactGlow = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.035, 16, 96), rose);
  compactGlow.rotation.x = Math.PI / 2.4;
  compactGlow.position.copy(compact.position);
  group.add(compactGlow);

  const lipstickBase = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 1.1, 36), gold);
  lipstickBase.position.set(3.7, 0.32, 0.1);
  lipstickBase.rotation.z = -0.18;
  group.add(lipstickBase);

  const lipstickTip = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.52, 36), rose);
  lipstickTip.position.set(3.6, 1.1, 0.1);
  lipstickTip.rotation.z = -0.18;
  group.add(lipstickTip);

  const brushHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 2.25, 20), sage);
  brushHandle.position.set(1.25, 1.15, -0.25);
  brushHandle.rotation.z = 0.82;
  group.add(brushHandle);

  const brushTop = new THREE.Mesh(new THREE.SphereGeometry(0.34, 32, 18), ivory);
  brushTop.scale.set(1, 0.58, 0.7);
  brushTop.position.set(0.56, 1.84, -0.23);
  group.add(brushTop);

  const pearlMaterial = new THREE.MeshStandardMaterial({
    color: 0xffe5ed,
    roughness: 0.25,
    metalness: 0.08,
    emissive: 0x4a1625,
    emissiveIntensity: 0.08
  });

  const pearls = [];
  for (let i = 0; i < 42; i += 1) {
    const pearl = new THREE.Mesh(new THREE.SphereGeometry(0.035 + Math.random() * 0.055, 16, 12), pearlMaterial);
    pearl.position.set(
      1.1 + Math.random() * 4.4,
      -2.05 + Math.random() * 4.3,
      -1.4 + Math.random() * 1.7
    );
    pearl.userData = {
      speed: 0.35 + Math.random() * 0.8,
      lift: 0.08 + Math.random() * 0.22,
      baseY: pearl.position.y
    };
    pearls.push(pearl);
    group.add(pearl);
  }

  const rings = [];
  for (let i = 0; i < 3; i += 1) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.1 + i * 0.38, 0.012, 10, 140), gold);
    ring.position.set(2.85, 0.18, -1.1 - i * 0.2);
    ring.rotation.set(Math.PI / 2.5, 0.2 + i * 0.25, 0.05);
    ring.material.transparent = true;
    ring.material.opacity = 0.52 - i * 0.11;
    rings.push(ring);
    group.add(ring);
  }

  const resize = () => {
    const { width, height } = canvas.getBoundingClientRect();
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    group.position.x = width < 760 ? 0.7 : 0.45;
  };

  window.addEventListener("resize", resize);
  resize();

  let pointerX = 0;
  let pointerY = 0;

  window.addEventListener("pointermove", (event) => {
    pointerX = (event.clientX / window.innerWidth - 0.5) * 0.35;
    pointerY = (event.clientY / window.innerHeight - 0.5) * 0.25;
  });

  const clock = new THREE.Clock();

  const animate = () => {
    const time = clock.getElapsedTime();
    group.rotation.y = Math.sin(time * 0.28) * 0.08 + pointerX;
    group.rotation.x = Math.sin(time * 0.22) * 0.045 + pointerY;
    compact.rotation.z = time * 0.18;
    compactGlow.rotation.z = -time * 0.24;
    lipstickBase.position.y = 0.32 + Math.sin(time * 1.1) * 0.08;
    lipstickTip.position.y = 1.1 + Math.sin(time * 1.1) * 0.08;
    brushHandle.rotation.z = 0.82 + Math.sin(time * 0.85) * 0.08;
    brushTop.position.y = 1.84 + Math.sin(time * 0.85) * 0.08;

    pearls.forEach((pearl, index) => {
      pearl.position.y = pearl.userData.baseY + Math.sin(time * pearl.userData.speed + index) * pearl.userData.lift;
      pearl.rotation.y += 0.012;
    });

    rings.forEach((ring, index) => {
      ring.rotation.z = time * (0.1 + index * 0.04);
      ring.scale.setScalar(1 + Math.sin(time * 0.9 + index) * 0.025);
    });

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  animate();
}

function initCanvasFallback() {
  const context = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let animationFrame = 0;

  const resize = () => {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.8);
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.max(1, Math.floor(width * pixelRatio));
    canvas.height = Math.max(1, Math.floor(height * pixelRatio));
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  };

  const draw = (time) => {
    context.clearRect(0, 0, width, height);
    const centerX = width * 0.76;
    const centerY = height * 0.48;

    for (let i = 0; i < 34; i += 1) {
      const angle = time * 0.00025 + i * 0.55;
      const radius = 70 + (i % 7) * 24;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle * 1.25) * radius * 0.48;
      context.beginPath();
      context.fillStyle = i % 3 === 0 ? "rgba(239, 212, 166, 0.58)" : "rgba(255, 184, 204, 0.46)";
      context.arc(x, y, 4 + (i % 4), 0, Math.PI * 2);
      context.fill();
    }

    context.save();
    context.translate(centerX, centerY);
    context.rotate(Math.sin(time * 0.001) * 0.12);
    context.strokeStyle = "rgba(239, 212, 166, 0.56)";
    context.lineWidth = 2;
    for (let i = 0; i < 3; i += 1) {
      context.beginPath();
      context.ellipse(0, 0, 92 + i * 34, 36 + i * 12, 0.2, 0, Math.PI * 2);
      context.stroke();
    }
    context.fillStyle = "rgba(184, 79, 106, 0.72)";
    context.fillRect(98, -64 + Math.sin(time * 0.0012) * 8, 28, 94);
    context.fillStyle = "rgba(239, 212, 166, 0.84)";
    context.fillRect(92, 24 + Math.sin(time * 0.0012) * 8, 40, 68);
    context.restore();

    animationFrame = requestAnimationFrame(draw);
  };

  window.addEventListener("resize", resize);
  resize();
  animationFrame = requestAnimationFrame(draw);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrame);
    } else {
      animationFrame = requestAnimationFrame(draw);
    }
  });
}
