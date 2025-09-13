import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface StudyProgress {
  knowledgePointId: string
  status: 'not_started' | 'in_progress' | 'completed' | 'mastered'
  progress: number
  timeSpent: number
  lastStudiedAt: string
  testScores: number[]
  notes: string
}

export interface LearningPath {
  id: string
  name: string
  description: string
  knowledgePoints: string[]
  estimatedTime: number
  difficulty: 'easy' | 'medium' | 'hard'
  progress: number
}

interface ProgressState {
  studyProgress: Record<string, StudyProgress>
  learningPaths: LearningPath[]
  currentPath: LearningPath | null
  dailyGoal: number
  weeklyStats: {
    timeSpent: number
    pointsCompleted: number
    testsCompleted: number
  }
  achievements: string[]
  loading: boolean
}

const initialState: ProgressState = {
  studyProgress: {},
  learningPaths: [],
  currentPath: null,
  dailyGoal: 120, // 分钟
  weeklyStats: {
    timeSpent: 0,
    pointsCompleted: 0,
    testsCompleted: 0
  },
  achievements: [],
  loading: false
}

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    updateStudyProgress: (state, action: PayloadAction<{ id: string; progress: Partial<StudyProgress> }>) => {
      const { id, progress } = action.payload
      state.studyProgress[id] = {
        ...state.studyProgress[id],
        ...progress,
        lastStudiedAt: new Date().toISOString()
      }
    },
    setLearningPaths: (state, action: PayloadAction<LearningPath[]>) => {
      state.learningPaths = action.payload
    },
    setCurrentPath: (state, action: PayloadAction<LearningPath>) => {
      state.currentPath = action.payload
    },
    updateWeeklyStats: (state, action: PayloadAction<Partial<ProgressState['weeklyStats']>>) => {
      state.weeklyStats = { ...state.weeklyStats, ...action.payload }
    },
    addAchievement: (state, action: PayloadAction<string>) => {
      if (!state.achievements.includes(action.payload)) {
        state.achievements.push(action.payload)
      }
    },
    setDailyGoal: (state, action: PayloadAction<number>) => {
      state.dailyGoal = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    }
  },
})

export const {
  updateStudyProgress,
  setLearningPaths,
  setCurrentPath,
  updateWeeklyStats,
  addAchievement,
  setDailyGoal,
  setLoading
} = progressSlice.actions

export default progressSlice.reducer