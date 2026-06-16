<template>
    <div class="progress-page" :class="{ 'is-galaxy-focus': isGalaxyFocusMode }">
        <!-- 星图专注模式 -->
        <div v-if="isGalaxyFocusMode" class="galaxy-focus-layer">
            <div class="galaxy-focus-panel">
                <div class="focus-tag">Galaxy Focus Mode</div>

                <h1>学习星图</h1>

                <p>
                    当前页面已进入星图专注模式。紫色节点代表已阅读文章，绿色节点代表答对题目，
                    橙色节点代表错题。随着学习内容增加，节点会逐渐形成属于你的知识星云图。
                </p>

                <div class="focus-stats">
                    <div>
                        <strong>{{ learningStore.readingRecords.length }}</strong>
                        <span>阅读节点</span>
                    </div>

                    <div>
                        <strong>{{ learningStore.answeredCount }}</strong>
                        <span>答题节点</span>
                    </div>

                    <div>
                        <strong class="wrong">{{ learningStore.wrongCount }}</strong>
                        <span>错题节点</span>
                    </div>
                </div>

                <el-button type="primary" size="large" @click="exitGalaxyFocus">
                    退出星图模式
                </el-button>
            </div>
        </div>

        <!-- 普通学习记录模式 -->
        <template v-else>
            <div class="page-header">
                <h1>学习记录</h1>
                <p>这里保存你的阅读进度、答题记录和错题记录。</p>
            </div>

            <el-card class="galaxy-info-card" @click="enterGalaxyFocus">
                <div class="galaxy-card-content">
                    <div>
                        <h2>学习星图</h2>
                        <p>
                            紫色节点代表已阅读文章，绿色节点代表答对题目，橙色节点代表错题。
                            随着学习内容增加，节点会逐渐形成属于你的知识星云图。
                        </p>
                    </div>
                </div>
            </el-card>

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
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { useLearningStore } from "@/stores/learning";

const learningStore = useLearningStore();

const isGalaxyFocusMode = ref(false);

const enterGalaxyFocus = () => {
    isGalaxyFocusMode.value = true;
};

const exitGalaxyFocus = () => {
    isGalaxyFocusMode.value = false;
};

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

.progress-page.is-galaxy-focus {
    max-width: none;
    margin: 0;
}

/* 普通页面 */
.page-header {
    margin-bottom: 24px;

    h1 {
        margin-bottom: 8px;
    }

    p {
        color: #6b7280;
    }
}

.galaxy-info-card {
    margin-bottom: 24px;
    background: rgba(255, 255, 255, 0.82);
    backdrop-filter: blur(12px);
    cursor: pointer;
    transition:
        transform 0.22s ease,
        box-shadow 0.22s ease,
        border-color 0.22s ease;

    &:hover {
        transform: translateY(-3px);
        border-color: rgba(124, 58, 237, 0.34);
        box-shadow: 0 18px 42px rgba(124, 58, 237, 0.16);
    }

    h2 {
        margin-bottom: 10px;
        color: #7c3aed;
    }

    p {
        color: #6b7280;
        line-height: 1.8;
    }
}

.galaxy-card-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
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

/* 星图专注模式 */
.galaxy-focus-layer {
    position: fixed;
    inset: 72px 0 0;
    z-index: 30;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 40px 20px;
    pointer-events: none;
}

.galaxy-focus-panel {
    width: min(760px, calc(100vw - 40px));
    padding: 28px 32px;
    border: 1px solid rgba(196, 181, 253, 0.42);
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.38);
    backdrop-filter: blur(16px);
    box-shadow: 0 24px 70px rgba(76, 29, 149, 0.18);
    pointer-events: auto;
    text-align: center;

    h1 {
        margin: 10px 0 14px;
        font-size: 34px;
        color: #111827;
    }

    p {
        max-width: 640px;
        margin: 0 auto 22px;
        color: #4b5563;
        line-height: 1.9;
    }
}

.focus-tag {
    display: inline-flex;
    padding: 6px 12px;
    border-radius: 999px;
    background: rgba(124, 58, 237, 0.1);
    color: #7c3aed;
    font-size: 13px;
    font-weight: 800;
}

.focus-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    margin: 24px 0;

    div {
        padding: 14px 12px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.56);
        border: 1px solid rgba(229, 231, 235, 0.72);
    }

    strong {
        display: block;
        font-size: 26px;
        color: #7c3aed;
    }

    strong.wrong {
        color: #f97316;
    }

    span {
        display: block;
        margin-top: 4px;
        color: #6b7280;
        font-size: 13px;
    }
}

@media (max-width: 768px) {
    .galaxy-card-content {
        align-items: flex-start;
        flex-direction: column;
    }

    .stats {
        grid-template-columns: 1fr;
    }

    .galaxy-focus-layer {
        inset: 120px 0 0;
        align-items: flex-end;
        padding: 24px 14px;
    }

    .galaxy-focus-panel {
        padding: 24px 20px;

        h1 {
            font-size: 28px;
        }
    }

    .focus-stats {
        grid-template-columns: 1fr;
    }
}
</style>