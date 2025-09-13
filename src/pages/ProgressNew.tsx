import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Progress, Statistic, Table, Tag, DatePicker, Select, Button, message } from 'antd'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { TrophyOutlined, BookOutlined, ClockCircleOutlined, FireOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import api from '../services/api'

const { RangePicker } = DatePicker
const { Option } = Select

interface StudyRecord {
  id: string
  date: string
  subject: string
  knowledgePoint: string
  studyTime: number
  score: number
  status: 'completed' | 'in-progress' | 'not-started'
}

interface SubjectProgress {
  subject: string
  completed: number
  total: number
  percentage: number
  color: string
}

const ProgressNew: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [studyRecords, setStudyRecords] = useState<StudyRecord[]>([])
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress[]>([])
  const [studyData, setStudyData] = useState<any[]>([])
  const [abilityData, setAbilityData] = useState<any[]>([])
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>([
    dayjs().subtract(30, 'day'),
    dayjs()
  ])

  // 从API获取学习记录数据
  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true)
        
        // 获取知识点数据并生成模拟学习记录
        const response = await api.get('/knowledge-points')
        const knowledgePoints = response.data
        
        // 生成模拟学习记录
        const mockStudyRecords: StudyRecord[] = knowledgePoints.slice(0, 10).map((kp: any, index: number) => ({
          id: (index + 1).toString(),
          date: dayjs().subtract(index, 'day').format('YYYY-MM-DD'),
          subject: kp.subject,
          knowledgePoint: kp.title,
          studyTime: Math.floor(Math.random() * 120) + 30,
          score: Math.floor(Math.random() * 40) + 60,
          status: index < 6 ? 'completed' : index < 8 ? 'in-progress' : 'not-started'
        }))
        
        setStudyRecords(mockStudyRecords)
        
        // 生成科目进度数据
        const subjects = ['行测', '申论', '面试']
        const mockSubjectProgress: SubjectProgress[] = subjects.map(subject => {
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
        
        setSubjectProgress(mockSubjectProgress)
        
        // 生成学习趋势数据
        const mockStudyData = Array.from({ length: 30 }, (_, i) => ({
          date: dayjs().subtract(29 - i, 'day').format('MM-DD'),
          studyTime: Math.random() * 3 + 0.5,
          completedTasks: Math.floor(Math.random() * 5) + 1,
          score: Math.floor(Math.random() * 30) + 70
        }))
        
        setStudyData(mockStudyData)
        
        // 生成能力雷达图数据
        const mockAbilityData = [
          { ability: '数量关系', score: Math.floor(Math.random() * 30) + 70, fullMark: 100 },
          { ability: '言语理解', score: Math.floor(Math.random() * 30) + 70, fullMark: 100 },
          { ability: '判断推理', score: Math.floor(Math.random() * 30) + 70, fullMark: 100 },
          { ability: '资料分析', score: Math.floor(Math.random() * 30) + 70, fullMark: 100 },
          { ability: '常识判断', score: Math.floor(Math.random() * 30) + 70, fullMark: 100 },
          { ability: '申论写作', score: Math.floor(Math.random() * 30) + 70, fullMark: 100 }
        ]
        
        setAbilityData(mockAbilityData)
        
      } catch (error) {
        console.error('获取进度数据失败:', error)
        message.error('获取进度数据失败')
      } finally {
        setLoading(false)
      }
    }

    fetchProgressData()
  }, [])

  // 状态映射
  const statusMap = {
    'completed': { text: '已完成', color: 'success' },
    'in-progress': { text: '进行中', color: 'processing' },
    'not-started': { text: '未开始', color: 'default' }
  }

  // 表格列定义
  const columns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 120,
    },
    {
      title: '科目',
      dataIndex: 'subject',
      key: 'subject',
      width: 80,
      render: (subject: string) => {
        const colorMap: Record<string, string> = {
          '行测': 'blue',
          '申论': 'green',
          '面试': 'orange'
        }
        return <Tag color={colorMap[subject]}>{subject}</Tag>
      },
    },
    {
      title: '知识点',
      dataIndex: 'knowledgePoint',
      key: 'knowledgePoint',
      ellipsis: true,
    },
    {
      title: '学习时长',
      dataIndex: 'studyTime',
      key: 'studyTime',
      width: 100,
      render: (time: number) => `${time}分钟`,
    },
    {
      title: '得分',
      dataIndex: 'score',
      key: 'score',
      width: 80,
      render: (score: number) => (
        <span style={{ color: score >= 80 ? '#52c41a' : score >= 60 ? '#faad14' : '#ff4d4f' }}>
          {score}分
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: keyof typeof statusMap) => {
        const config = statusMap[status]
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
  ]

  const COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1']

  // 计算总体统计
  const totalStudyTime = studyRecords.reduce((sum, record) => sum + record.studyTime, 0)
  const completedCount = studyRecords.filter(record => record.status === 'completed').length
  const averageScore = studyRecords.length > 0 
    ? Math.round(studyRecords.reduce((sum, record) => sum + record.score, 0) / studyRecords.length)
    : 0

  return (
    <div style={{ padding: '24px' }}>
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总学习时长"
              value={Math.round(totalStudyTime / 60 * 10) / 10}
              suffix="小时"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="已完成知识点"
              value={completedCount}
              suffix="个"
              prefix={<BookOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="平均得分"
              value={averageScore}
              suffix="分"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="学习天数"
              value={studyRecords.length}
              suffix="天"
              prefix={<FireOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="学习趋势" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={studyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="studyTime" stroke="#1890ff" name="学习时长(小时)" />
                <Line type="monotone" dataKey="score" stroke="#52c41a" name="平均得分" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="科目进度分布" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={subjectProgress}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.subject} ${entry.percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="completed"
                >
                  {subjectProgress.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="各科目进度">
            {subjectProgress.map((item) => (
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
        <Col xs={24} lg={12}>
          <Card title="能力雷达图" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={abilityData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="ability" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="能力得分"
                  dataKey="score"
                  stroke="#1890ff"
                  fill="#1890ff"
                  fillOpacity={0.3}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* 学习记录表格 */}
      <Card 
        title="学习记录" 
        loading={loading}
        extra={
          <div style={{ display: 'flex', gap: 16 }}>
            <RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates)}
              format="YYYY-MM-DD"
            />
            <Select defaultValue="all" style={{ width: 120 }}>
              <Option value="all">全部科目</Option>
              <Option value="行测">行测</Option>
              <Option value="申论">申论</Option>
              <Option value="面试">面试</Option>
            </Select>
            <Button type="primary">导出数据</Button>
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={studyRecords}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
        />
      </Card>
    </div>
  )
}

export default ProgressNew