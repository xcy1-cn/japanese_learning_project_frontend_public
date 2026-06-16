import { defineStore } from "pinia";

export interface ReadingRecord {
  articleId: number;
  title: string;
  lastReadAt: string;
}

export interface QuestionRecord {
  questionId: number;
  stem: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation?: string;
  answeredAt: string;
}

interface LearningState {
  currentArticleId: number | null;
  readingRecords: ReadingRecord[];
  questionRecords: QuestionRecord[];
  wrongQuestionIds: number[];
}

const STORAGE_KEY = "public_learning_state";

function loadState(): LearningState {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return {
      currentArticleId: null,
      readingRecords: [],
      questionRecords: [],
      wrongQuestionIds: [],
    };
  }

  try {
    return JSON.parse(raw) as LearningState;
  } catch {
    return {
      currentArticleId: null,
      readingRecords: [],
      questionRecords: [],
      wrongQuestionIds: [],
    };
  }
}

export const useLearningStore = defineStore("learning", {
  state: (): LearningState => loadState(),

  getters: {
    wrongCount: (state) => state.wrongQuestionIds.length,

    answeredCount: (state) => state.questionRecords.length,

    latestReading: (state) => {
      return state.readingRecords[0] || null;
    },

    wrongQuestionRecords: (state) => {
      return state.questionRecords.filter((item) => !item.isCorrect);
    },
  },

  actions: {
    persist() {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          currentArticleId: this.currentArticleId,
          readingRecords: this.readingRecords,
          questionRecords: this.questionRecords,
          wrongQuestionIds: this.wrongQuestionIds,
        }),
      );
    },

    setCurrentArticle(articleId: number) {
      this.currentArticleId = articleId;
      this.persist();
    },

    addReadingRecord(record: ReadingRecord) {
      this.currentArticleId = record.articleId;

      this.readingRecords = this.readingRecords.filter(
        (item) => item.articleId !== record.articleId,
      );

      this.readingRecords.unshift(record);

      if (this.readingRecords.length > 20) {
        this.readingRecords = this.readingRecords.slice(0, 20);
      }

      this.persist();
    },

    addQuestionRecord(record: QuestionRecord) {
      this.questionRecords = this.questionRecords.filter(
        (item) => item.questionId !== record.questionId,
      );

      this.questionRecords.unshift(record);

      if (!record.isCorrect) {
        if (!this.wrongQuestionIds.includes(record.questionId)) {
          this.wrongQuestionIds.unshift(record.questionId);
        }
      } else {
        this.wrongQuestionIds = this.wrongQuestionIds.filter((id) => id !== record.questionId);
      }

      this.persist();
    },

    clearLearningState() {
      this.currentArticleId = null;
      this.readingRecords = [];
      this.questionRecords = [];
      this.wrongQuestionIds = [];
      localStorage.removeItem(STORAGE_KEY);
    },
  },
});
