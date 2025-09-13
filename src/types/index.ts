export interface KnowledgePoint {
  id: string
  title: string
  content: string
  subject: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
  prerequisites: string[]
  relatedPoints: string[]
  examples?: string[]
  exercises?: string[]
  createdAt: string
  updatedAt: string
}

export interface LearningPath {
  id: string
  name: string
  description: string
  subject: string
  difficulty: string
  estimatedTime: number
  steps: LearningStep[]
  status: 'not_started' | 'in_progress' | 'completed' | 'paused'
  progress: number
  createdAt: string
}

export interface LearningStep {
  id: string
  title: string
  description: string
  knowledgePointId: string
  estimatedTime: number
  completed: boolean
  order: number
}

export interface StudyRecord {
  id: string
  knowledgePointId: string
  userId: string
  studyTime: number
  score?: number
  completed: boolean
  date: string
}