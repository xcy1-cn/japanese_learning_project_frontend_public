<template>
    <canvas ref="canvasRef" class="three-bg"></canvas>
</template>

<script setup lang="ts">
import * as THREE from "three";
import { onBeforeUnmount, onMounted, ref } from "vue";

const canvasRef = ref<HTMLCanvasElement | null>(null);

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let animationId = 0;

const particles: THREE.Points[] = [];

const initThree = () => {
    if (!canvasRef.value) return;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
    );

    camera.position.z = 6;

    renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.value,
        alpha: true,
        antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    createParticles();

    window.addEventListener("resize", handleResize);
};

const createParticles = () => {
    if (!scene) return;

    const geometry = new THREE.BufferGeometry();
    const count = 700;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 14;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        size: 0.025,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);
    particles.push(points);
};

const animate = () => {
    if (!renderer || !scene || !camera) return;

    particles.forEach((item) => {
        item.rotation.y += 0.0008;
        item.rotation.x += 0.0003;
    });

    renderer.render(scene, camera);
    animationId = requestAnimationFrame(animate);
};

const handleResize = () => {
    if (!renderer || !camera) return;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};

onMounted(() => {
    initThree();
    animate();
});

onBeforeUnmount(() => {
    cancelAnimationFrame(animationId);
    window.removeEventListener("resize", handleResize);

    particles.forEach((item) => {
        item.geometry.dispose();

        if (Array.isArray(item.material)) {
            item.material.forEach((material) => material.dispose());
        } else {
            item.material.dispose();
        }
    });

    renderer?.dispose();

    renderer = null;
    scene = null;
    camera = null;
});
</script>

<style scoped lang="scss">
.three-bg {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 0;
}
</style>