import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, List, Progress, Button, Tag, Spin, message } from 'antd';
import { PlayCircleOutlined, CheckCircleOutlined, BookOutlined } from '@ant-design/icons';
import api from '../services/api';

interface StudyContent {
  id: string;
  title: string;
  type: 'video' | 'text' | 'exercise';
  duration?: number;
  completed: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
}

interface Module {
  id: string;
  name: string;
  subject: string;
  description: string;
  totalContent: number;
  completedContent: number;
  contents: StudyContent[];
}

const StudyModuleNew: React.FC = () => {
  const { subject, module } = useParams<{ subject: string; module?: string }>();
  const [loading, setLoading] = useState(true);
  const [moduleData, setModuleData] = useState<Module | null>(null);
  const [studyContents, setStudyContents] = useState<StudyContent[]>([]);

  useEffect(() => {
    fetchModuleData();
  }, [subject, module]);

  const fetchModuleData = async () => {
    try {
      setLoading(true);
      
      // 获取知识点数据作为学习内容
      const response = await api.get('/knowledge-points');
      const knowledgePoints = response.data;
      
      // 根据科目筛选相关知识点
      const filteredPoints = knowledgePoints.filter((point: any) => 
        point.subject === subject || point.category.includes(subject || '')
      );

      // 转换为学习内容格式
      const contents: StudyContent[] = filteredPoints.map((point: any, index: number) => ({
        id: point.id.toString(),
        title: point.title,
        type: index % 3 === 0 ? 'video' : index % 3 === 1 ? 'text' : 'exercise',
        duration: Math.floor(Math.random() * 30) + 10,
        completed: Math.random() > 0.7,
        difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as 'easy' | 'medium' | 'hard',
        description: point.content || point.description || '学习内容描述'
      }));

      // 创建模块数据
      const moduleInfo: Module = {
        id: module || '1',
        name: module || `${subject}基础模块`,
        subject: subject || '行测',
        description: `${subject}科目的核心知识点学习模块`,
        totalContent: contents.length,
        completedContent: contents.filter(c => c.completed).length,
        contents
      };

      setModuleData(moduleInfo);
      setStudyContents(contents);
    } catch (error) {
      console.error('获取模块数据失败:', error);
      message.error('获取学习模块数据失败');
      
      // 使用备用数据
      const fallbackContents: StudyContent[] = [
        {
          id: '1',
          title: '基础概念学习',
          type: 'text',
          duration: 15,
          completed: true,
          difficulty: 'easy',
          description: '学习基础概念和理论知识'
        },
        {
          id: '2',
          title: '视频讲解',
          type: 'video',
          duration: 25,
          completed: false,
          difficulty: 'medium',
          description: '通过视频深入理解知识点'
        },
        {
          id: '3',
          title: '练习题目',
          type: 'exercise',
          duration: 20,
          completed: false,
          difficulty: 'hard',
          description: '通过练习巩固所学知识'
        }
      ];

      const fallbackModule: Module = {
        id: '1',
        name: `${subject || '行测'}基础模块`,
        subject: subject || '行测',
        description: '基础学习模块',
        totalContent: fallbackContents.length,
        completedContent: 1,
        contents: fallbackContents
      };

      setModuleData(fallbackModule);
      setStudyContents(fallbackContents);
    } finally {
      setLoading(false);
    }
  };

  const handleStartStudy = (contentId: string) => {
    setStudyContents(prev => 
      prev.map(content => 
        content.id === contentId 
          ? { ...content, completed: true }
          : content
      )
    );
    
    if (moduleData) {
      setModuleData(prev => prev ? {
        ...prev,
        completedContent: prev.completedContent + 1
      } : null);
    }
    
    message.success('开始学习');
  };

  const getTypeIcon = (type: StudyContent['type']) => {
    switch (type) {
      case 'video':
        return <PlayCircleOutlined style={{ color: '#1890ff' }} />;
      case 'text':
        return <BookOutlined style={{ color: '#52c41a' }} />;
      case 'exercise':
        return <CheckCircleOutlined style={{ color: '#faad14' }} />;
      default:
        return <BookOutlined />;
    }
  };

  const getDifficultyColor = (difficulty: StudyContent['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return 'green';
      case 'medium':
        return 'orange';
      case 'hard':
        return 'red';
      default:
        return 'default';
    }
  };

  const getTypeText = (type: StudyContent['type']) => {
    switch (type) {
      case 'video':
        return '视频';
      case 'text':
        return '文本';
      case 'exercise':
        return '练习';
      default:
        return '内容';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!moduleData) {
    return (
      <div className="text-center py-8">
        <p>未找到学习模块数据</p>
      </div>
    );
  }

  const progressPercent = Math.round((moduleData.completedContent / moduleData.totalContent) * 100);

  return (
    <div className="p-6">
      <Card className="mb-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-2">{moduleData.name}</h1>
          <p className="text-gray-600 mb-4">{moduleData.description}</p>
          <div className="flex items-center gap-4">
            <span>学习进度:</span>
            <Progress 
              percent={progressPercent} 
              className="flex-1 max-w-md"
              status={progressPercent === 100 ? 'success' : 'active'}
            />
            <span className="text-sm text-gray-500">
              {moduleData.completedContent}/{moduleData.totalContent}
            </span>
          </div>
        </div>
      </Card>

      <Card title="学习内容" className="mb-6">
        <List
          dataSource={studyContents}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  key="study"
                  type={item.completed ? 'default' : 'primary'}
                  icon={item.completed ? <CheckCircleOutlined /> : getTypeIcon(item.type)}
                  onClick={() => !item.completed && handleStartStudy(item.id)}
                  disabled={item.completed}
                >
                  {item.completed ? '已完成' : '开始学习'}
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={getTypeIcon(item.type)}
                title={
                  <div className="flex items-center gap-2">
                    <span className={item.completed ? 'line-through text-gray-500' : ''}>
                      {item.title}
                    </span>
                    <Tag color={getDifficultyColor(item.difficulty)}>
                      {item.difficulty === 'easy' ? '简单' : 
                       item.difficulty === 'medium' ? '中等' : '困难'}
                    </Tag>
                    <Tag>{getTypeText(item.type)}</Tag>
                  </div>
                }
                description={
                  <div>
                    <p className="mb-1">{item.description}</p>
                    {item.duration && (
                      <span className="text-sm text-gray-500">
                        预计时长: {item.duration} 分钟
                      </span>
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default StudyModuleNew;