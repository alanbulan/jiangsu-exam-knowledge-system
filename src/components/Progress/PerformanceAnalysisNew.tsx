import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, DatePicker, Statistic, Progress, Table, Tag, Alert, Tabs, Spin } from 'antd';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowUpOutlined, ArrowDownOutlined, BulbOutlined, WarningOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { knowledgePointApi } from '../../services/api';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

interface PerformanceData {
  subject: string;
  knowledgePoint: string;
  attempts: number;
  correctRate: number;
  averageTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  lastStudied: string;
  masteryLevel: number;
}

interface TrendData {
  date: string;
  行测: number;
  申论: number;
  面试: number;
  overall: number;
}

interface WeaknessAnalysis {
  category: string;
  score: number;
  improvement: number;
  priority: 'high' | 'medium' | 'low';
  suggestions: string[];
}

const PerformanceAnalysisNew: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [analysisType, setAnalysisType] = useState<'trend' | 'weakness' | 'mastery'>('trend');
  const [loading, setLoading] = useState(false);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [weaknessAnalysis, setWeaknessAnalysis] = useState<WeaknessAnalysis[]>([]);

  // 从API获取知识点数据并生成性能分析
  useEffect(() => {
    const fetchPerformanceData = async () => {
      setLoading(true);
      try {
        const response = await knowledgePointApi.getAll();
        const knowledgePoints = response.data;
        
        // 基于知识点数据生成性能分析数据
        const performanceAnalysis: PerformanceData[] = knowledgePoints.map((point: any) => ({
          subject: point.subject || '行测',
          knowledgePoint: point.title || '未知知识点',
          attempts: Math.floor(Math.random() * 20) + 5, // 模拟练习次数
          correctRate: Math.floor(Math.random() * 40) + 60, // 60-100的正确率
          averageTime: Math.round((Math.random() * 10 + 1) * 10) / 10, // 1-11分钟
          difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as 'easy' | 'medium' | 'hard',
          lastStudied: dayjs().subtract(Math.floor(Math.random() * 7), 'day').format('YYYY-MM-DD'),
          masteryLevel: Math.floor(Math.random() * 40) + 60
        }));
        
        setPerformanceData(performanceAnalysis);
        
        // 生成趋势数据
        const trends: TrendData[] = [];
        for (let i = 6; i >= 0; i--) {
          const date = dayjs().subtract(i, 'day').format('MM-DD');
          trends.push({
            date,
            行测: Math.floor(Math.random() * 20) + 70,
            申论: Math.floor(Math.random() * 20) + 65,
            面试: Math.floor(Math.random() * 20) + 60,
            overall: Math.floor(Math.random() * 20) + 70
          });
        }
        setTrendData(trends);
        
        // 生成薄弱环节分析
        const subjects = [...new Set(knowledgePoints.map((point: any) => point.subject))];
        const weaknesses: WeaknessAnalysis[] = subjects.slice(0, 3).map((subject: string) => ({
          category: subject || '未知科目',
          score: Math.floor(Math.random() * 30) + 60,
          improvement: Math.floor(Math.random() * 21) - 10, // -10到+10
          priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
          suggestions: [
            '加强基础知识练习',
            '多做相关题型训练',
            '注意时间分配管理'
          ]
        }));
        setWeaknessAnalysis(weaknesses);
        
      } catch (error) {
        console.error('获取性能数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, []);

  // 雷达图数据
  const radarData = [
    {
      subject: '能力评估',
      行测: trendData.length > 0 ? trendData[trendData.length - 1].行测 : 85,
      申论: trendData.length > 0 ? trendData[trendData.length - 1].申论 : 78,
      面试: trendData.length > 0 ? trendData[trendData.length - 1].面试 : 72,
      fullMark: 100
    }
  ];

  // 表格列定义
  const columns: ColumnsType<PerformanceData> = [
    {
      title: '科目',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject: string) => (
        <Tag color={subject === '行测' ? 'blue' : subject === '申论' ? 'green' : 'orange'}>
          {subject}
        </Tag>
      )
    },
    {
      title: '知识点',
      dataIndex: 'knowledgePoint',
      key: 'knowledgePoint'
    },
    {
      title: '练习次数',
      dataIndex: 'attempts',
      key: 'attempts',
      sorter: (a, b) => a.attempts - b.attempts
    },
    {
      title: '正确率',
      dataIndex: 'correctRate',
      key: 'correctRate',
      render: (rate: number) => (
        <div className="flex items-center space-x-2">
          <Progress 
            percent={rate} 
            size="small" 
            strokeColor={rate >= 80 ? '#52c41a' : rate >= 60 ? '#faad14' : '#f5222d'}
          />
          <span>{rate}%</span>
        </div>
      ),
      sorter: (a, b) => a.correctRate - b.correctRate
    },
    {
      title: '平均用时',
      dataIndex: 'averageTime',
      key: 'averageTime',
      render: (time: number) => `${time}分钟`,
      sorter: (a, b) => a.averageTime - b.averageTime
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      key: 'difficulty',
      render: (difficulty: string) => {
        const colorMap = { easy: 'green', medium: 'orange', hard: 'red' };
        const textMap = { easy: '简单', medium: '中等', hard: '困难' };
        return <Tag color={colorMap[difficulty as keyof typeof colorMap]}>{textMap[difficulty as keyof typeof textMap]}</Tag>;
      }
    },
    {
      title: '掌握程度',
      dataIndex: 'masteryLevel',
      key: 'masteryLevel',
      render: (level: number) => (
        <Progress 
          percent={level} 
          size="small"
          strokeColor={level >= 80 ? '#52c41a' : level >= 60 ? '#faad14' : '#f5222d'}
          format={(percent) => `${percent}%`}
        />
      ),
      sorter: (a, b) => a.masteryLevel - b.masteryLevel
    }
  ];

  // 薄弱环节表格列
  const weaknessColumns: ColumnsType<WeaknessAnalysis> = [
    {
      title: '知识领域',
      dataIndex: 'category',
      key: 'category'
    },
    {
      title: '当前得分',
      dataIndex: 'score',
      key: 'score',
      render: (score: number) => (
        <Statistic 
          value={score} 
          suffix="分"
          valueStyle={{ 
            fontSize: '14px',
            color: score >= 80 ? '#52c41a' : score >= 60 ? '#faad14' : '#f5222d'
          }}
        />
      )
    },
    {
      title: '近期变化',
      dataIndex: 'improvement',
      key: 'improvement',
      render: (improvement: number) => (
        <div className={`flex items-center ${improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {improvement > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          <span className="ml-1">{improvement > 0 ? '+' : ''}{improvement}</span>
        </div>
      )
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        const colorMap = { high: 'red', medium: 'orange', low: 'green' };
        const textMap = { high: '高', medium: '中', low: '低' };
        return <Tag color={colorMap[priority as keyof typeof colorMap]}>{textMap[priority as keyof typeof textMap]}</Tag>;
      }
    },
    {
      title: '改进建议',
      dataIndex: 'suggestions',
      key: 'suggestions',
      render: (suggestions: string[]) => (
        <ul className="text-sm space-y-1">
          {suggestions.slice(0, 2).map((suggestion, index) => (
            <li key={index} className="text-gray-600">• {suggestion}</li>
          ))}
        </ul>
      )
    }
  ];

  const renderTrendAnalysis = () => (
    <div className="space-y-6">
      {/* 整体趋势 */}
      <Card title="学习成绩趋势分析">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="行测" stroke="#1890ff" strokeWidth={2} />
            <Line type="monotone" dataKey="申论" stroke="#52c41a" strokeWidth={2} />
            <Line type="monotone" dataKey="面试" stroke="#faad14" strokeWidth={2} />
            <Line type="monotone" dataKey="overall" stroke="#f5222d" strokeWidth={3} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* 能力雷达图 */}
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="综合能力评估">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="当前水平"
                  dataKey="行测"
                  stroke="#1890ff"
                  fill="#1890ff"
                  fillOpacity={0.1}
                />
                <Radar
                  name="申论"
                  dataKey="申论"
                  stroke="#52c41a"
                  fill="#52c41a"
                  fillOpacity={0.1}
                />
                <Radar
                  name="面试"
                  dataKey="面试"
                  stroke="#faad14"
                  fill="#faad14"
                  fillOpacity={0.1}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="学习效率分析">
            <div className="space-y-4">
              <Alert
                message="学习效率评估"
                description="基于您的学习时间和成绩提升情况，当前学习效率为良好水平。"
                type="success"
                icon={<BulbOutlined />}
                showIcon
              />
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>时间利用效率</span>
                    <span>85%</span>
                  </div>
                  <Progress percent={85} strokeColor="#52c41a" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>知识掌握速度</span>
                    <span>78%</span>
                  </div>
                  <Progress percent={78} strokeColor="#1890ff" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>错题改正率</span>
                    <span>92%</span>
                  </div>
                  <Progress percent={92} strokeColor="#faad14" />
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderWeaknessAnalysis = () => (
    <div className="space-y-6">
      {/* 薄弱环节概览 */}
      <Row gutter={16}>
        {weaknessAnalysis.map((item, index) => (
          <Col xs={24} md={8} key={index}>
            <Card 
              size="small"
              className={`border-l-4 ${
                item.priority === 'high' ? 'border-l-red-500' : 
                item.priority === 'medium' ? 'border-l-orange-500' : 'border-l-green-500'
              }`}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">{item.category}</h4>
                  <Tag color={item.priority === 'high' ? 'red' : item.priority === 'medium' ? 'orange' : 'green'}>
                    {item.priority === 'high' ? '高优先级' : item.priority === 'medium' ? '中优先级' : '低优先级'}
                  </Tag>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress 
                    percent={item.score} 
                    size="small"
                    strokeColor={item.score >= 80 ? '#52c41a' : item.score >= 60 ? '#faad14' : '#f5222d'}
                  />
                  <span className="text-sm">{item.score}分</span>
                </div>
                <div className={`text-sm flex items-center ${item.improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.improvement > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  <span className="ml-1">较上周{item.improvement > 0 ? '提升' : '下降'}{Math.abs(item.improvement)}分</span>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 详细分析表格 */}
      <Card title="薄弱环节详细分析">
        <Table
          columns={weaknessColumns}
          dataSource={weaknessAnalysis}
          rowKey="category"
          pagination={false}
        />
      </Card>

      {/* 改进建议 */}
      <Card title="个性化改进建议" extra={<WarningOutlined className="text-orange-500" />}>
        <div className="space-y-4">
          {weaknessAnalysis.filter(item => item.priority === 'high').map((item, index) => (
            <Alert
              key={index}
              message={`${item.category} - 需要重点关注`}
              description={
                <ul className="mt-2 space-y-1">
                  {item.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="text-sm">• {suggestion}</li>
                  ))}
                </ul>
              }
              type="warning"
              showIcon
            />
          ))}
        </div>
      </Card>
    </div>
  );

  const renderMasteryAnalysis = () => (
    <div className="space-y-6">
      {/* 知识点掌握情况 */}
      <Card title="知识点掌握情况分析" extra={
        <Select value={selectedSubject} onChange={setSelectedSubject} style={{ width: 120 }}>
          <Option value="all">全部科目</Option>
          <Option value="行测">行测</Option>
          <Option value="申论">申论</Option>
          <Option value="面试">面试</Option>
        </Select>
      }>
        <Table
          columns={columns}
          dataSource={performanceData.filter(item => 
            selectedSubject === 'all' || item.subject === selectedSubject
          )}
          rowKey={(record) => `${record.subject}-${record.knowledgePoint}`}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true
          }}
        />
      </Card>

      {/* 掌握程度分布 */}
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="掌握程度分布">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="knowledgePoint" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="masteryLevel" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="练习频次与正确率关系">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="attempts" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="correctRate" stroke="#52c41a" fill="#52c41a" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 筛选器 */}
      <Card>
        <Row gutter={16} align="middle">
          <Col>
            <span className="mr-2">分析类型:</span>
            <Select value={analysisType} onChange={setAnalysisType} style={{ width: 150 }}>
              <Option value="trend">趋势分析</Option>
              <Option value="weakness">薄弱环节</Option>
              <Option value="mastery">掌握程度</Option>
            </Select>
          </Col>
          <Col>
            <span className="mr-2">日期范围:</span>
            <RangePicker 
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)}
              format="YYYY-MM-DD"
            />
          </Col>
        </Row>
      </Card>

      {/* 内容区域 */}
      <Tabs activeKey={analysisType} onChange={(key) => setAnalysisType(key as 'trend' | 'weakness' | 'mastery')}>
        <TabPane tab="趋势分析" key="trend">
          {renderTrendAnalysis()}
        </TabPane>
        <TabPane tab="薄弱环节" key="weakness">
          {renderWeaknessAnalysis()}
        </TabPane>
        <TabPane tab="掌握程度" key="mastery">
          {renderMasteryAnalysis()}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default PerformanceAnalysisNew;