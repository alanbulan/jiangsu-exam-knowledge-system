import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Tag, Progress, Spin, message } from 'antd';
import { PlayCircleOutlined, CheckCircleOutlined, BookOutlined } from '@ant-design/icons';
import api from '../services/api';

interface KnowledgePoint {
  id: number;
  title: string;
  subject: string;
  difficulty: string;
  tags: string[];
  content: string;
  prerequisites: string[];
}

interface LearningPathItem {
  id: number;
  title: string;
  description: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed';
  knowledgePoints: KnowledgePoint[];
}

const LearningPathNew: React.FC = () => {
  const [learningPaths, setLearningPaths] = useState<LearningPathItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLearningPaths = async () => {
      try {
        setLoading(true);
        const response = await api.get('/knowledge-points');
        
        // 将知识点按科目分组创建学习路径
        const knowledgePoints = response.data;
        const subjectGroups = knowledgePoints.reduce((groups: any, point: KnowledgePoint) => {
          const subject = point.subject || '其他';
          if (!groups[subject]) {
            groups[subject] = [];
          }
          groups[subject].push(point);
          return groups;
        }, {});

        // 为每个科目创建学习路径
        const paths = Object.entries(subjectGroups).map(([subject, points], index) => ({
          id: index + 1,
          title: `${subject}学习路径`,
          description: `${subject}相关知识点的系统学习路径`,
          progress: Math.floor(Math.random() * 100),
          status: ['not-started', 'in-progress', 'completed'][Math.floor(Math.random() * 3)] as 'not-started' | 'in-progress' | 'completed',
          knowledgePoints: points as KnowledgePoint[]
        }));

        setLearningPaths(paths);
      } catch (error) {
        console.error('Failed to fetch learning paths:', error);
        message.error('获取学习路径失败');
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPaths();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'in-progress':
        return <PlayCircleOutlined style={{ color: '#1890ff' }} />;
      default:
        return <BookOutlined style={{ color: '#d9d9d9' }} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'in-progress':
        return '学习中';
      default:
        return '未开始';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'processing';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">学习路径</h1>
        <p className="text-gray-600">系统化的学习路径，帮助您有序掌握江苏省考知识点</p>
      </div>

      <Row gutter={[16, 16]}>
        {learningPaths.map((path) => (
          <Col xs={24} sm={12} lg={8} key={path.id}>
            <Card
              hoverable
              className="h-full"
              actions={[
                <Button type="primary" key="start">
                  {path.status === 'not-started' ? '开始学习' : '继续学习'}
                </Button>
              ]}
            >
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{path.title}</h3>
                  {getStatusIcon(path.status)}
                </div>
                <p className="text-gray-600 text-sm mb-3">{path.description}</p>
                
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-500">学习进度</span>
                    <span className="text-sm font-medium">{path.progress}%</span>
                  </div>
                  <Progress percent={path.progress} size="small" />
                </div>

                <div className="flex items-center justify-between mb-3">
                  <Tag color={getStatusColor(path.status)}>
                    {getStatusText(path.status)}
                  </Tag>
                  <span className="text-sm text-gray-500">
                    {path.knowledgePoints.length} 个知识点
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">包含知识点：</h4>
                  <div className="flex flex-wrap gap-1">
                    {path.knowledgePoints.slice(0, 3).map((point, index) => (
                      <Tag key={index}>
                        {point.title}
                      </Tag>
                    ))}
                    {path.knowledgePoints.length > 3 && (
                      <Tag color="default">
                        +{path.knowledgePoints.length - 3}
                      </Tag>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default LearningPathNew;