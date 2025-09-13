import React from 'react'
import { Card, Progress, Tag, Button, Space, Timeline, Statistic, Row, Col, Empty } from 'antd'
import { 
  PlayCircleOutlined, 
  PauseCircleOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  BookOutlined,
  TrophyOutlined 
} from '@ant-design/icons'

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
  startDate?: string
  endDate?: string
  currentStep?: number
  completedSteps?: number
  totalTimeSpent?: number
  status: 'not_started' | 'in_progress' | 'completed' | 'paused'
}

interface PathProgressProps {
  learningPaths: LearningPath[]
  activePath: LearningPath | null
  onPathUpdate: (path: LearningPath) => void
  onSelectPath: (path: LearningPath | null) => void
}

const PathProgress: React.FC<PathProgressProps> = ({
  learningPaths,
  activePath,
  onPathUpdate,
  onSelectPath
}) => {
  // 获取状态颜色
  const getStatusColor = (status: string) => {
    const colors = {
      not_started: 'default',
      in_progress: 'processing',
      completed: 'success',
      paused: 'warning'
    }
    return colors[status as keyof typeof colors] || 'default'
  }

  // 获取状态文本
  const getStatusText = (status: string) => {
    const texts = {
      not_started: '未开始',
      in_progress: '进行中',
      completed: '已完成',
      paused: '已暂停'
    }
    return texts[status as keyof typeof texts] || status
  }

  // 获取科目名称
  const getSubjectName = (subject: string) => {
    const names = {
      xingce: '行测',
      shenlun: '申论',
      mianshi: '面试'
    }
    return names[subject as keyof typeof names] || subject
  }

  // 计算进度百分比
  const getProgressPercent = (path: LearningPath) => {
    if (!path.completedSteps || !path.knowledgePoints.length) return 0
    return Math.round((path.completedSteps / path.knowledgePoints.length) * 100)
  }

  // 处理路径操作
  const handlePathAction = (path: LearningPath, action: string) => {
    let updatedPath: LearningPath

    switch (action) {
      case 'start':
        updatedPath = {
          ...path,
          status: 'in_progress',
          startDate: new Date().toISOString(),
          currentStep: 0,
          completedSteps: 0,
          totalTimeSpent: 0
        }
        break
      case 'pause':
        updatedPath = { ...path, status: 'paused' }
        break
      case 'resume':
        updatedPath = { ...path, status: 'in_progress' }
        break
      case 'complete':
        updatedPath = {
          ...path,
          status: 'completed',
          endDate: new Date().toISOString(),
          completedSteps: path.knowledgePoints.length
        }
        break
      default:
        return
    }

    onPathUpdate(updatedPath)
    if (action === 'start' || action === 'resume') {
      onSelectPath(updatedPath)
    }
  }

  if (learningPaths.length === 0) {
    return (
      <Empty
        description="暂无学习路径"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      >
        <p className="text-gray-500">
          请先在"路径生成器"中创建学习路径
        </p>
      </Empty>
    )
  }

  return (
    <div className="space-y-6">
      {/* 学习路径列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {learningPaths.map(path => (
          <Card
            key={path.id}
            className={`shadow-sm cursor-pointer transition-all ${
              activePath?.id === path.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => onSelectPath(path)}
          >
            <div className="space-y-4">
              {/* 路径标题和状态 */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {path.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {path.description}
                  </p>
                </div>
                <Tag color={getStatusColor(path.status)}>
                  {getStatusText(path.status)}
                </Tag>
              </div>

              {/* 进度条 */}
              <Progress
                percent={getProgressPercent(path)}
                status={path.status === 'completed' ? 'success' : 'active'}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
              />

              {/* 统计信息 */}
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic
                    title="知识点"
                    value={path.completedSteps || 0}
                    suffix={`/ ${path.knowledgePoints.length}`}
                    prefix={<BookOutlined />}
                    valueStyle={{ fontSize: '14px' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="学时"
                    value={path.totalTimeSpent || 0}
                    suffix={`/ ${path.estimatedHours}h`}
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ fontSize: '14px' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="科目"
                    value={getSubjectName(path.subject)}
                    valueStyle={{ fontSize: '14px' }}
                  />
                </Col>
              </Row>

              {/* 操作按钮 */}
              <div className="flex justify-end space-x-2">
                {path.status === 'not_started' && (
                  <Button
                    type="primary"
                    size="small"
                    icon={<PlayCircleOutlined />}
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePathAction(path, 'start')
                    }}
                  >
                    开始学习
                  </Button>
                )}
                
                {path.status === 'in_progress' && (
                  <>
                    <Button
                      size="small"
                      icon={<PauseCircleOutlined />}
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePathAction(path, 'pause')
                      }}
                    >
                      暂停
                    </Button>
                    <Button
                      type="primary"
                      size="small"
                      icon={<CheckCircleOutlined />}
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePathAction(path, 'complete')
                      }}
                    >
                      完成
                    </Button>
                  </>
                )}
                
                {path.status === 'paused' && (
                  <Button
                    type="primary"
                    size="small"
                    icon={<PlayCircleOutlined />}
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePathAction(path, 'resume')
                    }}
                  >
                    继续学习
                  </Button>
                )}
                
                {path.status === 'completed' && (
                  <Button
                    size="small"
                    icon={<TrophyOutlined />}
                    disabled
                  >
                    已完成
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 当前活跃路径详情 */}
      {activePath && (
        <Card title="当前学习路径详情" className="shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{activePath.title}</h3>
              <Space>
                <Tag color="blue">{getSubjectName(activePath.subject)}</Tag>
                <Tag color={getStatusColor(activePath.status)}>
                  {getStatusText(activePath.status)}
                </Tag>
              </Space>
            </div>

            <Timeline>
              <Timeline.Item
                color="green"
                dot={<CheckCircleOutlined />}
              >
                <div className="font-medium">路径创建</div>
                <div className="text-gray-500 text-sm">
                  {new Date(activePath.createdAt).toLocaleString()}
                </div>
              </Timeline.Item>
              
              {activePath.startDate && (
                <Timeline.Item
                  color="blue"
                  dot={<PlayCircleOutlined />}
                >
                  <div className="font-medium">开始学习</div>
                  <div className="text-gray-500 text-sm">
                    {new Date(activePath.startDate).toLocaleString()}
                  </div>
                </Timeline.Item>
              )}
              
              {activePath.endDate && (
                <Timeline.Item
                  color="green"
                  dot={<TrophyOutlined />}
                >
                  <div className="font-medium">完成学习</div>
                  <div className="text-gray-500 text-sm">
                    {new Date(activePath.endDate).toLocaleString()}
                  </div>
                </Timeline.Item>
              )}
            </Timeline>
          </div>
        </Card>
      )}
    </div>
  )
}

export default PathProgress