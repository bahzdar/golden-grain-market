/* ============================================================
   Three.js — Ambient 3D Floating Hearts & Crystal Particles
   ============================================================ */

(function () {
  "use strict";

  const container = document.getElementById("three-container");
  if (!container || typeof THREE === "undefined") {
    // Retry shortly if Three.js still loading
    if (container && typeof THREE === "undefined") {
      window.addEventListener("load", init, { once: true });
    }
    return;
  }

  init();

  function init() {
    if (!window.THREE) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = window.innerWidth;
    let H = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    renderer.domElement.style.pointerEvents = "none";

    // Lights
    const ambient = new THREE.AmbientLight(0xff80ab, 0.55);
    scene.add(ambient);

    const point1 = new THREE.PointLight(0xff1744, 1.4, 30);
    point1.position.set(3, 2, 4);
    scene.add(point1);

    const point2 = new THREE.PointLight(0xffd700, 0.9, 25);
    point2.position.set(-3, -1, 3);
    scene.add(point2);

    const point3 = new THREE.PointLight(0xff80ab, 0.7, 20);
    point3.position.set(0, 3, 2);
    scene.add(point3);

    /* ---- Heart Shape Geometry ---- */
    function createHeartShape() {
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.bezierCurveTo(0, -0.3, -0.6, -0.8, -1.2, -0.3);
      shape.bezierCurveTo(-1.8, 0.3, -1.2, 1.1, 0, 1.8);
      shape.bezierCurveTo(1.2, 1.1, 1.8, 0.3, 1.2, -0.3);
      shape.bezierCurveTo(0.6, -0.8, 0, -0.3, 0, 0);
      return shape;
    }

    function makeHeartMesh(scale, color, opacity) {
      const shape = createHeartShape();
      const extrudeSettings = {
        depth: 0.35,
        bevelEnabled: true,
        bevelThickness: 0.12,
        bevelSize: 0.1,
        bevelSegments: 4,
        curveSegments: 12,
      };
      const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geo.center();
      geo.rotateX(Math.PI); // point up

      const mat = new THREE.MeshPhysicalMaterial({
        color: color,
        metalness: 0.55,
        roughness: 0.2,
        transparent: true,
        opacity: opacity,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        reflectivity: 0.9,
        emissive: color,
        emissiveIntensity: 0.25,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.scale.setScalar(scale);
      return mesh;
    }

    // Central large crystal heart (subtle, behind CSS heart)
    const mainHeart = makeHeartMesh(0.55, 0xff1744, 0.35);
    mainHeart.position.set(0, 0.2, -1);
    scene.add(mainHeart);

    // Orbiting small hearts
    const orbitHearts = [];
    const orbitCount = reduced ? 4 : 10;
    const colors = [0xff1744, 0xff80ab, 0xffd700, 0xe91e63, 0xff4081, 0xf8bbd0];

    for (let i = 0; i < orbitCount; i++) {
      const h = makeHeartMesh(rand(0.08, 0.18), colors[i % colors.length], rand(0.4, 0.85));
      const angle = (i / orbitCount) * Math.PI * 2;
      const radius = rand(2.5, 5);
      h.userData = {
        angle,
        radius,
        speed: rand(0.003, 0.01) * (Math.random() > 0.5 ? 1 : -1),
        ySpeed: rand(0.005, 0.015),
        yOffset: rand(-1.5, 1.5),
        yAmp: rand(0.4, 1.2),
        spin: rand(0.01, 0.03),
      };
      scene.add(h);
      orbitHearts.push(h);
    }

    // Diamond/crystal floating particles
    const crystalGeo = new THREE.OctahedronGeometry(0.08, 0);
    const crystals = [];
    const crystalCount = reduced ? 20 : 55;

    for (let i = 0; i < crystalCount; i++) {
      const mat = new THREE.MeshPhysicalMaterial({
        color: pick([0xffd700, 0xffffff, 0xff80ab, 0xff1744]),
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: rand(0.3, 0.8),
        emissive: 0xffd700,
        emissiveIntensity: 0.15,
      });
      const m = new THREE.Mesh(crystalGeo, mat);
      m.position.set(rand(-7, 7), rand(-5, 5), rand(-4, 2));
      m.userData = {
        vx: rand(-0.005, 0.005),
        vy: rand(0.002, 0.01),
        vz: rand(-0.003, 0.003),
        rx: rand(0.01, 0.03),
        ry: rand(0.01, 0.03),
      };
      scene.add(m);
      crystals.push(m);
    }

    // Soft particle points (glitter cloud)
    const pCount = reduced ? 200 : 600;
    const pGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(pCount * 3);
    const pColors = new Float32Array(pCount * 3);
    const cPalette = [
      [1, 0.09, 0.27],
      [1, 0.5, 0.67],
      [1, 0.84, 0],
      [1, 1, 1],
      [0.97, 0.73, 0.82],
    ];

    for (let i = 0; i < pCount; i++) {
      positions[i * 3] = rand(-10, 10);
      positions[i * 3 + 1] = rand(-7, 7);
      positions[i * 3 + 2] = rand(-5, 3);
      const c = pick(cPalette);
      pColors[i * 3] = c[0];
      pColors[i * 3 + 1] = c[1];
      pColors[i * 3 + 2] = c[2];
    }

    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(pColors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    // Mouse parallax
    let targetX = 0;
    let targetY = 0;
    window.addEventListener(
      "pointermove",
      (e) => {
        targetX = (e.clientX / W - 0.5) * 1.2;
        targetY = (e.clientY / H - 0.5) * 0.8;
      },
      { passive: true }
    );

    function onResize() {
      W = window.innerWidth;
      H = window.innerHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    }
    window.addEventListener("resize", onResize, { passive: true });

    let t = 0;
    function animate() {
      requestAnimationFrame(animate);
      t += 0.01;

      // Main heart pulse + gentle rotate
      const pulse = 1 + Math.sin(t * 2.2) * 0.06;
      mainHeart.scale.setScalar(0.55 * pulse);
      mainHeart.rotation.y = Math.sin(t * 0.4) * 0.35;
      mainHeart.rotation.x = Math.cos(t * 0.3) * 0.15;
      mainHeart.position.y = 0.2 + Math.sin(t * 0.8) * 0.15;

      // Emissive pulse
      if (mainHeart.material) {
        mainHeart.material.emissiveIntensity = 0.2 + Math.sin(t * 2.5) * 0.15;
      }

      // Orbit hearts
      orbitHearts.forEach((h) => {
        const d = h.userData;
        d.angle += d.speed;
        h.position.x = Math.cos(d.angle) * d.radius;
        h.position.z = Math.sin(d.angle) * d.radius * 0.6 - 1;
        h.position.y = d.yOffset + Math.sin(t * d.ySpeed * 60 + d.angle) * d.yAmp;
        h.rotation.y += d.spin;
        h.rotation.z = Math.sin(t + d.angle) * 0.3;
      });

      // Crystals
      crystals.forEach((c) => {
        c.position.x += c.userData.vx;
        c.position.y += c.userData.vy;
        c.position.z += c.userData.vz;
        c.rotation.x += c.userData.rx;
        c.rotation.y += c.userData.ry;
        if (c.position.y > 6) c.position.y = -6;
        if (c.position.x > 8) c.position.x = -8;
        if (c.position.x < -8) c.position.x = 8;
      });

      // Points drift
      const pos = points.geometry.attributes.position.array;
      for (let i = 0; i < pCount; i++) {
        pos[i * 3 + 1] += 0.008 + (i % 5) * 0.001;
        if (pos[i * 3 + 1] > 7) pos[i * 3 + 1] = -7;
      }
      points.geometry.attributes.position.needsUpdate = true;
      points.rotation.y = t * 0.02;

      // Lights orbit
      point1.position.x = Math.cos(t * 0.5) * 4;
      point1.position.z = Math.sin(t * 0.5) * 4 + 2;
      point2.position.x = Math.sin(t * 0.35) * 3;

      // Camera parallax
      camera.position.x += (targetX - camera.position.x) * 0.04;
      camera.position.y += (-targetY - camera.position.y) * 0.04;
      camera.lookAt(0, 0, -1);

      renderer.render(scene, camera);
    }

    animate();

    window.Heart3D = {
      pulse() {
        const start = performance.now();
        const base = 0.55;
        function p() {
          const e = (performance.now() - start) / 600;
          if (e >= 1) {
            mainHeart.scale.setScalar(base);
            return;
          }
          const s = base * (1 + Math.sin(e * Math.PI) * 0.5);
          mainHeart.scale.setScalar(s);
          requestAnimationFrame(p);
        }
        p();
      },
    };
  }

  function rand(a, b) {
    return a + Math.random() * (b - a);
  }

  function pick(arr) {
    return arr[(Math.random() * arr.length) | 0];
  }
})();
