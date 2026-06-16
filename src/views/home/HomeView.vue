<template>
    <div class="home-page">
        <section class="hero">
            <h1>Japanese Learning Platform</h1>
            <p>通过文章阅读、句子解析、词汇语法和选择题练习，完成日语学习闭环。</p>

            <div class="actions">
                <el-button type="primary" size="large" @click="$router.push('/articles')">
                    开始阅读
                </el-button>

                <el-button size="large" @click="$router.push('/questions')">
                    开始答题
                </el-button>
            </div>
        </section>

        <section class="features">
            <el-card class="feature-card">
                <h3>文章学习</h3>
                <p>浏览不同等级和分类的日语文章。</p>
            </el-card>

            <el-card class="feature-card">
                <h3>句子解析</h3>
                <p>查看日语句子、中文翻译和罗马音。</p>
            </el-card>

            <el-card class="feature-card">
                <h3>答题练习</h3>
                <p>通过选择题检查词汇、语法和阅读理解。</p>
            </el-card>
        </section>
    </div>
</template>

<style scoped lang="scss">
.home-page {
    padding-top: 40px;
}

.hero {
    text-align: center;
    padding: 70px 20px;
    background: linear-gradient(135deg, #faf5ff, #eef2ff);
    border-radius: 24px;
    margin-bottom: 32px;

    h1 {
        font-size: 44px;
        margin-bottom: 18px;
        color: #111827;
    }

    p {
        max-width: 680px;
        margin: 0 auto 32px;
        color: #6b7280;
        font-size: 18px;
        line-height: 1.8;
    }
}

.actions {
    display: flex;
    justify-content: center;
    gap: 16px;
}

.features {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
}

.feature-card {
    h3 {
        margin-bottom: 10px;
        color: #7c3aed;
    }

    p {
        color: #6b7280;
        line-height: 1.7;
    }
}
</style>