import React, { useState } from 'react'
import { Card, Form, Input, Select, Button, Divider, Tag } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'

const { TextArea } = Input
const { Option } = Select

interface KnowledgeEditorProps {
  initialValues?: any
  onSave?: (values: any) => void
  onCancel?: () => void
}

const KnowledgeEditor: React.FC<KnowledgeEditorProps> = ({
  initialValues,
  onSave,
  onCancel,
}) => {
  const [form] = Form.useForm()
  const [tags, setTags] = useState<string[]>(initialValues?.tags || [])
  const [inputTag, setInputTag] = useState('')

  const handleAddTag = () => {
    if (inputTag && !tags.includes(inputTag)) {
      setTags([...tags, inputTag])
      setInputTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      onSave?.({ ...values, tags })
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  return (
    <Card title="知识点编辑器" className="w-full">
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleSave}
      >
        <Form.Item
          name="title"
          label="知识点标题"
          rules={[{ required: true, message: '请输入知识点标题' }]}
        >
          <Input placeholder="请输入知识点标题" size="large" />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="subject"
            label="所属科目"
            rules={[{ required: true, message: '请选择所属科目' }]}
          >
            <Select placeholder="请选择所属科目" size="large">
              <Option value="xingce">行政职业能力测验</Option>
              <Option value="shenlun">申论</Option>
              <Option value="mianshi">面试</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="category"
            label="知识分类"
            rules={[{ required: true, message: '请输入知识分类' }]}
          >
            <Input placeholder="如：数量关系、言语理解等" size="large" />
          </Form.Item>
        </div>

        <Form.Item
          name="difficulty"
          label="难度等级"
          rules={[{ required: true, message: '请选择难度等级' }]}
        >
          <Select placeholder="请选择难度等级" size="large">
            <Option value="easy">简单</Option>
            <Option value="medium">中等</Option>
            <Option value="hard">困难</Option>
          </Select>
        </Form.Item>

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

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            标签
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <Tag
                key={tag}
                closable
                onClose={() => handleRemoveTag(tag)}
                className="mb-1"
              >
                {tag}
              </Tag>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="添加标签"
              value={inputTag}
              onChange={(e) => setInputTag(e.target.value)}
              onPressEnter={handleAddTag}
              style={{ width: 200 }}
            />
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={handleAddTag}
            >
              添加标签
            </Button>
          </div>
        </div>

        <Divider />

        <Form.List name="examples">
          {(fields, { add, remove }) => (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                例题
              </label>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="flex gap-2 mb-2">
                  <Form.Item
                    {...restField}
                    name={[name]}
                    className="flex-1 mb-0"
                  >
                    <TextArea
                      placeholder="请输入例题内容"
                      rows={2}
                    />
                  </Form.Item>
                  <Button
                    type="text"
                    icon={<MinusCircleOutlined />}
                    onClick={() => remove(name)}
                    danger
                  />
                </div>
              ))}
              <Button
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
                className="w-full"
              >
                添加例题
              </Button>
            </div>
          )}
        </Form.List>

        <Form.List name="exercises">
          {(fields, { add, remove }) => (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                练习题
              </label>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="flex gap-2 mb-2">
                  <Form.Item
                    {...restField}
                    name={[name]}
                    className="flex-1 mb-0"
                  >
                    <TextArea
                      placeholder="请输入练习题内容"
                      rows={2}
                    />
                  </Form.Item>
                  <Button
                    type="text"
                    icon={<MinusCircleOutlined />}
                    onClick={() => remove(name)}
                    danger
                  />
                </div>
              ))}
              <Button
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
                className="w-full"
              >
                添加练习题
              </Button>
            </div>
          )}
        </Form.List>

        <Divider />

        <div className="flex justify-end gap-2">
          <Button onClick={onCancel}>
            取消
          </Button>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </div>
      </Form>
    </Card>
  )
}

export default KnowledgeEditor