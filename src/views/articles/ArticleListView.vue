<template>
    <div class="page">
        <div class="page-header">
            <h1>文章学习</h1>
            <p>选择一篇文章，进入句子、词汇和语法学习。</p>
        </div>

        <div class="toolbar">
            <el-input v-model="query.keyword" placeholder="搜索文章" clearable @keyup.enter="loadArticles" />

            <el-select v-model="query.level" placeholder="等级" clearable>
                <el-option label="N5" value="N5" />
                <el-option label="N4" value="N4" />
                <el-option label="N3" value="N3" />
                <el-option label="N2" value="N2" />
                <el-option label="N1" value="N1" />
            </el-select>

            <el-button type="primary" @click="loadArticles">搜索</el-button>
        </div>

        <el-card v-for="article in articles" :key="article.id" class="article-card">
            <div class="article-title" @click="goDetail(article.id)">
                {{ article.title }}
            </div>

            <div class="article-meta">
                <el-tag v-if="article.level" size="small">{{ article.level }}</el-tag>
                <el-tag v-if="article.category" size="small" type="info">{{ article.category }}</el-tag>
            </div>

            <p class="article-summary">
                {{ article.content }}
            </p>
        </el-card>

        <el-empty v-if="!loading && articles.length === 0" description="暂无文章" />

        <div class="pagination">
            <el-pagination layout="prev, pager, next, total" :total="total" :page-size="query.pageSize"
                v-model:current-page="query.page" @current-change="loadArticles" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { getPublicArticlesApi, type PublicArticle } from "@/api/public";

const router = useRouter();

const loading = ref(false);
const articles = ref<PublicArticle[]>([]);
const total = ref(0);

const query = reactive({
    keyword: "",
    level: "",
    category: "",
    page: 1,
    pageSize: 10,
});

const loadArticles = async () => {
    loading.value = true;

    try {
        const res = await getPublicArticlesApi(query);
        articles.value = res.data.items;
        total.value = res.data.total;
    } finally {
        loading.value = false;
    }
};

const goDetail = (id: number) => {
    router.push(`/articles/${id}`);
};

onMounted(() => {
    loadArticles();
});
</script>

<style scoped lang="scss">
.page-header {
    margin-bottom: 24px;

    h1 {
        margin-bottom: 8px;
    }

    p {
        color: #6b7280;
    }
}

.toolbar {
    display: grid;
    grid-template-columns: 1fr 160px 100px;
    gap: 12px;
    margin-bottom: 24px;
}

.article-card {
    margin-bottom: 16px;
}

.article-title {
    font-size: 20px;
    font-weight: 700;
    cursor: pointer;
    margin-bottom: 12px;

    &:hover {
        color: #7c3aed;
    }
}

.article-meta {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
}

.article-summary {
    color: #4b5563;
    line-height: 1.8;
}

.pagination {
    margin-top: 24px;
    display: flex;
    justify-content: center;
}
</style>