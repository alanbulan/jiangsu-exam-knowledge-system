import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface KnowledgePoint {
  id: string
  title: string
  content: string
  subject: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
  prerequisites: string[]
  relatedTopics: string[]
  examples: string[]
  exercises: string[]
  createdAt: string
  updatedAt: string
}

export interface Subject {
  id: string
  name: string
  description: string
  icon: string
  color: string
  categories: Category[]
}

export interface Category {
  id: string
  name: string
  description: string
  knowledgePoints: KnowledgePoint[]
}

interface KnowledgeState {
  subjects: Subject[]
  currentSubject: Subject | null
  knowledgePoints: KnowledgePoint[]
  selectedKnowledgePoint: KnowledgePoint | null
  loading: boolean
  searchQuery: string
  filters: {
    subject: string
    category: string
    difficulty: string
    tags: string[]
  }
}

const initialState: KnowledgeState = {
  subjects: [
    {
      id: 'xingce',
      name: '行政职业能力测验',
      description: '包含言语理解、数量关系、判断推理、资料分析、常识判断五大模块',
      icon: '📊',
      color: '#1890ff',
      categories: []
    },
    {
      id: 'shenlun',
      name: '申论',
      description: '包含归纳概括、综合分析、提出对策、应用文写作、文章写作等题型',
      icon: '✍️',
      color: '#52c41a',
      categories: []
    },
    {
      id: 'mianshi',
      name: '面试',
      description: '包含综合分析、计划组织、人际关系、应急应变、言语表达等题型',
      icon: '🎯',
      color: '#fa8c16',
      categories: []
    }
  ],
  currentSubject: null,
  knowledgePoints: [],
  selectedKnowledgePoint: null,
  loading: false,
  searchQuery: '',
  filters: {
    subject: '',
    category: '',
    difficulty: '',
    tags: []
  }
}

const knowledgeSlice = createSlice({
  name: 'knowledge',
  initialState,
  reducers: {
    setSubjects: (state, action: PayloadAction<Subject[]>) => {
      state.subjects = action.payload
    },
    setCurrentSubject: (state, action: PayloadAction<Subject>) => {
      state.currentSubject = action.payload
    },
    setKnowledgePoints: (state, action: PayloadAction<KnowledgePoint[]>) => {
      state.knowledgePoints = action.payload
    },
    setSelectedKnowledgePoint: (state, action: PayloadAction<KnowledgePoint>) => {
      state.selectedKnowledgePoint = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setFilters: (state, action: PayloadAction<Partial<KnowledgeState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {
        subject: '',
        category: '',
        difficulty: '',
        tags: []
      }
    }
  },
})

export const {
  setSubjects,
  setCurrentSubject,
  setKnowledgePoints,
  setSelectedKnowledgePoint,
  setLoading,
  setSearchQuery,
  setFilters,
  clearFilters
} = knowledgeSlice.actions

export default knowledgeSlice.reducer