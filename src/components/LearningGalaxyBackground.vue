<template>
    <canvas ref="canvasRef" class="galaxy-canvas"></canvas>
</template>

<script setup lang="ts">
import * as THREE from "three";
import { computed, onBeforeUnmount, onMounted, watch, ref } from "vue";
import { useLearningStore } from "@/stores/learning";

interface GalaxyNode {
    id: string;
    type: "article" | "question";
    title: string;
    status: "read" | "correct" | "wrong";
    x: number;
    y: number;
    z: number;
    size: number;
}

const canvasRef = ref<HTMLCanvasElement | null>(null);
const learningStore = useLearningStore();

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let galaxyGroup: THREE.Group | null = null;
let animationId = 0;

const galaxyNodes = computed<GalaxyNode[]>(() => {
    const articleNodes: GalaxyNode[] = learningStore.readingRecords.map((item, index) => {
        const angle = index * 0.9;
        const radius = 2.2 + index * 0.08;

        return {
            id: `article-${item.articleId}`,
            type: "article",
            title: item.title,
            status: "read",
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius * 0.45,
            z: Math.sin(angle * 1.4) * 1.8,
            size: 0.12,
        };
    });

    const questionNodes: GalaxyNode[] = learningStore.questionRecords.map((item, index) => {
        const angle = index * 1.15 + 1.5;
        const radius = 3.2 + index * 0.06;

        return {
            id: `question-${item.questionId}`,
            type: "question",
            title: item.stem,
            status: item.isCorrect ? "correct" : "wrong",
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius * 0.55,
            z: Math.cos(angle * 1.2) * 2.2,
            size: item.isCorrect ? 0.1 : 0.14,
        };
    });

    return [...articleNodes, ...questionNodes];
});

const initThree = () => {
    if (!canvasRef.value) return;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
    );

    camera.position.set(0, 0, 8);

    renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.value,
        alpha: true,
        antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    galaxyGroup = new THREE.Group();
    scene.add(galaxyGroup);

    addAmbientParticles();
    buildGalaxy();

    window.addEventListener("resize", handleResize);
};

const getNodeColor = (node: GalaxyNode) => {
    if (node.type === "article") return 0x8b5cf6;
    if (node.status === "correct") return 0x22c55e;
    if (node.status === "wrong") return 0xf97316;
    return 0x60a5fa;
};

const buildGalaxy = () => {
    if (!galaxyGroup) return;

    clearGalaxy();

    const nodes = galaxyNodes.value;

    nodes.forEach((node) => {
        const geometry = new THREE.SphereGeometry(node.size, 24, 24);

        const material = new THREE.MeshBasicMaterial({
            color: getNodeColor(node),
            transparent: true,
            opacity: node.status === "wrong" ? 0.95 : 0.82,
        });

        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(node.x, node.y, node.z);

        galaxyGroup!.add(sphere);

        const glowGeometry = new THREE.SphereGeometry(node.size * 1.8, 24, 24);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: getNodeColor(node),
            transparent: true,
            opacity: node.status === "wrong" ? 0.18 : 0.1,
        });

        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.copy(sphere.position);

        galaxyGroup!.add(glow);
    });

    createLinks(nodes);
};

const createLinks = (nodes: GalaxyNode[]) => {
    if (!galaxyGroup || nodes.length <= 1) return;

    const positions: number[] = [];

    for (let i = 0; i < nodes.length; i++) {
        const current = nodes[i];

        for (let j = i + 1; j < nodes.length; j++) {
            const next = nodes[j];

            const dx = current.x - next.x;
            const dy = current.y - next.y;
            const dz = current.z - next.z;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (distance < 2.4) {
                positions.push(current.x, current.y, current.z);
                positions.push(next.x, next.y, next.z);
            }
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3),
    );

    const material = new THREE.LineBasicMaterial({
        color: 0xa78bfa,
        transparent: true,
        opacity: 0.18,
    });

    const lines = new THREE.LineSegments(geometry, material);
    galaxyGroup.add(lines);
};

const addAmbientParticles = () => {
    if (!scene) return;

    const count = 900;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 14;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        size: 0.018,
        color: 0xc4b5fd,
        transparent: true,
        opacity: 0.42,
        depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);
};

const clearGalaxy = () => {
    if (!galaxyGroup) return;

    while (galaxyGroup.children.length > 0) {
        const child = galaxyGroup.children[0];

        if ("geometry" in child && child.geometry) {
            child.geometry.dispose();
        }

        if ("material" in child && child.material) {
            const material = child.material;

            if (Array.isArray(material)) {
                material.forEach((item) => item.dispose());
            } else {
                material.dispose();
            }
        }

        galaxyGroup.remove(child);
    }
};

const animate = () => {
    if (!renderer || !scene || !camera) return;

    if (galaxyGroup) {
        galaxyGroup.rotation.y += 0.0012;
        galaxyGroup.rotation.x += 0.00035;
    }

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

watch(
    galaxyNodes,
    () => {
        buildGalaxy();
    },
    { deep: true },
);

onMounted(() => {
    initThree();
    animate();
});

onBeforeUnmount(() => {
    cancelAnimationFrame(animationId);
    window.removeEventListener("resize", handleResize);

    clearGalaxy();

    renderer?.dispose();

    renderer = null;
    scene = null;
    camera = null;
    galaxyGroup = null;
});
</script>

<style scoped lang="scss">
.galaxy-canvas {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 0;
}
</style>