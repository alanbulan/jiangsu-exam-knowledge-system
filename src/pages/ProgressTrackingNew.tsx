import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, DatePicker, Select, Button, Timeline, Progress, message } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrophyOutlined, BookOutlined, ClockCircleOutlined, FireOutlined, CalendarOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import api from '../services/api';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface StudyRecord {
  id: string;
  date: string;
  subject: string;
  knowledgePoint: string;
  studyTime: number;
  score: number;
  status: 'completed' | 'in-progress' | 'not-started';
  notes?: string;
}

interface DailyStats {
  date: string;
  studyTime: number;
  completedPoints: number;
  score: number;
}

interface SubjectProgress {
  subject: string;
  completed: number;
  total: number;
  percentage: number;
  weeklyGrowth: number;
  color: string;
}

const ProgressTrackingNew: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>([
    dayjs().subtract(30, 'day'),
    dayjs()
  ]);
  const [viewType, setViewType] = useState<'overview' | 'detailed' | 'analytics'>('overview');
  
  // 数据状态
  const [studyRecords, setStudyRecords] = useState<StudyRecord[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress[]>([]);

  // 从API获取数据并生成学习跟踪数据
  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        setLoading(true);
        
        // 获取知识点数据
        const response = await api.get('/knowledge-points');
        const knowledgePoints = response.data;
        
        // 生成学习记录数据
        const mockStudyRecords: StudyRecord[] = knowledgePoints.slice(0, 15).map((kp: any, index: number) => ({
          id: (index + 1).toString(),
          date: dayjs().subtract(index, 'day').format('YYYY-MM-DD'),
          subject: kp.subject,
          knowledgePoint: kp.title,
          studyTime: Math.floor(Math.random() * 120) + 30,
          score: Math.floor(Math.random() * 40) + 60,
          status: index < 10 ? 'completed' : index < 13 ? 'in-progress' : 'not-started',
          notes: index % 3 === 0 ? '需要加强练习' : index % 3 === 1 ? '掌握良好' : undefined
        }));
        
        setStudyRecords(mockStudyRecords);
        
        // 生成每日统计数据
        const mockDailyStats: DailyStats[] = Array.from({ length: 30 }, (_, i) => ({
          date: dayjs().subtract(29 - i, 'day').format('MM-DD'),
          studyTime: Math.floor(Math.random() * 180) + 30,
          completedPoints: Math.floor(Math.random() * 5) + 1,
          score: Math.floor(Math.random() * 30) + 70
        }));
        
        setDailyStats(mockDailyStats);
        
        // 生成科目进度数据
        const subjects = ['行测', '申论', '面试'];
        const mockSubjectProgress: SubjectProgress[] = subjects.map(subject => {
          const subjectKPs = knowledgePoints.filter((kp: any) => kp.subject === subject);
          const completed = Math.floor(subjectKPs.length * (0.5 + Math.random() * 0.4));
          return {
            subject,
            completed,
            total: subjectKPs.length,
            percentage: Math.round((completed / subjectKPs.length) * 100),
            weeklyGrowth: Math.floor(Math.random() * 20) + 5,
            color: subject === '行测' ? '#1890ff' : subject === '申论' ? '#52c41a' : '#faad14'
          };
        });
        
        setSubjectProgress(mockSubjectProgress);
        
      } catch (error) {
        console.error('获取跟踪数据失败:', error);
        message.error('获取跟踪数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingData();
  }, []);

  // 状态映射
  const statusMap = {
    'completed': { text: '已完成', color: 'success' },
    'in-progress': { text: '进行中', color: 'processing' },
    'not-started': { text: '未开始', color: 'default' }
  };

  // 表格列定义
  const columns: ColumnsType<StudyRecord> = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: '科目',
      dataIndex: 'subject',
      key: 'subject',
      width: 80,
      filters: [
        { text: '行测', value: '行测' },
        { text: '申论', value: '申论' },
        { text: '面试', value: '面试' },
      ],
      onFilter: (value, record) => record.subject === value,
      render: (subject: string) => {
        const colorMap: Record<string, string> = {
          '行测': 'blue',
          '申论': 'green',
          '面试': 'orange'
        };
        return <Tag color={colorMap[subject]}>{subject}</Tag>;
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
      sorter: (a, b) => a.studyTime - b.studyTime,
      render: (time: number) => `${time}分钟`,
    },
    {
      title: '得分',
      dataIndex: 'score',
      key: 'score',
      width: 80,
      sorter: (a, b) => a.score - b.score,
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
      filters: [
        { text: '已完成', value: 'completed' },
        { text: '进行中', value: 'in-progress' },
        { text: '未开始', value: 'not-started' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: keyof typeof statusMap) => {
        const config = statusMap[status];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '备注',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true,
    },
  ];

  // 计算统计数据
  const totalStudyTime = studyRecords.reduce((sum, record) => sum + record.studyTime, 0);
  const completedCount = studyRecords.filter(record => record.status === 'completed').length;
  const averageScore = studyRecords.length > 0 
    ? Math.round(studyRecords.reduce((sum, record) => sum + record.score, 0) / studyRecords.length)
    : 0;
  const studyDays = new Set(studyRecords.map(record => record.date)).size;

  // 渲染概览视图
  const renderOverview = () => (
    <>
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
              value={studyDays}
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
          <Card title="每日学习统计" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="studyTime" stroke="#1890ff" name="学习时长(分钟)" />
                <Line type="monotone" dataKey="completedPoints" stroke="#52c41a" name="完成知识点" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="科目进度对比" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="percentage" fill="#1890ff" name="完成百分比" />
                <Bar dataKey="weeklyGrowth" fill="#52c41a" name="周增长" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* 科目进度详情 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="各科目详细进度">
            {subjectProgress.map((item) => (
              <div key={item.subject} style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontWeight: 'bold' }}>{item.subject}</span>
                  <span>{item.completed}/{item.total} (周增长: +{item.weeklyGrowth})</span>
                </div>
                <Progress 
                  percent={item.percentage} 
                  strokeColor={item.color}
                  showInfo={true}
                />
              </div>
            ))}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="学习时间线">
            <Timeline>
              {studyRecords.slice(0, 8).map((record) => (
                <Timeline.Item 
                  key={record.id}
                  color={statusMap[record.status].color === 'success' ? 'green' : 
                         statusMap[record.status].color === 'processing' ? 'blue' : 'gray'}
                >
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{record.knowledgePoint}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {record.date} · {record.subject} · {record.studyTime}分钟
                    </div>
                    {record.notes && (
                      <div style={{ fontSize: '12px', color: '#999', marginTop: 4 }}>
                        {record.notes}
                      </div>
                    )}
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>
      </Row>
    </>
  );

  // 渲染详细视图
  const renderDetailed = () => (
    <Card 
      title="详细学习记录" 
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
          pageSize: 15,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
        }}
      />
    </Card>
  );

  // 渲染分析视图
  const renderAnalytics = () => (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card title="学习效率分析" loading={loading}>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dailyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="studyTime" stroke="#1890ff" name="学习时长(分钟)" />
              <Line type="monotone" dataKey="score" stroke="#52c41a" name="平均得分" />
              <Line type="monotone" dataKey="completedPoints" stroke="#faad14" name="完成知识点数" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </Col>
    </Row>
  );

  return (
    <div style={{ padding: '24px' }}>
      {/* 视图切换 */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Button.Group>
              <Button 
                type={viewType === 'overview' ? 'primary' : 'default'}
                onClick={() => setViewType('overview')}
                icon={<CalendarOutlined />}
              >
                概览
              </Button>
              <Button 
                type={viewType === 'detailed' ? 'primary' : 'default'}
                onClick={() => setViewType('detailed')}
                icon={<BookOutlined />}
              >
                详细记录
              </Button>
              <Button 
                type={viewType === 'analytics' ? 'primary' : 'default'}
                onClick={() => setViewType('analytics')}
                icon={<TrophyOutlined />}
              >
                数据分析
              </Button>
            </Button.Group>
          </div>
          <div>
            <Button type="primary">生成学习报告</Button>
          </div>
        </div>
      </Card>

      {/* 根据视图类型渲染内容 */}
      {viewType === 'overview' && renderOverview()}
      {viewType === 'detailed' && renderDetailed()}
      {viewType === 'analytics' && renderAnalytics()}
    </div>
  );
};

export default ProgressTrackingNew;