<template>
    <div class="page">
        <el-button @click="$router.back()">返回</el-button>

        <el-card v-if="article" class="article-detail">
            <h1>{{ article.title }}</h1>

            <div class="meta">
                <el-tag v-if="article.level">{{ article.level }}</el-tag>
                <el-tag v-if="article.category" type="info">{{ article.category }}</el-tag>
            </div>

            <p class="content">{{ article.content }}</p>
        </el-card>

        <h2 class="section-title">句子解析</h2>

        <el-card v-for="sentence in sentences" :key="sentence.id" class="sentence-card">
            <div class="jp">{{ sentence.japaneseText }}</div>
            <div class="cn">{{ sentence.chineseText }}</div>
            <div v-if="sentence.romaji" class="romaji">{{ sentence.romaji }}</div>
        </el-card>

        <el-empty v-if="!loading && sentences.length === 0" description="暂无句子" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import {
    getPublicArticleDetailApi,
    getPublicArticleSentencesApi,
    type PublicArticle,
    type PublicSentence,
} from "@/api/public";
import { useLearningStore } from "@/stores/learning";

const route = useRoute();

const loading = ref(false);
const article = ref<PublicArticle | null>(null);
const sentences = ref<PublicSentence[]>([]);
const learningStore = useLearningStore();

const loadData = async () => {
    const id = Number(route.params.id);
    if (!id) return;

    loading.value = true;

    try {
        const [articleRes, sentenceRes] = await Promise.all([
            getPublicArticleDetailApi(id),
            getPublicArticleSentencesApi(id),
        ]);

        article.value = articleRes.data;
        sentences.value = sentenceRes.data;

        if (article.value) {
            learningStore.addReadingRecord({
                articleId: article.value.id,
                title: article.value.title,
                lastReadAt: new Date().toISOString(),
            });
        }
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    loadData();
});
</script>

<style scoped lang="scss">
.article-detail {
    margin-top: 20px;
    margin-bottom: 32px;

    h1 {
        margin-bottom: 12px;
    }
}

.meta {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
}

.content {
    line-height: 1.9;
    color: #374151;
}

.section-title {
    margin-bottom: 16px;
}

.sentence-card {
    margin-bottom: 14px;
}

.jp {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 8px;
}

.cn {
    color: #374151;
    margin-bottom: 6px;
}

.romaji {
    color: #9ca3af;
    font-style: italic;
}
</style>