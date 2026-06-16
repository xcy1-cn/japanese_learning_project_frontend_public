import request from "./request";

export interface PublicArticle {
  id: number;
  title: string;
  content?: string;
  level?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PublicSentence {
  id: number;
  articleId: number;
  japaneseText: string;
  chineseText: string;
  romaji?: string;
  orderIndex: number;
}

export interface PublicQuestion {
  id: number;
  type: string;
  stem: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  articleId?: number;
  sentenceId?: number;
  createdAt?: string;
}

export interface PagedResult<T> {
  total: number;
  page: number;
  pageSize: number;
  items: T[];
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface ArticleQuery {
  keyword?: string;
  level?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}

export interface QuestionQuery {
  type?: string;
  keyword?: string;
  page?: number;
  pageSize?: number;
}

export interface SubmitAnswerRequest {
  answer: string;
}

export interface SubmitAnswerResponse {
  isCorrect: boolean;
  correctAnswer: string;
  explanation?: string;
}

export const getPublicArticlesApi = (params: ArticleQuery) => {
  return request.get<ApiResponse<PagedResult<PublicArticle>>>("/Public/articles", {
    params,
  });
};

export const getPublicArticleDetailApi = (id: number) => {
  return request.get<ApiResponse<PublicArticle>>(`/Public/articles/${id}`);
};

export const getPublicArticleSentencesApi = (id: number) => {
  return request.get<ApiResponse<PublicSentence[]>>(`/Public/articles/${id}/sentences`);
};

export const getPublicQuestionsApi = (params: QuestionQuery) => {
  return request.get<ApiResponse<PagedResult<PublicQuestion>>>("/Public/questions", {
    params,
  });
};

export const getPublicQuestionDetailApi = (id: number) => {
  return request.get<ApiResponse<PublicQuestion>>(`/Public/questions/${id}`);
};

export const submitPublicQuestionAnswerApi = (id: number, data: SubmitAnswerRequest) => {
  return request.post<ApiResponse<SubmitAnswerResponse>>(`/Public/questions/${id}/submit`, data);
};
