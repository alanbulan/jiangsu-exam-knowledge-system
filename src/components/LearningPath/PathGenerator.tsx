import React, { useState } from 'react'
import { Card, Select, Button, Steps, Tag, Alert, Divider } from 'antd'
import { 
  RocketOutlined, 
  ClockCircleOutlined,
  PlayCircleOutlined,
  BookOutlined
} from '@ant-design/icons'
import { KnowledgePoint } from '../../store/slices/knowledgeSlice'

const { Option } = Select
const { Step } = Steps

interface LearningPath {
  id: string
  title: string
  description: string
  subject: 'xingce' | 'shenlun' | 'mianshi'
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedHours: number
  knowledgePoints: string[]
  prerequisites: string[]
  createdAt: string
  status: 'not_started' | 'in_progress' | 'completed' | 'paused'
}

interface PathGeneratorProps {
  knowledgePoints: KnowledgePoint[]
  onStartLearning?: (path: LearningPath) => void
}

const PathGenerator: React.FC<PathGeneratorProps> = ({ 
  knowledgePoints, 
  onStartLearning 
}) => {
  const [selectedSubject, setSelectedSubject] = useState<'xingce' | 'shenlun' | 'mianshi'>('xingce')
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')
  const [selectedGoal, setSelectedGoal] = useState<string>('comprehensive')
  const [generatedPath, setGeneratedPath] = useState<LearningPath | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // 生成学习路径
  const generatePath = async () => {
    setIsGenerating(true)
    
    // 模拟异步生成过程
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 根据选择的条件筛选知识点
    const filteredPoints = knowledgePoints.filter(point => 
      point.subject === selectedSubject && 
      point.difficulty === selectedDifficulty
    )
    
    // 生成路径
    const newPath: LearningPath = {
      id: `path_${Date.now()}`,
      title: `${getSubjectName(selectedSubject)} - ${getDifficultyName(selectedDifficulty)}学习路径`,
      description: `针对${getSubjectName(selectedSubject)}的${getDifficultyName(selectedDifficulty)}难度学习路径，包含${filteredPoints.length}个核心知识点`,
      subject: selectedSubject,
      difficulty: selectedDifficulty,
      estimatedHours: filteredPoints.length * 2, // 每个知识点预估2小时
      knowledgePoints: filteredPoints.map(p => p.id),
      prerequisites: [],
      createdAt: new Date().toISOString(),
      status: 'not_started'
    }
    
    setGeneratedPath(newPath)
    setIsGenerating(false)
  }

  // 获取科目名称
  const getSubjectName = (subject: string) => {
    const names = {
      xingce: '行政职业能力测验',
      shenlun: '申论',
      mianshi: '面试'
    }
    return names[subject as keyof typeof names] || subject
  }

  // 获取难度名称
  const getDifficultyName = (difficulty: string) => {
    const names = {
      easy: '基础',
      medium: '进阶', 
      hard: '高级'
    }
    return names[difficulty as keyof typeof names] || difficulty
  }

  // 开始学习
  const handleStartLearning = () => {
    if (generatedPath && onStartLearning) {
      onStartLearning(generatedPath)
    }
  }

  return (
    <div className="space-y-6">
      {/* 参数选择 */}
      <Card title="学习路径配置" className="shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              选择科目
            </label>
            <Select
              value={selectedSubject}
              onChange={setSelectedSubject}
              className="w-full"
              size="large"
            >
              <Option value="xingce">行政职业能力测验</Option>
              <Option value="shenlun">申论</Option>
              <Option value="mianshi">面试</Option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              难度级别
            </label>
            <Select
              value={selectedDifficulty}
              onChange={setSelectedDifficulty}
              className="w-full"
              size="large"
            >
              <Option value="easy">基础入门</Option>
              <Option value="medium">进阶提升</Option>
              <Option value="hard">高级冲刺</Option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              学习目标
            </label>
            <Select
              value={selectedGoal}
              onChange={setSelectedGoal}
              className="w-full"
              size="large"
            >
              <Option value="comprehensive">全面掌握</Option>
              <Option value="exam">考试冲刺</Option>
              <Option value="weak">弱项补强</Option>
            </Select>
          </div>

          <Button
            type="primary"
            size="large"
            icon={<RocketOutlined />}
            onClick={generatePath}
            loading={isGenerating}
            className="w-full"
          >
            {isGenerating ? '正在生成学习路径...' : '生成个性化学习路径'}
          </Button>
        </div>
      </Card>

      {/* 生成的路径 */}
      {generatedPath && (
        <Card title="推荐学习路径" className="shadow-sm">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {generatedPath.title}
                </h3>
                <p className="text-gray-600 mt-1">
                  {generatedPath.description}
                </p>
              </div>
              <div className="flex space-x-2">
                <Tag color="blue">{getSubjectName(generatedPath.subject)}</Tag>
                <Tag color="orange">{getDifficultyName(generatedPath.difficulty)}</Tag>
              </div>
            </div>

            <Divider />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {generatedPath.knowledgePoints.length}
                </div>
                <div className="text-sm text-gray-600">知识点数量</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {generatedPath.estimatedHours}
                </div>
                <div className="text-sm text-gray-600">预估学时</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.ceil(generatedPath.estimatedHours / 2)}
                </div>
                <div className="text-sm text-gray-600">建议天数</div>
              </div>
            </div>

            <Alert
              message="学习建议"
              description="建议每天学习2-3小时，保持连续性。遇到困难可以回顾前置知识点，或寻求帮助。"
              type="info"
              showIcon
            />

            <div className="flex justify-center">
              <Button
                type="primary"
                size="large"
                icon={<PlayCircleOutlined />}
                onClick={handleStartLearning}
                className="px-8"
              >
                开始学习
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* 学习路径预览 */}
      {generatedPath && (
        <Card title="学习路径预览" className="shadow-sm">
          <Steps
            direction="vertical"
            size="small"
            current={-1}
          >
            {generatedPath.knowledgePoints.slice(0, 5).map((pointId, index) => {
              const point = knowledgePoints.find(p => p.id === pointId)
              return (
                <Step
                  key={pointId}
                  title={point?.title || `知识点 ${index + 1}`}
                  description={point?.content?.substring(0, 50) + '...' || ''}
                  icon={<BookOutlined />}
                />
              )
            })}
            {generatedPath.knowledgePoints.length > 5 && (
              <Step
                title={`还有 ${generatedPath.knowledgePoints.length - 5} 个知识点...`}
                description="点击开始学习查看完整路径"
                icon={<ClockCircleOutlined />}
              />
            )}
          </Steps>
        </Card>
      )}
    </div>
  )
}

export default PathGenerator