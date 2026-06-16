<template>
    <div class="progress-page">
        <div class="page-header">
            <h1>学习记录</h1>
            <p>这里保存你的阅读进度、答题记录和错题记录。</p>
        </div>

        <div class="stats">
            <el-card>
                <div class="stat-number">{{ learningStore.readingRecords.length }}</div>
                <div class="stat-label">阅读记录</div>
            </el-card>

            <el-card>
                <div class="stat-number">{{ learningStore.answeredCount }}</div>
                <div class="stat-label">已答题目</div>
            </el-card>

            <el-card>
                <div class="stat-number wrong">{{ learningStore.wrongCount }}</div>
                <div class="stat-label">错题数量</div>
            </el-card>
        </div>

        <el-card class="section-card">
            <template #header>
                <div class="section-header">
                    <span>最近阅读</span>
                </div>
            </template>

            <div v-for="item in learningStore.readingRecords" :key="item.articleId" class="record-item"
                @click="$router.push(`/articles/${item.articleId}`)">
                <div>
                    <div class="record-title">{{ item.title }}</div>
                    <div class="record-time">{{ formatTime(item.lastReadAt) }}</div>
                </div>

                <el-button text type="primary">继续阅读</el-button>
            </div>

            <el-empty v-if="learningStore.readingRecords.length === 0" description="暂无阅读记录" />
        </el-card>

        <el-card class="section-card">
            <template #header>
                <div class="section-header">
                    <span>错题记录</span>
                </div>
            </template>

            <div v-for="item in learningStore.wrongQuestionRecords" :key="item.questionId" class="record-item"
                @click="$router.push(`/questions/${item.questionId}`)">
                <div>
                    <div class="record-title">{{ item.stem }}</div>
                    <div class="record-desc">
                        你的答案：{{ item.selectedAnswer }} / 正确答案：{{ item.correctAnswer }}
                    </div>
                    <div class="record-time">{{ formatTime(item.answeredAt) }}</div>
                </div>

                <el-button text type="danger">重新练习</el-button>
            </div>

            <el-empty v-if="learningStore.wrongQuestionRecords.length === 0" description="暂无错题" />
        </el-card>

        <el-card class="section-card">
            <template #header>
                <div class="section-header">
                    <span>全部答题记录</span>
                </div>
            </template>

            <div v-for="item in learningStore.questionRecords" :key="item.questionId" class="record-item"
                @click="$router.push(`/questions/${item.questionId}`)">
                <div>
                    <div class="record-title">{{ item.stem }}</div>
                    <div class="record-desc">
                        {{ item.isCorrect ? "回答正确" : "回答错误" }}
                        ｜你的答案：{{ item.selectedAnswer }}
                        ｜正确答案：{{ item.correctAnswer }}
                    </div>
                    <div class="record-time">{{ formatTime(item.answeredAt) }}</div>
                </div>

                <el-tag :type="item.isCorrect ? 'success' : 'danger'">
                    {{ item.isCorrect ? "正确" : "错误" }}
                </el-tag>
            </div>

            <el-empty v-if="learningStore.questionRecords.length === 0" description="暂无答题记录" />
        </el-card>

        <div class="clear-box">
            <el-button type="danger" plain @click="clearRecords">
                清空学习记录
            </el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ElMessageBox, ElMessage } from "element-plus";
import { useLearningStore } from "@/stores/learning";

const learningStore = useLearningStore();

const formatTime = (value: string) => {
    return new Date(value).toLocaleString();
};

const clearRecords = async () => {
    try {
        await ElMessageBox.confirm(
            "确定要清空所有学习记录吗？此操作不会影响后端数据。",
            "确认清空",
            {
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning",
            },
        );

        learningStore.clearLearningState();
        ElMessage.success("学习记录已清空");
    } catch {
        // 用户取消
    }
};
</script>

<style scoped lang="scss">
.progress-page {
    max-width: 1000px;
    margin: 0 auto;
}

.page-header {
    margin-bottom: 24px;

    h1 {
        margin-bottom: 8px;
    }

    p {
        color: #6b7280;
    }
}

.stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
    margin-bottom: 24px;
}

.stat-number {
    font-size: 32px;
    font-weight: 800;
    color: #7c3aed;
}

.stat-number.wrong {
    color: #dc2626;
}

.stat-label {
    margin-top: 6px;
    color: #6b7280;
}

.section-card {
    margin-bottom: 24px;
}

.section-header {
    font-weight: 700;
}

.record-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 14px 0;
    border-bottom: 1px solid #f1f5f9;
    cursor: pointer;

    &:last-child {
        border-bottom: none;
    }

    &:hover .record-title {
        color: #7c3aed;
    }
}

.record-title {
    font-weight: 700;
    margin-bottom: 6px;
}

.record-desc {
    color: #4b5563;
    margin-bottom: 6px;
}

.record-time {
    color: #9ca3af;
    font-size: 13px;
}

.clear-box {
    display: flex;
    justify-content: center;
    margin-top: 32px;
}
</style>