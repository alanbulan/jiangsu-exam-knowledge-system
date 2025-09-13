import React from 'react'
import { Card, Descriptions, Tag, Space, Button, Divider } from 'antd'
import { EditOutlined, DeleteOutlined, BookOutlined } from '@ant-design/icons'
import { KnowledgePoint } from '../../store/slices/knowledgeSlice'

interface KnowledgeDetailProps {
  knowledge: KnowledgePoint
  onEdit?: () => void
  onDelete?: () => void
  onStartStudy?: () => void
}

const KnowledgeDetail: React.FC<KnowledgeDetailProps> = ({
  knowledge,
  onEdit,
  onDelete,
  onStartStudy,
}) => {
  const subjectMap: Record<string, { name: string; color: string }> = {
    xingce: { name: '行政职业能力测验', color: 'blue' },
    shenlun: { name: '申论', color: 'green' },
    mianshi: { name: '面试', color: 'orange' },
  }

  const difficultyMap: Record<string, { text: string; color: string }> = {
    easy: { text: '简单', color: 'green' },
    medium: { text: '中等', color: 'orange' },
    hard: { text: '困难', color: 'red' },
  }

  const subjectInfo = subjectMap[knowledge.subject] || { name: knowledge.subject, color: 'default' }
  const difficultyInfo = difficultyMap[knowledge.difficulty] || { text: knowledge.difficulty, color: 'default' }

  return (
    <Card
      title={knowledge.title}
      extra={
        <Space>
          <Button type="primary" icon={<BookOutlined />} onClick={onStartStudy}>
            开始学习
          </Button>
          <Button icon={<EditOutlined />} onClick={onEdit}>
            编辑
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={onDelete}>
            删除
          </Button>
        </Space>
      }
      className="shadow-sm"
    >
      <Descriptions column={2} bordered>
        <Descriptions.Item label="所属科目">
          <Tag color={subjectInfo.color}>{subjectInfo.name}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="知识分类">
          {knowledge.category}
        </Descriptions.Item>
        <Descriptions.Item label="难度等级">
          <Tag color={difficultyInfo.color}>{difficultyInfo.text}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="更新时间">
          {knowledge.updatedAt}
        </Descriptions.Item>
        <Descriptions.Item label="标签" span={2}>
          <Space size={[0, 4]} wrap>
            {knowledge.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </Space>
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left">知识点内容</Divider>
      <div className="bg-gray-50 p-4 rounded mb-4">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {knowledge.content}
        </p>
      </div>

      {knowledge.examples && knowledge.examples.length > 0 && (
        <>
          <Divider orientation="left">例题</Divider>
          <div className="space-y-3 mb-4">
            {knowledge.examples.map((example, index) => (
              <Card key={index} size="small" className="bg-blue-50">
                <p className="text-sm text-gray-700">{example}</p>
              </Card>
            ))}
          </div>
        </>
      )}

      {knowledge.exercises && knowledge.exercises.length > 0 && (
        <>
          <Divider orientation="left">练习题</Divider>
          <div className="space-y-3">
            {knowledge.exercises.map((exercise, index) => (
              <Card key={index} size="small" className="bg-green-50">
                <p className="text-sm text-gray-700">{exercise}</p>
              </Card>
            ))}
          </div>
        </>
      )}

      {knowledge.relatedTopics && knowledge.relatedTopics.length > 0 && (
        <>
          <Divider orientation="left">相关知识点</Divider>
          <div className="flex flex-wrap gap-2">
            {knowledge.relatedTopics.map((pointId) => (
              <Tag key={pointId} className="cursor-pointer hover:bg-blue-100">
                知识点 {pointId}
              </Tag>
            ))}
          </div>
        </>
      )}
    </Card>
  )
}

export default KnowledgeDetail
