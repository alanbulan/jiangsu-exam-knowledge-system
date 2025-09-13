import React from 'react';
import { Table, Tag, Rate, Button, Space, Empty } from 'antd';
import { EyeOutlined, BookOutlined, StarOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

// 基础知识点接口
interface BaseKnowledgeItem {
  id: string;
  title: string;
  subject: string;
  category: string;
  difficulty: number;
  tags: string[];
  description: string;
  studyTime: number;
  masteryLevel: number;
  lastStudied?: string;
  viewCount: number;
  rating: number;
  content?: string;
  prerequisites?: string[];
  relatedTopics?: string[];
}

// 搜索结果使用的知识点类型，省略不必要的字段
type KnowledgeItem = Omit<BaseKnowledgeItem, 'content' | 'prerequisites' | 'relatedTopics'> & {
  content?: string;
  prerequisites?: string[];
  relatedTopics?: string[];
};

interface SearchResultsProps {
  results: KnowledgeItem[];
  loading: boolean;
  onViewDetail: (item: KnowledgeItem) => void;
  onStartStudy?: (item: KnowledgeItem) => void;
  onAddFavorite?: (item: KnowledgeItem) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  loading,
  onViewDetail,
  onStartStudy,
  onAddFavorite
}) => {
  const columns: ColumnsType<KnowledgeItem> = [
    {
      title: '知识点',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: KnowledgeItem) => (
        <div className="space-y-1">
          <div 
            className="font-semibold text-blue-600 cursor-pointer hover:text-blue-800" 
            onClick={() => onViewDetail(record)}
          >
            {title}
          </div>
          <div className="text-sm text-gray-500 line-clamp-2">
            {record.description}
          </div>
        </div>
      )
    },
    {
      title: '科目',
      dataIndex: 'subject',
      key: 'subject',
      width: 80,
      render: (subject: string) => (
        <Tag color={subject === '行测' ? 'blue' : subject === '申论' ? 'green' : 'orange'}>
          {subject}
        </Tag>
      )
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: string) => (
        <Tag color="purple">{category}</Tag>
      )
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 80,
      render: (difficulty: number) => (
        <Rate disabled value={difficulty} style={{ fontSize: 12 }} />
      )
    },
    {
      title: '掌握程度',
      dataIndex: 'masteryLevel',
      key: 'masteryLevel',
      width: 100,
      render: (level: number) => (
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            level >= 80 ? 'bg-green-500' : 
            level >= 60 ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>
          <span className="text-sm">{level}%</span>
        </div>
      )
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 150,
      render: (tags: string[]) => (
        <div className="space-x-1">
          {tags.slice(0, 2).map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
          {tags.length > 2 && (
            <span className="text-xs text-gray-400">+{tags.length - 2}</span>
          )}
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record: KnowledgeItem) => (
        <Space size="small">
          <Button 
            type="link" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => onViewDetail(record)}
          >
            查看
          </Button>
          {onStartStudy && (
            <Button 
              type="link" 
              size="small" 
              icon={<BookOutlined />}
              onClick={() => onStartStudy(record)}
            >
              学习
            </Button>
          )}
          {onAddFavorite && (
            <Button 
              type="link" 
              size="small" 
              icon={<StarOutlined />}
              onClick={() => onAddFavorite(record)}
            >
              收藏
            </Button>
          )}
        </Space>
      )
    }
  ];

  if (results.length === 0 && !loading) {
    return (
      <Empty 
        description="没有找到匹配的知识点"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <Table
      columns={columns}
      dataSource={results}
      rowKey="id"
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => 
          `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`
      }}
    />
  );
};

export default SearchResults;