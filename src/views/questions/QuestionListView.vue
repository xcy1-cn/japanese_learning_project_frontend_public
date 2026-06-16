<template>
    <div class="page">
        <div class="page-header">
            <h1>答题练习</h1>
            <p>选择题目进行练习，提交后查看正确答案和解析。</p>
        </div>

        <div class="toolbar">
            <el-input v-model="query.keyword" placeholder="搜索题干或选项" clearable @keyup.enter="loadQuestions" />

            <el-select v-model="query.type" placeholder="题型" clearable>
                <el-option label="词汇选择" value="vocabulary_choice" />
                <el-option label="语法选择" value="grammar_choice" />
                <el-option label="阅读选择" value="reading_choice" />
            </el-select>

            <el-button type="primary" @click="loadQuestions">搜索</el-button>
        </div>

        <el-card v-for="question in questions" :key="question.id" class="question-card">
            <div class="question-stem" @click="goDetail(question.id)">
                {{ question.stem }}
            </div>

            <el-tag size="small">{{ question.type }}</el-tag>
        </el-card>

        <el-empty v-if="!loading && questions.length === 0" description="暂无题目" />

        <div class="pagination">
            <el-pagination layout="prev, pager, next, total" :total="total" :page-size="query.pageSize"
                v-model:current-page="query.page" @current-change="loadQuestions" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { getPublicQuestionsApi, type PublicQuestion } from "@/api/public";

const router = useRouter();

const loading = ref(false);
const questions = ref<PublicQuestion[]>([]);
const total = ref(0);

const query = reactive({
    type: "",
    keyword: "",
    page: 1,
    pageSize: 10,
});

const loadQuestions = async () => {
    loading.value = true;

    try {
        const res = await getPublicQuestionsApi(query);
        console.log(res);
        

        questions.value = res.data.items;
        total.value = res.data.total;
    } finally {
        loading.value = false;
    }
};

const goDetail = (id: number) => {
    router.push(`/questions/${id}`);
};

onMounted(() => {
    loadQuestions();
});
</script>

<style scoped lang="scss">
.page-header {
    margin-bottom: 24px;

    p {
        color: #6b7280;
    }
}

.toolbar {
    display: grid;
    grid-template-columns: 1fr 180px 100px;
    gap: 12px;
    margin-bottom: 24px;
}

.question-card {
    margin-bottom: 16px;
}

.question-stem {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 12px;
    cursor: pointer;

    &:hover {
        color: #7c3aed;
    }
}

.pagination {
    margin-top: 24px;
    display: flex;
    justify-content: center;
}
</style>