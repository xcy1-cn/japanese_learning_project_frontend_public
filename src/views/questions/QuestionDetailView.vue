<template>
    <div class="question-detail-page">
        <el-button class="back-btn" @click="$router.back()">返回</el-button>

        <el-card v-if="question" class="question-card">
            <div class="question-type">
                <el-tag>{{ question.type }}</el-tag>
            </div>

            <h1 class="stem">{{ question.stem }}</h1>

            <el-radio-group v-model="selectedAnswer" class="options" :disabled="submitted">
                <el-radio value="A">A. {{ question.optionA }}</el-radio>
                <el-radio value="B">B. {{ question.optionB }}</el-radio>
                <el-radio value="C">C. {{ question.optionC }}</el-radio>
                <el-radio value="D">D. {{ question.optionD }}</el-radio>
            </el-radio-group>

            <div class="actions">
                <el-button type="primary" :disabled="!selectedAnswer || submitted" :loading="submitting"
                    @click="submitAnswer">
                    提交答案
                </el-button>

                <el-button v-if="submitted" @click="resetAnswer">
                    再做一次
                </el-button>
            </div>
        </el-card>

        <el-skeleton v-else :rows="5" animated />

        <el-card v-if="result" class="result-card">
            <h2 :class="result.isCorrect ? 'correct' : 'wrong'">
                {{ result.isCorrect ? "回答正确" : "回答错误" }}
            </h2>

            <p>
                你的答案：
                <strong>{{ selectedAnswer }}</strong>
            </p>

            <p>
                正确答案：
                <strong>{{ result.correctAnswer }}</strong>
            </p>

            <p v-if="result.explanation" class="explanation">
                解析：{{ result.explanation }}
            </p>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import {
    getPublicQuestionDetailApi,
    submitPublicQuestionAnswerApi,
    type PublicQuestion,
    type SubmitAnswerResponse,
} from "@/api/public";
import { useLearningStore } from "@/stores/learning";

const route = useRoute();

const question = ref<PublicQuestion | null>(null);
const selectedAnswer = ref("");
const result = ref<SubmitAnswerResponse | null>(null);

const loading = ref(false);
const submitting = ref(false);
const submitted = ref(false);

const learningStore = useLearningStore();

const loadQuestion = async () => {
    const id = Number(route.params.id);
    if (!id) return;

    loading.value = true;

    try {
        const res = await getPublicQuestionDetailApi(id);
        question.value = res.data;
    } catch (error) {
        console.error(error);
        ElMessage.error("题目加载失败");
    } finally {
        loading.value = false;
    }
};

const submitAnswer = async () => {
    const id = Number(route.params.id);

    if (!id || !selectedAnswer.value) {
        ElMessage.warning("请先选择答案");
        return;
    }

    submitting.value = true;

    try {
        const res = await submitPublicQuestionAnswerApi(id, {
            answer: selectedAnswer.value,
        });

        result.value = res.data;
        submitted.value = true;

        learningStore.addQuestionRecord({
            questionId: id,
            stem: question.value?.stem || "",
            selectedAnswer: selectedAnswer.value,
            correctAnswer: res.data.correctAnswer,
            isCorrect: res.data.isCorrect,
            explanation: res.data.explanation,
            answeredAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error(error);
        ElMessage.error("答案提交失败");
    } finally {
        submitting.value = false;
    }
};

const resetAnswer = () => {
    selectedAnswer.value = "";
    result.value = null;
    submitted.value = false;
};

onMounted(() => {
    loadQuestion();
});
</script>

<style scoped lang="scss">
.question-detail-page {
    max-width: 860px;
    margin: 0 auto;
}

.back-btn {
    margin-bottom: 20px;
}

.question-card {
    margin-bottom: 24px;
}

.question-type {
    margin-bottom: 16px;
}

.stem {
    font-size: 26px;
    line-height: 1.5;
    margin-bottom: 28px;
}

.options {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 28px;

    :deep(.el-radio) {
        height: auto;
        white-space: normal;
        align-items: flex-start;
        line-height: 1.8;
    }
}

.actions {
    display: flex;
    gap: 12px;
}

.result-card {
    border-left: 5px solid #7c3aed;
}

.correct {
    color: #059669;
}

.wrong {
    color: #dc2626;
}

.explanation {
    margin-top: 12px;
    line-height: 1.8;
    color: #374151;
}
</style>