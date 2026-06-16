<template>
    <div class="app">
        <!-- Three.js 学习进度星云图背景 -->
        <LearningGalaxyBackground />

        <!-- 顶部导航栏 -->
        <header class="app-header">
            <router-link to="/home">
                <div class="brand" @click="goHome">
                    <div class="brand-icon">JL</div>
                    <div class="brand-text">
                        <div class="brand-title">Japanese Learning</div>
                    </div>
                </div>
            </router-link>


            <nav class="nav">
                <RouterLink to="/articles">文章学习</RouterLink>
                <RouterLink to="/questions">答题练习</RouterLink>
                <RouterLink to="/progress">学习记录</RouterLink>
            </nav>
        </header>

        <!-- 页面内容区 -->
        <main class="app-main">
            <RouterView />
        </main>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import LearningGalaxyBackground from "@/components/LearningGalaxyBackground.vue";

const router = useRouter();

const goHome = () => {
    router.push("/articles");
};
</script>

<style scoped lang="scss">
.app {
    position: relative;
    min-height: 100vh;
    overflow-x: hidden;
    color: #111827;
    background:
        radial-gradient(circle at 15% 20%, rgba(124, 58, 237, 0.2), transparent 360px),
        radial-gradient(circle at 85% 15%, rgba(236, 72, 153, 0.14), transparent 340px),
        radial-gradient(circle at 50% 90%, rgba(34, 197, 94, 0.1), transparent 380px),
        linear-gradient(135deg, #f8fafc 0%, #faf5ff 45%, #eef2ff 100%);
}

.app::before {
    content: "";
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background:
        linear-gradient(rgba(255, 255, 255, 0.68), rgba(255, 255, 255, 0.76)),
        radial-gradient(circle at center, transparent, rgba(255, 255, 255, 0.38));
}

/* 顶部导航 */
.app-header {
    position: sticky;
    top: 0;
    z-index: 20;
    height: 72px;
    padding: 0 42px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(255, 255, 255, 0.78);
    backdrop-filter: blur(18px);
    border-bottom: 1px solid rgba(229, 231, 235, 0.72);
    box-shadow: 0 8px 28px rgba(15, 23, 42, 0.045);
}

.brand {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    user-select: none;
}

.brand-icon {
    width: 42px;
    height: 42px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 14px;
    font-weight: 900;
    letter-spacing: 0.5px;
    background: linear-gradient(135deg, #7c3aed, #ec4899);
    box-shadow: 0 10px 24px rgba(124, 58, 237, 0.28);
}

.brand-text {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.brand-title {
    font-size: 19px;
    font-weight: 900;
    color: #111827;
    line-height: 1;
    text-decoration: none;
}

// .brand-subtitle {
//     font-size: 12px;
//     color: #8b5cf6;
//     font-weight: 600;
//     line-height: 1;
// }

.nav {
    display: flex;
    align-items: center;
    gap: 10px;

    a {
        position: relative;
        padding: 9px 14px;
        border-radius: 999px;
        color: #4b5563;
        text-decoration: none;
        font-size: 14px;
        font-weight: 700;
        transition:
            color 0.2s ease,
            background 0.2s ease,
            transform 0.2s ease;
    }

    a:hover {
        color: #7c3aed;
        background: rgba(124, 58, 237, 0.08);
        transform: translateY(-1px);
    }

    a.router-link-active {
        color: #7c3aed;
        background: rgba(124, 58, 237, 0.12);
    }

    a.router-link-active::after {
        content: "";
        position: absolute;
        left: 50%;
        bottom: 4px;
        width: 18px;
        height: 3px;
        border-radius: 999px;
        background: linear-gradient(90deg, #7c3aed, #ec4899);
        transform: translateX(-50%);
    }
}

/* 页面主体 */
.app-main {
    position: relative;
    z-index: 2;
    max-width: 1120px;
    min-height: calc(100vh - 72px);
    margin: 0 auto;
    padding: 34px 20px 56px;
}

/* 让 Element Plus 卡片有星云玻璃感 */
:deep(.el-card) {
    border: 1px solid rgba(229, 231, 235, 0.76);
    background: rgba(255, 255, 255, 0.84);
    backdrop-filter: blur(14px);
    box-shadow: 0 12px 34px rgba(15, 23, 42, 0.06);
}

:deep(.el-button--primary) {
    background: linear-gradient(135deg, #7c3aed, #8b5cf6);
    border-color: #7c3aed;
}

:deep(.el-button--primary:hover) {
    background: linear-gradient(135deg, #6d28d9, #7c3aed);
    border-color: #6d28d9;
}

/* 移动端适配 */
@media (max-width: 768px) {
    .app-header {
        height: auto;
        min-height: 72px;
        padding: 14px 18px;
        flex-direction: column;
        align-items: flex-start;
        gap: 14px;
    }

    .nav {
        width: 100%;
        overflow-x: auto;
        padding-bottom: 4px;

        a {
            flex-shrink: 0;
        }
    }

    .app-main {
        min-height: calc(100vh - 120px);
        padding: 24px 14px 42px;
    }

    .brand-title {
        font-size: 17px;
    }

    .brand-subtitle {
        font-size: 11px;
    }
}
</style>