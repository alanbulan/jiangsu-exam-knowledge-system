import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Progress, List, Tag, Button, message } from 'antd'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { 
  BookOutlined, 
  TrophyOutlined, 
  ClockCircleOutlined, 
  FireOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,

} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

interface SubjectData {
  subject: string
  completed: number
  total: number
  percentage: number
  color: string
}

interface RecentActivity {
  id: string
  type: 'study' | 'test' | 'review'
  title: string
  time: string
  score?: number
}

interface TodayTask {
  id: number
  title: string
  completed: boolean
}

const DashboardNew: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [subjectData, setSubjectData] = useState<SubjectData[]>([])
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [todayTasks, setTodayTasks] = useState<TodayTask[]>([])
  const [totalStats, setTotalStats] = useState({
    totalKnowledgePoints: 0,
    completedPoints: 0,
    totalStudyTime: 0,
    averageScore: 0
  })

  // 从API获取仪表板数据
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        // 获取知识点数据
        const response = await api.get('/knowledge-points')
        const knowledgePoints = response.data
        
        // 计算科目数据
        const subjects = ['行测', '申论', '面试']
        const subjectStats: SubjectData[] = subjects.map(subject => {
          const subjectKPs = knowledgePoints.filter((kp: any) => kp.subject === subject)
          const completed = Math.floor(subjectKPs.length * (0.6 + Math.random() * 0.3))
          return {
            subject,
            completed,
            total: subjectKPs.length,
            percentage: Math.round((completed / subjectKPs.length) * 100),
            color: subject === '行测' ? '#1890ff' : subject === '申论' ? '#52c41a' : '#faad14'
          }
        })
        
        setSubjectData(subjectStats)
        
        // 生成最近活动数据
        const mockActivities: RecentActivity[] = knowledgePoints.slice(0, 6).map((kp: any, index: number) => ({
          id: (index + 1).toString(),
          type: index % 3 === 0 ? 'study' : index % 3 === 1 ? 'test' : 'review',
          title: kp.title,
          time: `${index + 1}小时前`,
          score: index % 3 === 1 ? Math.floor(Math.random() * 30) + 70 : undefined
        }))
        
        setRecentActivities(mockActivities)
        
        // 生成今日任务
        const mockTasks: TodayTask[] = knowledgePoints.slice(0, 4).map((kp: any, index: number) => ({
          id: index + 1,
          title: `学习${kp.title}`,
          completed: index < 2
        }))
        
        setTodayTasks(mockTasks)
        
        // 计算总体统计
        const totalCompleted = subjectStats.reduce((sum, s) => sum + s.completed, 0)
        const totalKPs = subjectStats.reduce((sum, s) => sum + s.total, 0)
        
        setTotalStats({
          totalKnowledgePoints: totalKPs,
          completedPoints: totalCompleted,
          totalStudyTime: Math.floor(Math.random() * 100) + 50, // 模拟总学习时间
          averageScore: Math.floor(Math.random() * 20) + 75 // 模拟平均分数
        })
        
      } catch (error) {
        console.error('获取仪表板数据失败:', error)
        message.error('获取仪表板数据失败')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const handleTaskToggle = (taskId: number) => {
    setTodayTasks(tasks => 
      tasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'study': return <BookOutlined style={{ color: '#1890ff' }} />
      case 'test': return <TrophyOutlined style={{ color: '#52c41a' }} />
      case 'review': return <ClockCircleOutlined style={{ color: '#faad14' }} />
      default: return <BookOutlined />
    }
  }

  const getActivityTypeText = (type: string) => {
    switch (type) {
      case 'study': return '学习'
      case 'test': return '测试'
      case 'review': return '复习'
      default: return '学习'
    }
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic
              title="总知识点"
              value={totalStats.totalKnowledgePoints}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic
              title="已完成"
              value={totalStats.completedPoints}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic
              title="学习时长"
              value={totalStats.totalStudyTime}
              suffix="小时"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic
              title="平均分数"
              value={totalStats.averageScore}
              suffix="分"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 学习进度 */}
        <Col xs={24} lg={12}>
          <Card title="学习进度" loading={loading}>
            <div style={{ marginBottom: 16 }}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={subjectData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.subject} ${entry.percentage}%`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="completed"
                  >
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {subjectData.map((item) => (
              <div key={item.subject} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>{item.subject}</span>
                  <span>{item.completed}/{item.total}</span>
                </div>
                <Progress 
                  percent={item.percentage} 
                  strokeColor={item.color}
                  showInfo={false}
                />
              </div>
            ))}
          </Card>
        </Col>

        {/* 最近活动 */}
        <Col xs={24} lg={12}>
          <Card title="最近活动" loading={loading}>
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={getActivityIcon(item.type)}
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{item.title}</span>
                        {item.score && (
                          <Tag color={item.score >= 80 ? 'green' : item.score >= 60 ? 'orange' : 'red'}>
                            {item.score}分
                          </Tag>
                        )}
                      </div>
                    }
                    description={
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Tag color="blue">{getActivityTypeText(item.type)}</Tag>
                        <span style={{ color: '#999' }}>{item.time}</span>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 今日任务 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card 
            title="今日任务" 
            loading={loading}
            extra={
              <Button 
                type="primary" 
                size="small"
                onClick={() => navigate('/learning-path')}
              >
                查看更多
              </Button>
            }
          >
            <List
              dataSource={todayTasks}
              renderItem={(task) => (
                <List.Item
                  actions={[
                    <Button
                      key="toggle"
                      type="text"
                      icon={task.completed ? <CheckCircleOutlined /> : <PlayCircleOutlined />}
                      onClick={() => handleTaskToggle(task.id)}
                      style={{ 
                        color: task.completed ? '#52c41a' : '#1890ff' 
                      }}
                    >
                      {task.completed ? '已完成' : '开始学习'}
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <span style={{ 
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? '#999' : 'inherit'
                      }}>
                        {task.title}
                      </span>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 快速操作 */}
        <Col xs={24} lg={12}>
          <Card title="快速操作">
            <Row gutter={[8, 8]}>
              <Col span={12}>
                <Button 
                  block 
                  type="primary" 
                  icon={<BookOutlined />}
                  onClick={() => navigate('/knowledge')}
                >
                  知识点管理
                </Button>
              </Col>
              <Col span={12}>
                <Button 
                  block 
                  icon={<TrophyOutlined />}
                  onClick={() => navigate('/progress')}
                >
                  学习进度
                </Button>
              </Col>
              <Col span={12}>
                <Button 
                  block 
                  icon={<FireOutlined />}
                  onClick={() => navigate('/smart-search')}
                >
                  智能搜索
                </Button>
              </Col>
              <Col span={12}>
                <Button 
                  block 
                  icon={<ClockCircleOutlined />}
                  onClick={() => navigate('/progress-tracking')}
                >
                  进度跟踪
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default DashboardNew