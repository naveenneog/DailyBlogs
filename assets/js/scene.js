/* NEBULA scene — a data-driven 3D parallax of the apps' own media.
   Reads window.AI4GOOD_MEDIA (emitted from site.posts) and floats each
   app's hero screenshot — or gameplay video (post.bg_video) — as a framed
   plane in the LEFT/RIGHT side bands (the centre reading column stays clear).
   Scroll flies the camera down through the field; the pointer adds a subtle
   parallax. Every future post with an `image:` auto-appears. Vanilla + Three.js
   (global build), no bundler. Respects prefers-reduced-motion (static frame). */
(function () {
  'use strict';

  var canvas = document.getElementById('bg-scene');
  if (!canvas || typeof THREE === 'undefined') return;

  var mqReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduce = mqReduce && mqReduce.matches;
  var mqTransp = window.matchMedia && window.matchMedia('(prefers-reduced-transparency: reduce)');
  if (mqTransp && mqTransp.matches) { canvas.style.display = 'none'; return; }

  /* de-dupe media by image, keep large app screenshots, cap the field */
  var raw = window.AI4GOOD_MEDIA || [];
  var seen = {}, media = [];
  for (var i = 0; i < raw.length; i++) {
    var m = raw[i];
    if (!m || !m.img || seen[m.img]) continue;
    seen[m.img] = 1; media.push(m);
  }
  if (media.length === 0) return;
  media = media.slice(0, 16);

  var FOV = 58, CAM_Z = 7.5;
  var W = window.innerWidth, H = window.innerHeight;
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(W, H, false);

  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x07090e, 0.028);       // lighter fog → crisper, brighter planes

  var camera = new THREE.PerspectiveCamera(FOV, W / H, 0.1, 100);
  camera.position.set(0, 0, CAM_Z);

  // horizontal half-width (world units) of the frustum at a given depth
  var tanHalf = Math.tan((FOV / 2) * Math.PI / 180);
  function halfW(z) { return tanHalf * (CAM_Z - z) * camera.aspect; }

  var loader = new THREE.TextureLoader();
  loader.crossOrigin = 'anonymous';

  var planes = [];
  var SPACING = 5.6;
  var fieldSpan = (media.length - 1) * SPACING;

  media.forEach(function (m, idx) {
    var side = idx % 2 === 0 ? -1 : 1;                  // alternate left / right
    var sideFrac = 0.70 + Math.random() * 0.20;         // 0.70..0.90 → out in the side bands
    var z = -1.2 - Math.random() * 4.0;                 // -1.2..-5.2 (close & bright)

    var group = new THREE.Group();
    group.position.y = -idx * SPACING + (Math.random() - 0.5) * 2.0;
    group.position.z = z;
    group.rotation.z = (Math.random() - 0.5) * 0.10;
    group.rotation.y = -side * (0.14 + Math.random() * 0.14);

    // subtle card frame so each screenshot reads as a floating panel, not a ghost
    var frameMat = new THREE.MeshBasicMaterial({ color: 0x1b2336, transparent: true, opacity: 0.0, depthWrite: false });
    var frame = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), frameMat);
    frame.position.z = -0.03;
    group.add(frame);

    var mat = new THREE.MeshBasicMaterial({ color: 0x8fa4cc, transparent: true, opacity: 0.0, depthWrite: false });
    var mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
    group.add(mesh);
    scene.add(group);

    var rec = {
      group: group, mesh: mesh, mat: mat, frame: frame, frameMat: frameMat,
      side: side, sideFrac: sideFrac, z: z,
      baseY: group.position.y, baseX: 0,
      phase: Math.random() * Math.PI * 2,
      floatAmp: 0.16 + Math.random() * 0.20,
      spin: (Math.random() - 0.5) * 0.05,
      w: 3.4, h: 2.1,
      targetOpacity: 0.0, targetFrame: 0.0
    };
    planes.push(rec);
    positionX(rec);

    var apply = function (tex) {
      tex.minFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      var iw = (tex.image && (tex.image.videoWidth || tex.image.width)) || 16;
      var ih = (tex.image && (tex.image.videoHeight || tex.image.height)) || 10;
      var aspect = iw / ih || 1.6;
      var w = 3.6, h = w / aspect;
      rec.w = w; rec.h = h;
      mesh.scale.set(w, h, 1);
      frame.scale.set(w + 0.16, h + 0.16, 1);
      mat.map = tex; mat.color.set(0xffffff); mat.needsUpdate = true;
      rec.targetOpacity = 0.96;                          // bright, clearly visible
      rec.targetFrame = 0.85;
      positionX(rec);
      if (reduce) { mat.opacity = rec.targetOpacity; frameMat.opacity = rec.targetFrame; }
    };

    if (m.video) {
      var vid = document.createElement('video');
      vid.src = m.video; vid.loop = true; vid.muted = true; vid.playsInline = true;
      vid.setAttribute('playsinline', ''); vid.crossOrigin = 'anonymous';
      vid.addEventListener('loadeddata', function () {
        apply(new THREE.VideoTexture(vid));
        if (!reduce) { var p = vid.play(); if (p && p.catch) p.catch(function () {}); }
      });
      vid.load();
    } else {
      loader.load(m.img, apply, undefined, function () {/* skip failed image */});
    }
  });

  // anchor the plane in its side band, just past the reading column, half-bleeding off-screen
  function positionX(rec) {
    var hw = halfW(rec.z);
    rec.baseX = rec.side * (rec.sideFrac * hw + rec.w * 0.18);
    rec.group.position.x = rec.baseX;
  }

  /* ---- scroll + pointer parallax targets ---- */
  var scrollProg = 0, targetScroll = 0;
  var pointerX = 0, pointerY = 0, targetPX = 0, targetPY = 0;

  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    targetScroll = max > 0 ? (h.scrollTop || document.body.scrollTop) / max : 0;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (!reduce) {
    window.addEventListener('pointermove', function (e) {
      targetPX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetPY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    renderer.setSize(W, H, false);
    camera.aspect = W / H; camera.updateProjectionMatrix();
    for (var i = 0; i < planes.length; i++) positionX(planes[i]);
  }
  window.addEventListener('resize', resize);

  var running = true;
  document.addEventListener('visibilitychange', function () {
    running = !document.hidden;
    if (running && !reduce) raf(loop);
  });

  var raf = window.requestAnimationFrame.bind(window);
  var start = performance.now();

  function render(t) {
    scrollProg += (targetScroll - scrollProg) * 0.08;
    pointerX += (targetPX - pointerX) * 0.05;
    pointerY += (targetPY - pointerY) * 0.05;

    camera.position.y = -scrollProg * fieldSpan;
    camera.position.x = pointerX * 0.45;               // gentle, keeps side anchoring intact
    camera.rotation.x = -pointerY * 0.03;
    camera.rotation.y = pointerX * 0.03;

    for (var i = 0; i < planes.length; i++) {
      var p = planes[i];
      if (!reduce) {
        p.group.position.y = p.baseY + Math.sin(t * 0.0004 + p.phase) * p.floatAmp;
        p.group.position.x = p.baseX + Math.cos(t * 0.0003 + p.phase) * 0.16;
        p.group.rotation.z += p.spin * 0.0015;
      }
      if (p.mat.opacity < p.targetOpacity) p.mat.opacity = Math.min(p.targetOpacity, p.mat.opacity + 0.025);
      if (p.frameMat.opacity < p.targetFrame) p.frameMat.opacity = Math.min(p.targetFrame, p.frameMat.opacity + 0.022);
    }
    renderer.render(scene, camera);
  }

  function loop(now) {
    if (!running) return;
    render(now - start);
    raf(loop);
  }

  if (reduce) {
    scrollProg = targetScroll;
    var frames = 0;
    (function warm() { render(0); if (frames++ < 60) setTimeout(warm, 60); })();
  } else {
    raf(loop);
  }
})();
