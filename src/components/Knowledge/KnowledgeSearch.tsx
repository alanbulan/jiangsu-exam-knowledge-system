import React, { useState } from 'react'
import { Card, Input, Select, Button, Space, Row, Col, Tag } from 'antd'
import { SearchOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons'

const { Search } = Input
const { Option } = Select

interface SearchFilters {
  keyword: string
  subject: string
  category: string
  difficulty: string
  tags: string[]
}

interface KnowledgeSearchProps {
  onSearch?: (filters: SearchFilters) => void
  onClear?: () => void
}

const KnowledgeSearch: React.FC<KnowledgeSearchProps> = ({
  onSearch,
  onClear,
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: '',
    subject: '',
    category: '',
    difficulty: '',
    tags: [],
  })

  const handleSearch = () => {
    onSearch?.(filters)
  }

  const handleClear = () => {
    const emptyFilters: SearchFilters = {
      keyword: '',
      subject: '',
      category: '',
      difficulty: '',
      tags: [],
    }
    setFilters(emptyFilters)
    onClear?.()
  }

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const categories = [
    '数量关系', '言语理解', '判断推理', '资料分析', '常识判断',
    '归纳概括', '综合分析', '提出对策', '应用文写作', '文章写作',
    '综合分析能力', '计划组织协调', '应急应变', '人际交往', '言语表达'
  ]

  const commonTags = [
    '基础', '重点', '难点', '技巧', '方法', '公式', '例题', '真题'
  ]

  return (
    <Card title="知识点搜索" className="mb-4">
      <Space direction="vertical" className="w-full" size="middle">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Search
              placeholder="搜索知识点标题或内容..."
              value={filters.keyword}
              onChange={(e) => updateFilter('keyword', e.target.value)}
              onSearch={handleSearch}
              enterButton={<SearchOutlined />}
              size="large"
            />
          </Col>
          <Col xs={24} md={12}>
            <Space className="w-full">
              <Button
                type="primary"
                icon={<FilterOutlined />}
                onClick={handleSearch}
                size="large"
              >
                搜索
              </Button>
              <Button
                icon={<ClearOutlined />}
                onClick={handleClear}
                size="large"
              >
                清除
              </Button>
            </Space>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Select
              placeholder="选择科目"
              value={filters.subject || undefined}
              onChange={(value) => updateFilter('subject', value)}
              allowClear
              className="w-full"
            >
              <Option value="xingce">行政职业能力测验</Option>
              <Option value="shenlun">申论</Option>
              <Option value="mianshi">面试</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <Select
              placeholder="选择分类"
              value={filters.category || undefined}
              onChange={(value) => updateFilter('category', value)}
              allowClear
              className="w-full"
            >
              {categories.map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <Select
              placeholder="选择难度"
              value={filters.difficulty || undefined}
              onChange={(value) => updateFilter('difficulty', value)}
              allowClear
              className="w-full"
            >
              <Option value="easy">简单</Option>
              <Option value="medium">中等</Option>
              <Option value="hard">困难</Option>
            </Select>
          </Col>
        </Row>

        <div>
          <div className="mb-2">
            <span className="text-sm text-gray-600">常用标签：</span>
          </div>
          <Space size={[8, 8]} wrap>
            {commonTags.map(tag => (
              <Tag
                key={tag}
                className={`cursor-pointer ${
                  filters.tags.includes(tag) 
                    ? 'bg-blue-100 border-blue-300' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => {
                  const newTags = filters.tags.includes(tag)
                    ? filters.tags.filter(t => t !== tag)
                    : [...filters.tags, tag]
                  updateFilter('tags', newTags)
                }}
              >
                {tag}
              </Tag>
            ))}
          </Space>
        </div>

        {(filters.keyword || filters.subject || filters.category || filters.difficulty || filters.tags.length > 0) && (
          <div className="bg-blue-50 p-3 rounded">
            <div className="text-sm text-gray-600 mb-2">当前筛选条件：</div>
            <Space size={[8, 8]} wrap>
              {filters.keyword && (
                <Tag color="blue">关键词: {filters.keyword}</Tag>
              )}
              {filters.subject && (
                <Tag color="green">科目: {
                  filters.subject === 'xingce' ? '行测' :
                  filters.subject === 'shenlun' ? '申论' :
                  filters.subject === 'mianshi' ? '面试' : filters.subject
                }</Tag>
              )}
              {filters.category && (
                <Tag color="orange">分类: {filters.category}</Tag>
              )}
              {filters.difficulty && (
                <Tag color="red">难度: {
                  filters.difficulty === 'easy' ? '简单' :
                  filters.difficulty === 'medium' ? '中等' :
                  filters.difficulty === 'hard' ? '困难' : filters.difficulty
                }</Tag>
              )}
              {filters.tags.map(tag => (
                <Tag key={tag} color="purple">标签: {tag}</Tag>
              ))}
            </Space>
          </div>
        )}
      </Space>
    </Card>
  )
}

export default KnowledgeSearch