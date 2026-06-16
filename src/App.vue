<template>
    <div class="app">
        <header class="app-header">
            <div class="brand" @click="$router.push('/home')">Japanese Learning</div>

            <nav class="nav">
                <RouterLink to="/articles">文章学习</RouterLink>
                <RouterLink to="/questions">答题练习</RouterLink>
                <RouterLink to="/progress">学习记录</RouterLink>
            </nav>
        </header>

        <main class="app-main">
            <RouterView />
        </main>
    </div>
</template>

<style scoped lang="scss">
.app {
    min-height: 100vh;
    background: #f8fafc;
}

.app-header {
    height: 64px;
    padding: 0 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #ffffff;
    border-bottom: 1px solid #e5e7eb;
}

.brand {
    font-size: 20px;
    font-weight: 800;
    color: #7c3aed;
    cursor: pointer;
}

.nav {
    display: flex;
    gap: 24px;

    a {
        color: #374151;
        text-decoration: none;
        font-weight: 600;
    }

    a.router-link-active {
        color: #7c3aed;
    }
}

.app-main {
    max-width: 1100px;
    margin: 0 auto;
    padding: 32px 20px;
}
</style>