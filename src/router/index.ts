import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/home/HomeView.vue";
import ArticleListView from "@/views/articles/ArticleListView.vue";
import ArticleDetailView from "@/views/articles/ArticleDetailView.vue";
import QuestionListView from "@/views/questions/QuestionListView.vue";
import QuestionDetailView from "@/views/questions/QuestionDetailView.vue";
import ProgressView from "@/views/progress/ProgressView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      path: "/home",
      component: HomeView,
    },
    {
      path: "/articles",
      component: ArticleListView,
    },
    {
      path: "/articles/:id",
      component: ArticleDetailView,
    },
    {
      path: "/questions",
      component: QuestionListView,
    },
    {
      path: "/questions/:id",
      component: QuestionDetailView,
    },
    {
      path: "/progress",
      component: ProgressView,
    },
  ],
});

export default router;
