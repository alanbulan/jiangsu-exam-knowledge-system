import { useState, useEffect } from 'react';
import { knowledgePointApi, userApi, studyProgressApi } from '../services/api';

// 通用API Hook
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err: any) {
      setError(err.message || '请求失败');
      console.error('API请求错误:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
}

// 知识点相关Hooks
export function useKnowledgePoints(params?: { page?: number; size?: number }) {
  return useApi(() => knowledgePointApi.getAll(params), [params]);
}

export function useKnowledgePoint(id: number) {
  return useApi(() => knowledgePointApi.getById(id), [id]);
}

export function useKnowledgePointsBySubject(subject: string) {
  return useApi(() => knowledgePointApi.getBySubject(subject), [subject]);
}

export function useKnowledgePointSearch(keyword: string) {
  return useApi(() => knowledgePointApi.search(keyword), [keyword]);
}

export function useSubjects() {
  return useApi(() => knowledgePointApi.getSubjects(), []);
}

// 用户相关Hooks
export function useUser(id: number) {
  return useApi(() => userApi.getById(id), [id]);
}

export function useUserByUsername(username: string) {
  return useApi(() => userApi.getByUsername(username), [username]);
}

// 学习进度相关Hooks
export function useStudyProgress(userId: number) {
  return useApi(() => studyProgressApi.getByUser(userId), [userId]);
}

export function useStudyProgressBySubject(userId: number, subject: string) {
  return useApi(() => studyProgressApi.getByUserAndSubject(userId, subject), [userId, subject]);
}

export function useUserStatistics(userId: number) {
  return useApi(() => studyProgressApi.getUserStatistics(userId), [userId]);
}

// 异步操作Hook
export function useAsyncOperation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async <T>(operation: () => Promise<T>): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await operation();
      return result;
    } catch (err: any) {
      setError(err.message || '操作失败');
      console.error('异步操作错误:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, execute };
}