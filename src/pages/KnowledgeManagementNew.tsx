import React, { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Space,
  Popconfirm,
  message,
  Row,
  Col,
  Drawer,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import { useSelector } from 'react-redux'
import type { RootState } from '../store'
import { KnowledgePoint } from '../store/slices/knowledgeSlice'
import KnowledgeDetail from '../components/Knowledge/KnowledgeDetail'
import KnowledgeSearch from '../components/Knowledge/KnowledgeSearch'
import api from '../services/api'

const { Option } = Select
const { TextArea } = Input

interface SearchFilters {
  keyword: string
  subject: string
  category: string
  difficulty: string
  tags: string[]
}

const KnowledgeManagement: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isDetailVisible, setIsDetailVisible] = useState(false)
  const [editingKnowledge, setEditingKnowledge] = useState<KnowledgePoint | null>(null)
  const [selectedKnowledge, setSelectedKnowledge] = useState<KnowledgePoint | null>(null)
  const [form] = Form.useForm()
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    keyword: '',
    subject: '',
    category: '',
    difficulty: '',
    tags: [],
  })

  const { loading } = useSelector((state: RootState) => state.knowledge)

  const [knowledgeData, setKnowledgeData] = useState<KnowledgePoint[]>([])
  const [apiLoading, setApiLoading] = useState(false)

  // 从后端加载知识点数据
  const loadKnowledgePoints = async () => {
    try {
      setApiLoading(true)
      const response = await api.get('/knowledge-points')
      console.log('API响应:', response)
      
      // 转换后端数据格式以匹配前端接口
      const transformedData = response.data.map((item: any) => ({
        id: item.id.toString(),
        title: item.title,
        content: item.content,
        subject: item.subject,
        category: item.category,
        difficulty: item.difficulty.toLowerCase(),
        tags: item.tags || [],
        prerequisites: item.prerequisites || [],
        relatedTopics: item.relatedTopics || [],
        examples: item.examples || [],
        exercises: item.exercises || [],
        createdAt: item.createdAt ? item.createdAt.split('T')[0] : '',
        updatedAt: item.updatedAt ? item.updatedAt.split('T')[0] : '',
      }))
      
      setKnowledgeData(transformedData)
      message.success(`成功加载 ${transformedData.length} 个知识点`)
    } catch (error) {
      console.error('加载知识点失败:', error)
      message.error('加载知识点失败，请检查网络连接')
    } finally {
      setApiLoading(false)
    }
  }

  // 组件挂载时加载数据
  useEffect(() => {
    loadKnowledgePoints()
  }, [])

  const columns = [
    {
      title: '知识点标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: (title: string, record: KnowledgePoint) => (
        <Button
          type="link"
          onClick={() => handleViewDetail(record)}
          className="text-left p-0 h-auto"
        >
          {title}
        </Button>
      ),
    },
    {
      title: '科目',
      dataIndex: 'subject',
      key: 'subject',
      width: 120,
      render: (subject: string) => {
        const subjectMap: Record<string, { name: string; color: string }> = {
          xingce: { name: '行测', color: 'blue' },
          shenlun: { name: '申论', color: 'green' },
          mianshi: { name: '面试', color: 'orange' },
        }
        const subjectInfo = subjectMap[subject] || { name: subject, color: 'default' }
        return <Tag color={subjectInfo.color}>{subjectInfo.name}</Tag>
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
      width: 100,
      render: (difficulty: string) => {
        const difficultyMap: Record<string, { text: string; color: string }> = {
          easy: { text: '简单', color: 'green' },
          medium: { text: '中等', color: 'orange' },
          hard: { text: '困难', color: 'red' },
        }
        const difficultyInfo = difficultyMap[difficulty] || { text: difficulty, color: 'default' }
        return <Tag color={difficultyInfo.color}>{difficultyInfo.text}</Tag>
      },
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 150,
      render: (tags: string[]) => (
        <Space size={[0, 4]} wrap>
          {tags.slice(0, 2).map((tag) => (
            <Tag key={tag}>
              {tag}
            </Tag>
          ))}
          {tags.length > 2 && <Tag>+{tags.length - 2}</Tag>}
        </Space>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: KnowledgePoint) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个知识点吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const handleAdd = () => {
    setEditingKnowledge(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (record: KnowledgePoint) => {
    setEditingKnowledge(record)
    form.setFieldsValue({
      ...record,
      examples: record.examples?.join('\n'),
      exercises: record.exercises?.join('\n'),
    })
    setIsModalVisible(true)
  }

  const handleViewDetail = (record: KnowledgePoint) => {
    setSelectedKnowledge(record)
    setIsDetailVisible(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/knowledge-points/${id}`)
      setKnowledgeData(knowledgeData.filter(item => item.id !== id))
      message.success('删除成功')
    } catch (error) {
      console.error('删除失败:', error)
      message.error('删除失败，请重试')
    }
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      const apiData = {
        title: values.title,
        content: values.content,
        subject: values.subject,
        category: values.category,
        difficulty: values.difficulty.toUpperCase(),
        tags: values.tags || [],
        prerequisites: values.prerequisites || [],
        relatedTopics: values.relatedTopics || [],
        examples: values.examples ? values.examples.split('\n').filter(Boolean) : [],
        exercises: values.exercises ? values.exercises.split('\n').filter(Boolean) : [],
      }

      if (editingKnowledge) {
        // 更新知识点
        await api.put(`/knowledge-points/${editingKnowledge.id}`, apiData)
        message.success('更新成功')
      } else {
        // 创建新知识点
        await api.post('/knowledge-points', apiData)
        message.success('添加成功')
      }

      // 重新加载数据
      await loadKnowledgePoints()
      setIsModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error('保存失败:', error)
      message.error('保存失败，请重试')
    }
  }

  const handleModalCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
  }

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters)
  }

  const handleClearSearch = () => {
    setSearchFilters({
      keyword: '',
      subject: '',
      category: '',
      difficulty: '',
      tags: [],
    })
  }

  // 过滤数据
  const filteredData = knowledgeData.filter(item => {
    const matchKeyword = !searchFilters.keyword || 
      item.title.toLowerCase().includes(searchFilters.keyword.toLowerCase()) ||
      item.content.toLowerCase().includes(searchFilters.keyword.toLowerCase())
    const matchSubject = !searchFilters.subject || item.subject === searchFilters.subject
    const matchCategory = !searchFilters.category || item.category === searchFilters.category
    const matchDifficulty = !searchFilters.difficulty || item.difficulty === searchFilters.difficulty
    const matchTags = searchFilters.tags.length === 0 || 
      searchFilters.tags.some(tag => item.tags.includes(tag))
    
    return matchKeyword && matchSubject && matchCategory && matchDifficulty && matchTags
  })

  return (
    <div className="space-y-6">
      {/* 搜索组件 */}
      <KnowledgeSearch onSearch={handleSearch} onClear={handleClearSearch} />

      {/* 知识点管理主界面 */}
      <Card 
        title={`知识点管理 (共 ${filteredData.length} 条) - 真实API数据`}
        extra={
          <Space>
            <Button
              onClick={loadKnowledgePoints}
              loading={apiLoading}
            >
              刷新数据
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              添加知识点
            </Button>
          </Space>
        }
        className="shadow-sm"
      >
        {/* 知识点表格 */}
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading || apiLoading}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 添加/编辑知识点模态框 */}
      <Modal
        title={editingKnowledge ? '编辑知识点' : '添加知识点'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        okText="保存"
        cancelText="取消"
        confirmLoading={apiLoading}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            difficulty: 'easy',
            tags: [],
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="知识点标题"
                rules={[{ required: true, message: '请输入知识点标题' }]}
              >
                <Input placeholder="请输入知识点标题" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="subject"
                label="所属科目"
                rules={[{ required: true, message: '请选择所属科目' }]}
              >
                <Select placeholder="请选择所属科目">
                  <Option value="xingce">行政职业能力测验</Option>
                  <Option value="shenlun">申论</Option>
                  <Option value="mianshi">面试</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="知识分类"
                rules={[{ required: true, message: '请输入知识分类' }]}
              >
                <Input placeholder="如：数量关系、言语理解等" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="difficulty"
                label="难度等级"
                rules={[{ required: true, message: '请选择难度等级' }]}
              >
                <Select placeholder="请选择难度等级">
                  <Option value="easy">简单</Option>
                  <Option value="medium">中等</Option>
                  <Option value="hard">困难</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="content"
            label="知识点内容"
            rules={[{ required: true, message: '请输入知识点内容' }]}
          >
            <TextArea
              rows={8}
              placeholder="请详细描述知识点内容，包括概念、方法、技巧等"
            />
          </Form.Item>

          <Form.Item
            name="tags"
            label="标签"
          >
            <Select
              mode="tags"
              placeholder="添加标签，按回车确认"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="examples"
                label="例题"
              >
                <TextArea
                  rows={6}
                  placeholder="每行一个例题，可以包含详细解析"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="exercises"
                label="练习题"
              >
                <TextArea
                  rows={6}
                  placeholder="每行一个练习题"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 知识点详情抽屉 */}
      <Drawer
        title="知识点详情"
        placement="right"
        width={800}
        open={isDetailVisible}
        onClose={() => setIsDetailVisible(false)}
      >
        {selectedKnowledge && (
          <KnowledgeDetail
            knowledge={selectedKnowledge}
            onEdit={() => {
              setIsDetailVisible(false)
              handleEdit(selectedKnowledge)
            }}
            onDelete={() => {
              setIsDetailVisible(false)
              handleDelete(selectedKnowledge.id)
            }}
            onStartStudy={() => {
              message.info('开始学习功能开发中...')
            }}
          />
        )}
      </Drawer>
    </div>
  )
}

export default KnowledgeManagement