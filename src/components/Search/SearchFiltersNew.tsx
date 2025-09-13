import React, { useState, useEffect } from 'react';
import { Card, Select, Input, Button, Space, Tag } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import api from '../../services/api';

const { Option } = Select;

interface SearchFiltersProps {
  onSearch: (filters: SearchFilters) => void;
  onReset: () => void;
}

interface SearchFilters {
  keyword: string;
  subject: string;
  category: string;
  tags: string[];
  difficulty: string;
}

const SearchFiltersNew: React.FC<SearchFiltersProps> = ({ onSearch, onReset }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: '',
    subject: '',
    category: '',
    tags: [],
    difficulty: ''
  });
  
  const [subjectOptions, setSubjectOptions] = useState<string[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [tagOptions, setTagOptions] = useState<string[]>([]);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      // 从API获取知识点数据来生成筛选选项
      const response = await api.get('/knowledge-points');
      const knowledgePoints = response.data;
      
      // 提取唯一的科目
      const subjects = [...new Set(knowledgePoints.map((point: any) => point.subject))] as string[];
      setSubjectOptions(subjects);
      
      // 提取唯一的分类
      const categories = [...new Set(knowledgePoints.map((point: any) => point.category))] as string[];
      setCategoryOptions(categories);
      
      // 提取唯一的标签
      const allTags = knowledgePoints.flatMap((point: any) => 
        point.tags ? point.tags.split(',').map((tag: string) => tag.trim()) : []
      );
      const uniqueTags = [...new Set(allTags)].filter(tag => tag) as string[];
      setTagOptions(uniqueTags);
      
    } catch (error) {
      console.error('获取筛选选项失败:', error);
      
      // 使用备用选项
      setSubjectOptions(['行测', '申论', '面试']);
      setCategoryOptions([
        '数量关系', '言语理解与表达', '判断推理', '常识判断', '资料分析',
        '归纳概括', '综合分析', '提出对策', '应用文写作',
        '计划组织', '应变能力', '人际关系'
      ]);
      setTagOptions(['基础', '重点', '难点', '高频', '必考', '技巧', '方法', '理论', '实践', '案例']);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    const resetFilters: SearchFilters = {
      keyword: '',
      subject: '',
      category: '',
      tags: [],
      difficulty: ''
    };
    setFilters(resetFilters);
    onReset();
  };

  const handleTagClose = (removedTag: string) => {
    const newTags = filters.tags.filter(tag => tag !== removedTag);
    handleFilterChange('tags', newTags);
  };

  return (
    <Card title="搜索筛选" className="mb-4">
      <Space direction="vertical" className="w-full" size="middle">
        <div>
          <label className="block text-sm font-medium mb-2">关键词搜索</label>
          <Input
            placeholder="输入关键词搜索知识点"
            value={filters.keyword}
            onChange={(e) => handleFilterChange('keyword', e.target.value)}
            onPressEnter={handleSearch}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">科目</label>
            <Select
              placeholder="选择科目"
              value={filters.subject || undefined}
              onChange={(value) => handleFilterChange('subject', value)}
              className="w-full"
              allowClear
            >
              {subjectOptions.map(subject => (
                <Option key={subject} value={subject}>{subject}</Option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">分类</label>
            <Select
              placeholder="选择分类"
              value={filters.category || undefined}
              onChange={(value) => handleFilterChange('category', value)}
              className="w-full"
              allowClear
            >
              {categoryOptions.map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">难度</label>
            <Select
              placeholder="选择难度"
              value={filters.difficulty || undefined}
              onChange={(value) => handleFilterChange('difficulty', value)}
              className="w-full"
              allowClear
            >
              <Option value="easy">简单</Option>
              <Option value="medium">中等</Option>
              <Option value="hard">困难</Option>
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">标签</label>
          <Select
            mode="multiple"
            placeholder="选择标签"
            value={filters.tags}
            onChange={(value) => handleFilterChange('tags', value)}
            className="w-full"
          >
            {tagOptions.map(tag => (
              <Option key={tag} value={tag}>{tag}</Option>
            ))}
          </Select>
          
          {filters.tags.length > 0 && (
            <div className="mt-2">
              {filters.tags.map(tag => (
                <Tag
                  key={tag}
                  closable
                  onClose={() => handleTagClose(tag)}
                  className="mb-1"
                >
                  {tag}
                </Tag>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button 
            type="primary" 
            icon={<SearchOutlined />}
            onClick={handleSearch}
          >
            搜索
          </Button>
          <Button 
            icon={<ClearOutlined />}
            onClick={handleReset}
          >
            重置
          </Button>
        </div>
      </Space>
    </Card>
  );
};

export default SearchFiltersNew;