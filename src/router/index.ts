import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/home/HomeView.vue";
import ArticleListView from "@/views/articles/ArticleListView.vue";
import ArticleDetailView from "@/views/articles/ArticleDetailView.vue";
import QuestionListView from "@/views/questions/QuestionListView.vue";
import QuestionDetailView from "@/views/questions/QuestionDetailView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/articles",
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
  ],
});

export default router;
