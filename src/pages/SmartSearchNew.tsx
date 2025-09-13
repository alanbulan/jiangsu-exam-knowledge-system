import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Input, Checkbox, Button, Table, Tag, Drawer, Space, Collapse, Slider, Rate, Empty, Pagination, message } from 'antd';
import { SearchOutlined, FilterOutlined, ClearOutlined, BookOutlined, StarOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import api from '../services/api';

const { Search } = Input;
const CheckboxGroup = Checkbox.Group;
const { Panel } = Collapse;

interface KnowledgeItem {
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
  content: string;
  prerequisites: string[];
  relatedTopics: string[];
}

interface SearchFilters {
  subjects: string[];
  categories: string[];
  difficulty: [number, number];
  tags: string[];
  masteryLevel: [number, number];
  studyTime: [number, number];
  rating: number;
}

const SmartSearchNew: React.FC = () => {

  const [searchResults, setSearchResults] = useState<KnowledgeItem[]>([]);
  const [filteredResults, setFilteredResults] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterVisible, setFilterVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // 筛选条件
  const [filters, setFilters] = useState<SearchFilters>({
    subjects: [],
    categories: [],
    difficulty: [1, 5],
    tags: [],
    masteryLevel: [0, 100],
    studyTime: [0, 180],
    rating: 0
  });

  // 知识点数据从API获取
  const [knowledgeData, setKnowledgeData] = useState<KnowledgeItem[]>([]);

  // 从API获取知识点数据
  useEffect(() => {
    const fetchKnowledgeData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/knowledge-points');
        
        // 转换数据格式以匹配KnowledgeItem接口
        const transformedData = response.data.map((item: any) => ({
          id: item.id.toString(),
          title: item.title,
          subject: item.subject,
          category: item.category,
          difficulty: item.difficulty === 'easy' ? 1 : item.difficulty === 'medium' ? 2 : 3,
          tags: item.tags || [],
          description: item.content,
          studyTime: Math.floor(Math.random() * 60) + 15,
          masteryLevel: Math.floor(Math.random() * 100),
          lastStudied: new Date().toISOString().split('T')[0],
          viewCount: Math.floor(Math.random() * 200) + 50,
          rating: Math.random() * 2 + 3,
          content: item.content,
          prerequisites: item.prerequisites || [],
          relatedTopics: item.relatedTopics || []
        }));
        
        setKnowledgeData(transformedData);
        setSearchResults(transformedData);
        setFilteredResults(transformedData);
      } catch (error) {
        console.error('获取知识点数据失败:', error);
        message.error('获取知识点数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchKnowledgeData();
  }, []);

  // 搜索选项
  const subjectOptions = ['行测', '申论', '面试'];
  const categoryOptions = ['数量关系', '言语理解与表达', '判断推理', '常识判断', '资料分析', '归纳概括', '综合分析', '提出对策', '应用文写作', '计划组织', '应变能力', '人际关系'];
  const tagOptions = ['基础', '重点', '难点', '高频', '必考', '技巧', '方法', '理论', '实践', '案例'];

  // 应用筛选条件
  const applyFilters = (results: KnowledgeItem[] = searchResults) => {
    let filtered = results.filter(item => {
      // 科目筛选
      if (filters.subjects.length > 0 && !filters.subjects.includes(item.subject)) {
        return false;
      }
      
      // 分类筛选
      if (filters.categories.length > 0 && !filters.categories.includes(item.category)) {
        return false;
      }
      
      // 难度筛选
      if (item.difficulty < filters.difficulty[0] || item.difficulty > filters.difficulty[1]) {
        return false;
      }
      
      // 标签筛选
      if (filters.tags.length > 0 && !filters.tags.some(tag => item.tags.includes(tag))) {
        return false;
      }
      
      // 掌握程度筛选
      if (item.masteryLevel < filters.masteryLevel[0] || item.masteryLevel > filters.masteryLevel[1]) {
        return false;
      }
      
      // 学习时间筛选
      if (item.studyTime < filters.studyTime[0] || item.studyTime > filters.studyTime[1]) {
        return false;
      }
      
      // 评分筛选
      if (filters.rating > 0 && item.rating < filters.rating) {
        return false;
      }
      
      return true;
    });
    
    setFilteredResults(filtered);
    setCurrentPage(1);
  };

  // 执行搜索
  const handleSearch = (value: string) => {
    setSearchText(value);
    if (!value.trim()) {
      setSearchResults(knowledgeData);
      applyFilters(knowledgeData);
      return;
    }
    
    const results = knowledgeData.filter(item =>
      item.title.toLowerCase().includes(value.toLowerCase()) ||
      item.description.toLowerCase().includes(value.toLowerCase()) ||
      item.content.toLowerCase().includes(value.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(value.toLowerCase()))
    );
    
    setSearchResults(results);
    applyFilters(results);
  };

  // 更新筛选条件
  const updateFilter = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters();
  };

  // 清除筛选条件
  const clearFilters = () => {
    const defaultFilters: SearchFilters = {
      subjects: [],
      categories: [],
      difficulty: [1, 5],
      tags: [],
      masteryLevel: [0, 100],
      studyTime: [0, 180],
      rating: 0
    };
    setFilters(defaultFilters);
    setFilteredResults(searchResults);
  };

  // 表格列定义
  const columns: ColumnsType<KnowledgeItem> = [
    {
      title: '知识点',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: (text: string, record: KnowledgeItem) => (
        <Button 
          type="link" 
          onClick={() => {
            setSelectedItem(record);
            setDetailVisible(true);
          }}
        >
          {text}
        </Button>
      ),
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
        };
        return <Tag color={colorMap[subject] || 'default'}>{subject}</Tag>;
      },
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 80,
      render: (difficulty: number) => (
        <Rate disabled defaultValue={difficulty} />
      ),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 150,
      render: (tags: string[]) => (
        <>
          {tags.slice(0, 2).map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
          {tags.length > 2 && <Tag>+{tags.length - 2}</Tag>}
        </>
      ),
    },
    {
      title: '掌握程度',
      dataIndex: 'masteryLevel',
      key: 'masteryLevel',
      width: 100,
      render: (level: number) => (
        <div>
          <div style={{ width: 60 }}>
            <div 
              style={{ 
                width: `${level}%`, 
                height: 6, 
                backgroundColor: level > 70 ? '#52c41a' : level > 40 ? '#faad14' : '#ff4d4f',
                borderRadius: 3
              }} 
            />
          </div>
          <span style={{ fontSize: 12 }}>{level}%</span>
        </div>
      ),
    },
    {
      title: '学习时间',
      dataIndex: 'studyTime',
      key: 'studyTime',
      width: 80,
      render: (time: number) => `${time}分钟`,
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      width: 80,
      render: (rating: number) => (
        <Space>
          <StarOutlined style={{ color: '#faad14' }} />
          {rating.toFixed(1)}
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record: KnowledgeItem) => (
        <Space>
          <Button 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedItem(record);
              setDetailVisible(true);
            }}
          >
            查看
          </Button>
          <Button size="small" icon={<BookOutlined />}>
            学习
          </Button>
        </Space>
      ),
    },
  ];

  // 分页数据
  const paginatedData = filteredResults.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Row gutter={[16, 16]}>
          <Col span={18}>
            <Search
              placeholder="搜索知识点、标签或内容..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
            />
          </Col>
          <Col span={6}>
            <Space>
              <Button 
                icon={<FilterOutlined />}
                onClick={() => setFilterVisible(true)}
              >
                高级筛选
              </Button>
              <Button 
                icon={<ClearOutlined />}
                onClick={clearFilters}
              >
                清除筛选
              </Button>
            </Space>
          </Col>
        </Row>

        <div style={{ marginTop: 16 }}>
          <Space wrap>
            <span>共找到 {filteredResults.length} 个知识点</span>
            {filters.subjects.length > 0 && (
              <span>
                科目: {filters.subjects.map(s => (
                  <Tag key={s} closable onClose={() => updateFilter('subjects', filters.subjects.filter(item => item !== s))}>{s}</Tag>
                ))}
              </span>
            )}
            {filters.categories.length > 0 && (
              <span>
                分类: {filters.categories.map(c => (
                  <Tag key={c} closable onClose={() => updateFilter('categories', filters.categories.filter(item => item !== c))}>{c}</Tag>
                ))}
              </span>
            )}
            {filters.tags.length > 0 && (
              <span>
                标签: {filters.tags.map(t => (
                  <Tag key={t} closable onClose={() => updateFilter('tags', filters.tags.filter(item => item !== t))}>{t}</Tag>
                ))}
              </span>
            )}
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={paginatedData}
          rowKey="id"
          loading={loading}
          pagination={false}
          style={{ marginTop: 16 }}
          locale={{
            emptyText: <Empty description="暂无数据" />
          }}
        />

        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredResults.length}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`}
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size || 10);
            }}
          />
        </div>
      </Card>

      {/* 筛选抽屉 */}
      <Drawer
        title="高级筛选"
        placement="right"
        width={400}
        onClose={() => setFilterVisible(false)}
        open={filterVisible}
      >
        <Collapse defaultActiveKey={['1', '2', '3']}>
          <Panel header="科目" key="1">
            <CheckboxGroup
              options={subjectOptions}
              value={filters.subjects}
              onChange={(value) => updateFilter('subjects', value)}
            />
          </Panel>
          
          <Panel header="分类" key="2">
            <CheckboxGroup
              options={categoryOptions}
              value={filters.categories}
              onChange={(value) => updateFilter('categories', value)}
            />
          </Panel>
          
          <Panel header="标签" key="3">
            <CheckboxGroup
              options={tagOptions}
              value={filters.tags}
              onChange={(value) => updateFilter('tags', value)}
            />
          </Panel>
          
          <Panel header="难度" key="4">
            <Slider
              range
              min={1}
              max={5}
              value={filters.difficulty}
              onChange={(value) => updateFilter('difficulty', value)}
              marks={{
                1: '简单',
                2: '较易',
                3: '中等',
                4: '较难',
                5: '困难'
              }}
            />
          </Panel>
          
          <Panel header="掌握程度" key="5">
            <Slider
              range
              min={0}
              max={100}
              value={filters.masteryLevel}
              onChange={(value) => updateFilter('masteryLevel', value)}
              marks={{
                0: '0%',
                50: '50%',
                100: '100%'
              }}
            />
          </Panel>
          
          <Panel header="学习时间" key="6">
            <Slider
              range
              min={0}
              max={180}
              value={filters.studyTime}
              onChange={(value) => updateFilter('studyTime', value)}
              marks={{
                0: '0分钟',
                60: '1小时',
                120: '2小时',
                180: '3小时'
              }}
            />
          </Panel>
          
          <Panel header="评分" key="7">
            <Rate
              value={filters.rating}
              onChange={(value) => updateFilter('rating', value || 0)}
            />
            <div style={{ marginTop: 8 }}>
              <Button size="small" onClick={() => updateFilter('rating', 0)}>
                清除评分筛选
              </Button>
            </div>
          </Panel>
        </Collapse>
        
        <div style={{ marginTop: 16 }}>
          <Button type="primary" block onClick={() => setFilterVisible(false)}>
            应用筛选
          </Button>
          <Button block style={{ marginTop: 8 }} onClick={clearFilters}>
            重置筛选
          </Button>
        </div>
      </Drawer>

      {/* 详情抽屉 */}
      <Drawer
        title={selectedItem?.title}
        placement="right"
        width={600}
        onClose={() => setDetailVisible(false)}
        open={detailVisible}
      >
        {selectedItem && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card size="small" title="基本信息">
                  <p><strong>科目:</strong> {selectedItem.subject}</p>
                  <p><strong>分类:</strong> {selectedItem.category}</p>
                  <p><strong>难度:</strong> <Rate disabled defaultValue={selectedItem.difficulty} /></p>
                  <p><strong>预计学习时间:</strong> {selectedItem.studyTime}分钟</p>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="学习状态">
                  <p><strong>掌握程度:</strong> {selectedItem.masteryLevel}%</p>
                  <p><strong>最后学习:</strong> {selectedItem.lastStudied}</p>
                  <p><strong>浏览次数:</strong> {selectedItem.viewCount}</p>
                  <p><strong>评分:</strong> {selectedItem.rating.toFixed(1)} <StarOutlined style={{ color: '#faad14' }} /></p>
                </Card>
              </Col>
            </Row>
            
            <Card size="small" title="标签" style={{ marginTop: 16 }}>
              {selectedItem.tags.map(tag => (
                <Tag key={tag} style={{ marginBottom: 8 }}>{tag}</Tag>
              ))}
            </Card>
            
            <Card size="small" title="描述" style={{ marginTop: 16 }}>
              <p>{selectedItem.description}</p>
            </Card>
            
            <Card size="small" title="详细内容" style={{ marginTop: 16 }}>
              <div dangerouslySetInnerHTML={{ __html: selectedItem.content }} />
            </Card>
            
            {selectedItem.prerequisites.length > 0 && (
              <Card size="small" title="前置知识" style={{ marginTop: 16 }}>
                {selectedItem.prerequisites.map(prereq => (
                  <Tag key={prereq} color="blue">{prereq}</Tag>
                ))}
              </Card>
            )}
            
            {selectedItem.relatedTopics.length > 0 && (
              <Card size="small" title="相关主题" style={{ marginTop: 16 }}>
                {selectedItem.relatedTopics.map(topic => (
                  <Tag key={topic} color="green">{topic}</Tag>
                ))}
              </Card>
            )}
            
            <div style={{ marginTop: 24 }}>
              <Button type="primary" size="large" block icon={<BookOutlined />}>
                开始学习
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default SmartSearchNew;