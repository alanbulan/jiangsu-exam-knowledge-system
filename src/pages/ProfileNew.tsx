import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Avatar, 
  Button, 
  Statistic, 
  Progress, 
  List, 
  Tag, 
  Tabs,
  Form,
  Input,
  Select,
  DatePicker,
  Switch,
  message,
  Spin
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  BookOutlined,
  StarOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../services/api';

const { Option } = Select;

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  targetExam: string;
  examDate: string;
  studyGoal: string;
  avatar: string;
}

interface StudyStats {
  totalStudyTime: number;
  completedCourses: number;
  totalCourses: number;
  currentStreak: number;
  totalPoints: number;
  level: number;
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  category: string;
  earnedDate: string;
}

interface Activity {
  id: number;
  type: string;
  title: string;
  description: string;
  timestamp: string;
}

const ProfileNew: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '学习者',
    email: 'learner@example.com',
    phone: '138****8888',
    targetExam: '江苏省考',
    examDate: '2024-12-01',
    studyGoal: '每日学习2小时',
    avatar: ''
  });

  const [studyStats, setStudyStats] = useState<StudyStats>({
    totalStudyTime: 0,
    completedCourses: 0,
    totalCourses: 0,
    currentStreak: 0,
    totalPoints: 0,
    level: 1
  });

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // 获取知识点数据来生成统计
      const response = await api.get('/knowledge-points');
      const knowledgePoints = response.data;
      
      // 生成学习统计数据
      const stats: StudyStats = {
        totalStudyTime: Math.floor(Math.random() * 100) + 50,
        completedCourses: Math.floor(knowledgePoints.length * 0.6),
        totalCourses: knowledgePoints.length,
        currentStreak: Math.floor(Math.random() * 30) + 1,
        totalPoints: Math.floor(Math.random() * 5000) + 1000,
        level: Math.floor(Math.random() * 10) + 1
      };
      setStudyStats(stats);

      // 生成成就数据
      const achievementList: Achievement[] = [
        {
          id: 1,
          title: '初学者',
          description: '完成第一个知识点学习',
          icon: '🎯',
          category: '学习',
          earnedDate: '2024-01-15'
        },
        {
          id: 2,
          title: '坚持者',
          description: '连续学习7天',
          icon: '🔥',
          category: '毅力',
          earnedDate: '2024-02-01'
        },
        {
          id: 3,
          title: '知识达人',
          description: '掌握50个知识点',
          icon: '📚',
          category: '知识',
          earnedDate: '2024-02-15'
        }
      ];
      setAchievements(achievementList);

      // 生成活动数据
      const activityList: Activity[] = [
        {
          id: 1,
          type: 'study',
          title: '完成行测练习',
          description: '数量关系专项练习',
          timestamp: '2024-03-01 14:30'
        },
        {
          id: 2,
          type: 'achievement',
          title: '获得新成就',
          description: '连续学习达成者',
          timestamp: '2024-03-01 10:15'
        },
        {
          id: 3,
          type: 'exercise',
          title: '完成申论练习',
          description: '归纳概括题型练习',
          timestamp: '2024-02-28 16:45'
        }
      ];
      setActivities(activityList);

    } catch (error) {
      console.error('获取用户数据失败:', error);
      message.error('获取用户数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (values: any) => {
    try {
      // 这里应该调用API保存用户信息
      setUserProfile({ ...userProfile, ...values });
      setEditMode(false);
      message.success('用户信息保存成功');
    } catch (error) {
      console.error('保存用户信息失败:', error);
      message.error('保存用户信息失败');
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'study':
        return <BookOutlined style={{ color: '#1890ff' }} />;
      case 'achievement':
        return <TrophyOutlined style={{ color: '#faad14' }} />;
      case 'exercise':
        return <EditOutlined style={{ color: '#52c41a' }} />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  const tabItems = [
    {
      key: 'achievements',
      label: '成就徽章',
      children: (
        <Row gutter={[16, 16]}>
          {achievements.map(achievement => (
            <Col xs={24} sm={12} md={8} key={achievement.id}>
              <Card className="text-center hover:shadow-md transition-shadow">
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <h4 className="font-bold mb-1">{achievement.title}</h4>
                <p className="text-sm text-gray-500 mb-2">{achievement.description}</p>
                <Tag>{achievement.category}</Tag>
                <p className="text-xs text-gray-400 mt-2">
                  {dayjs(achievement.earnedDate).format('YYYY-MM-DD')}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      )
    },
    {
      key: 'activities',
      label: '最近活动',
      children: (
        <List
          dataSource={activities}
          renderItem={activity => (
            <List.Item>
              <List.Item.Meta
                avatar={getActivityIcon(activity.type)}
                title={activity.title}
                description={
                  <div>
                    <p>{activity.description}</p>
                    <span className="text-xs text-gray-400">{activity.timestamp}</span>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )
    },
    {
      key: 'settings',
      label: '个人设置',
      children: (
        <Form
          form={form}
          layout="vertical"
          initialValues={userProfile}
          onFinish={handleSaveProfile}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="姓名"
                name="name"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="邮箱"
                name="email"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="手机号"
                name="phone"
                rules={[{ required: true, message: '请输入手机号' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="目标考试"
                name="targetExam"
                rules={[{ required: true, message: '请选择目标考试' }]}
              >
                <Select>
                  <Option value="江苏省考">江苏省考</Option>
                  <Option value="国家公务员">国家公务员</Option>
                  <Option value="事业单位">事业单位</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="考试日期"
                name="examDate"
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="学习目标"
                name="studyGoal"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              保存设置
            </Button>
          </Form.Item>
        </Form>
      )
    }
  ];

  return (
    <div className="p-6">
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card className="text-center">
            <Avatar size={100} icon={<UserOutlined />} className="mb-4" />
            <h2 className="text-xl font-bold mb-2">{userProfile.name}</h2>
            <p className="text-gray-500 mb-4">{userProfile.email}</p>
            <div className="mb-4">
              <Tag color="blue">等级 {studyStats.level}</Tag>
              <Tag color="green">{studyStats.totalPoints} 积分</Tag>
            </div>
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              onClick={() => setEditMode(true)}
              block
            >
              编辑资料
            </Button>
          </Card>

          <Card title="学习统计" className="mt-6">
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="学习时长"
                  value={studyStats.totalStudyTime}
                  suffix="小时"
                  prefix={<ClockCircleOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="连续天数"
                  value={studyStats.currentStreak}
                  suffix="天"
                  prefix={<StarOutlined />}
                />
              </Col>
            </Row>
            <div className="mt-4">
              <p className="mb-2">课程进度</p>
              <Progress 
                percent={Math.round((studyStats.completedCourses / studyStats.totalCourses) * 100)}
                format={() => `${studyStats.completedCourses}/${studyStats.totalCourses}`}
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Tabs defaultActiveKey="achievements" items={tabItems} />
        </Col>
      </Row>
    </div>
  );
};

export default ProfileNew;