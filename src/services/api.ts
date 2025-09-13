import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加token等认证信息
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response; // 返回完整的response对象，而不是response.data
  },
  (error) => {
    console.error('API请求错误:', error);
    if (error.response?.status === 401) {
      // 处理未授权错误
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 知识点相关API
export const knowledgePointApi = {
  // 获取所有知识点
  getAll: (params?: { page?: number; size?: number }) => 
    api.get('/knowledge-points', { params }),
  
  // 根据ID获取知识点
  getById: (id: number) => 
    api.get(`/knowledge-points/${id}`),
  
  // 根据科目获取知识点
  getBySubject: (subject: string) => 
    api.get(`/knowledge-points/subject/${subject}`),
  
  // 根据分类获取知识点
  getByCategory: (category: string) => 
    api.get(`/knowledge-points/category/${category}`),
  
  // 根据难度获取知识点
  getByDifficulty: (difficulty: string) => 
    api.get(`/knowledge-points/difficulty/${difficulty}`),
  
  // 搜索知识点
  search: (keyword: string) => 
    api.get(`/knowledge-points/search`, { params: { keyword } }),
  
  // 根据标签获取知识点
  getByTags: (tags: string[]) => 
    api.post('/knowledge-points/search/tags', tags),
  
  // 创建知识点
  create: (data: any) => 
    api.post('/knowledge-points', data),
  
  // 更新知识点
  update: (id: number, data: any) => 
    api.put(`/knowledge-points/${id}`, data),
  
  // 删除知识点
  delete: (id: number) => 
    api.delete(`/knowledge-points/${id}`),
  
  // 获取所有科目
  getSubjects: () => 
    api.get('/knowledge-points/subjects'),
  
  // 获取科目下的分类
  getCategoriesBySubject: (subject: string) => 
    api.get(`/knowledge-points/subjects/${subject}/categories`),
};

// 用户相关API
export const userApi = {
  // 获取所有用户
  getAll: () => 
    api.get('/users'),
  
  // 根据ID获取用户
  getById: (id: number) => 
    api.get(`/users/${id}`),
  
  // 根据用户名获取用户
  getByUsername: (username: string) => 
    api.get(`/users/username/${username}`),
  
  // 用户注册
  register: (data: any) => 
    api.post('/users/register', data),
  
  // 用户登录
  login: (data: { username: string; password: string }) => 
    api.post('/users/login', data),
  
  // 更新用户信息
  update: (id: number, data: any) => 
    api.put(`/users/${id}`, data),
  
  // 删除用户
  delete: (id: number) => 
    api.delete(`/users/${id}`),
};

// 学习进度相关API
export const studyProgressApi = {
  // 获取用户学习进度
  getByUser: (userId: number) => 
    api.get(`/study-progress/user/${userId}`),
  
  // 获取用户某科目的学习进度
  getByUserAndSubject: (userId: number, subject: string) => 
    api.get(`/study-progress/user/${userId}/subject/${subject}`),
  
  // 更新学习进度
  updateProgress: (data: {
    userId: number;
    knowledgePointId: number;
    status: string;
    progress: number;
    timeSpent: number;
    notes?: string;
  }) => 
    api.post('/study-progress/update', data),
  
  // 添加测试成绩
  addTestScore: (data: {
    userId: number;
    knowledgePointId: number;
    score: number;
  }) => 
    api.post('/study-progress/test-score', data),
  
  // 获取用户学习统计
  getUserStatistics: (userId: number) => 
    api.get(`/study-progress/user/${userId}/statistics`),
  
  // 获取日期范围内的学习进度
  getByDateRange: (userId: number, startDate: string, endDate: string) => 
    api.get(`/study-progress/user/${userId}/date-range`, {
      params: { startDate, endDate }
    }),
};

export default api;