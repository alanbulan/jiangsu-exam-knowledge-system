import React, { useState } from 'react';
import { Calendar, Badge, Card, Modal, Tag, Progress, Statistic } from 'antd';
import { ClockCircleOutlined, BookOutlined, TrophyOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

interface StudyData {
  date: string;
  studyTime: number;
  completedPoints: number;
  subjects: string[];
  score?: number;
  notes?: string;
}

interface StudyCalendarProps {
  studyData?: StudyData[];
}

const StudyCalendar: React.FC<StudyCalendarProps> = ({ studyData = [] }) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // 模拟学习数据
  const defaultStudyData: StudyData[] = [
    {
      date: '2024-01-15',
      studyTime: 120,
      completedPoints: 3,
      subjects: ['行测', '申论'],
      score: 85,
      notes: '完成数量关系基础题型练习'
    },
    {
      date: '2024-01-16',
      studyTime: 90,
      completedPoints: 2,
      subjects: ['面试'],
      score: 78,
      notes: '练习综合分析题型'
    },
    {
      date: '2024-01-17',
      studyTime: 150,
      completedPoints: 4,
      subjects: ['行测', '申论', '面试'],
      score: 82,
      notes: '全科目复习，重点突破薄弱环节'
    },
    {
      date: '2024-01-18',
      studyTime: 75,
      completedPoints: 2,
      subjects: ['申论'],
      score: 88,
      notes: '申论写作技巧训练'
    }
  ];

  const data = studyData.length > 0 ? studyData : defaultStudyData;

  // 获取指定日期的学习数据
  const getStudyDataForDate = (date: Dayjs): StudyData | undefined => {
    return data.find(item => dayjs(item.date).isSame(date, 'day'));
  };

  // 日历单元格渲染
  const dateCellRender = (value: Dayjs) => {
    const studyInfo = getStudyDataForDate(value);
    
    if (!studyInfo) return null;

    const getIntensityColor = (studyTime: number) => {
      if (studyTime >= 120) return '#52c41a'; // 绿色 - 高强度
      if (studyTime >= 60) return '#1890ff';  // 蓝色 - 中等强度
      return '#faad14'; // 橙色 - 低强度
    };

    return (
      <div className="space-y-1">
        <Badge 
          color={getIntensityColor(studyInfo.studyTime)}
          text={`${studyInfo.studyTime}分钟`}
          className="text-xs"
        />
        <div className="text-xs text-gray-600">
          {studyInfo.completedPoints}个知识点
        </div>
        {studyInfo.score && (
          <div className="text-xs text-blue-600">
            得分: {studyInfo.score}
          </div>
        )}
      </div>
    );
  };

  // 月份单元格渲染
  const monthCellRender = (value: Dayjs) => {
    const monthData = data.filter(item => 
      dayjs(item.date).isSame(value, 'month')
    );
    
    if (monthData.length === 0) return null;

    const totalTime = monthData.reduce((sum, item) => sum + item.studyTime, 0);
    const totalPoints = monthData.reduce((sum, item) => sum + item.completedPoints, 0);

    return (
      <div className="text-center p-2 bg-blue-50 rounded">
        <div className="text-sm font-semibold text-blue-600">
          {Math.floor(totalTime / 60)}小时
        </div>
        <div className="text-xs text-gray-600">
          {totalPoints}个知识点
        </div>
      </div>
    );
  };

  // 处理日期选择
  const handleDateSelect = (date: Dayjs) => {
    const studyInfo = getStudyDataForDate(date);
    if (studyInfo) {
      setSelectedDate(date);
      setModalVisible(true);
    }
  };

  // 获取选中日期的详细信息
  const selectedDateInfo = selectedDate ? getStudyDataForDate(selectedDate) : null;

  // 计算月度统计
  const currentMonth = dayjs();
  const monthlyData = data.filter(item => 
    dayjs(item.date).isSame(currentMonth, 'month')
  );
  
  const monthlyStats = {
    totalDays: monthlyData.length,
    totalTime: monthlyData.reduce((sum, item) => sum + item.studyTime, 0),
    totalPoints: monthlyData.reduce((sum, item) => sum + item.completedPoints, 0),
    averageScore: monthlyData.length > 0 
      ? monthlyData.reduce((sum, item) => sum + (item.score || 0), 0) / monthlyData.length 
      : 0
  };

  return (
    <div className="space-y-6">
      {/* 月度统计 */}
      <Card title={`${currentMonth.format('YYYY年MM月')} 学习统计`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Statistic
            title="学习天数"
            value={monthlyStats.totalDays}
            suffix="天"
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
          <Statistic
            title="总学习时长"
            value={Math.floor(monthlyStats.totalTime / 60)}
            suffix="小时"
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
          <Statistic
            title="完成知识点"
            value={monthlyStats.totalPoints}
            suffix="个"
            prefix={<BookOutlined />}
            valueStyle={{ color: '#faad14' }}
          />
          <Statistic
            title="平均得分"
            value={monthlyStats.averageScore}
            precision={1}
            suffix="分"
            prefix={<TrophyOutlined />}
            valueStyle={{ color: '#f5222d' }}
          />
        </div>
      </Card>

      {/* 学习日历 */}
      <Card title="学习日历" extra={
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
            <span>高强度(120分钟+)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
            <span>中等强度(60-120分钟)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-1"></div>
            <span>低强度(60分钟以下)</span>
          </div>
        </div>
      }>
        <Calendar
          dateCellRender={dateCellRender}
          monthCellRender={monthCellRender}
          onSelect={handleDateSelect}
          className="study-calendar"
        />
      </Card>

      {/* 详情弹窗 */}
      <Modal
        title={`${selectedDate?.format('YYYY年MM月DD日')} 学习详情`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedDateInfo && (
          <div className="space-y-4">
            {/* 基本统计 */}
            <div className="grid grid-cols-3 gap-4">
              <Card size="small" className="text-center">
                <Statistic
                  title="学习时长"
                  value={selectedDateInfo.studyTime}
                  suffix="分钟"
                  valueStyle={{ fontSize: '18px' }}
                />
              </Card>
              <Card size="small" className="text-center">
                <Statistic
                  title="完成知识点"
                  value={selectedDateInfo.completedPoints}
                  suffix="个"
                  valueStyle={{ fontSize: '18px' }}
                />
              </Card>
              {selectedDateInfo.score && (
                <Card size="small" className="text-center">
                  <Statistic
                    title="平均得分"
                    value={selectedDateInfo.score}
                    suffix="分"
                    valueStyle={{ fontSize: '18px' }}
                  />
                </Card>
              )}
            </div>

            {/* 学习科目 */}
            <Card size="small" title="学习科目">
              <div className="space-x-2">
                {selectedDateInfo.subjects.map(subject => (
                  <Tag 
                    key={subject}
                    color={subject === '行测' ? 'blue' : subject === '申论' ? 'green' : 'orange'}
                  >
                    {subject}
                  </Tag>
                ))}
              </div>
            </Card>

            {/* 学习笔记 */}
            {selectedDateInfo.notes && (
              <Card size="small" title="学习笔记">
                <p className="text-gray-700">{selectedDateInfo.notes}</p>
              </Card>
            )}

            {/* 学习效率 */}
            <Card size="small" title="学习效率">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>时间利用率:</span>
                  <Progress 
                    percent={Math.min((selectedDateInfo.studyTime / 180) * 100, 100)} 
                    size="small"
                    format={(percent) => `${percent?.toFixed(0)}%`}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span>知识点掌握度:</span>
                  <Progress 
                    percent={selectedDateInfo.score || 0} 
                    size="small"
                    strokeColor={selectedDateInfo.score && selectedDateInfo.score >= 80 ? '#52c41a' : '#faad14'}
                  />
                </div>
              </div>
            </Card>
          </div>
        )}
      </Modal>

      <style>{`
        .study-calendar .ant-picker-calendar-date-content {
          height: 60px;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default StudyCalendar;