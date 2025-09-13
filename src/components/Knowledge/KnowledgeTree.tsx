import React, { useState } from 'react'
import { Tree, Card, Input, Button, Space, Dropdown, Menu } from 'antd'
import {

  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
} from '@ant-design/icons'
import type { DataNode } from 'antd/es/tree'

const { Search } = Input

interface KnowledgeTreeProps {
  onNodeSelect?: (selectedKeys: React.Key[], info: any) => void
  onNodeAdd?: (parentKey?: string) => void
  onNodeEdit?: (nodeKey: string) => void
  onNodeDelete?: (nodeKey: string) => void
}

const KnowledgeTree: React.FC<KnowledgeTreeProps> = ({
  onNodeSelect,
  onNodeAdd,
  onNodeEdit,
  onNodeDelete,
}) => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['0-0', '0-1', '0-2'])
  const [searchValue, setSearchValue] = useState('')
  const [autoExpandParent, setAutoExpandParent] = useState(true)

  // 模拟知识点树形数据
  const treeData: DataNode[] = [
    {
      title: '行政职业能力测验',
      key: '0-0',
      children: [
        {
          title: '言语理解与表达',
          key: '0-0-0',
          children: [
            { title: '片段阅读', key: '0-0-0-0' },
            { title: '文章阅读', key: '0-0-0-1' },
            { title: '选词填空', key: '0-0-0-2' },
            { title: '语句表达', key: '0-0-0-3' },
          ],
        },
        {
          title: '数量关系',
          key: '0-0-1',
          children: [
            { title: '数学运算', key: '0-0-1-0' },
            { title: '数字推理', key: '0-0-1-1' },
          ],
        },
        {
          title: '判断推理',
          key: '0-0-2',
          children: [
            { title: '图形推理', key: '0-0-2-0' },
            { title: '定义判断', key: '0-0-2-1' },
            { title: '类比推理', key: '0-0-2-2' },
            { title: '逻辑判断', key: '0-0-2-3' },
          ],
        },
        {
          title: '资料分析',
          key: '0-0-3',
          children: [
            { title: '文字资料', key: '0-0-3-0' },
            { title: '表格资料', key: '0-0-3-1' },
            { title: '图形资料', key: '0-0-3-2' },
            { title: '综合资料', key: '0-0-3-3' },
          ],
        },
        {
          title: '常识判断',
          key: '0-0-4',
          children: [
            { title: '政治常识', key: '0-0-4-0' },
            { title: '经济常识', key: '0-0-4-1' },
            { title: '法律常识', key: '0-0-4-2' },
            { title: '科技常识', key: '0-0-4-3' },
            { title: '人文常识', key: '0-0-4-4' },
          ],
        },
      ],
    },
    {
      title: '申论',
      key: '0-1',
      children: [
        {
          title: '归纳概括题',
          key: '0-1-0',
          children: [
            { title: '概括主要内容', key: '0-1-0-0' },
            { title: '概括部分内容', key: '0-1-0-1' },
            { title: '概括主要问题', key: '0-1-0-2' },
          ],
        },
        {
          title: '综合分析题',
          key: '0-1-1',
          children: [
            { title: '词句理解阐释', key: '0-1-1-0' },
            { title: '启示型分析', key: '0-1-1-1' },
            { title: '评论型分析', key: '0-1-1-2' },
          ],
        },
        {
          title: '提出对策题',
          key: '0-1-2',
          children: [
            { title: '直接对策', key: '0-1-2-0' },
            { title: '需要概括+对策', key: '0-1-2-1' },
          ],
        },
        {
          title: '应用文写作',
          key: '0-1-3',
          children: [
            { title: '倡议书', key: '0-1-3-0' },
            { title: '建议书', key: '0-1-3-1' },
            { title: '调研报告', key: '0-1-3-2' },
            { title: '讲话稿', key: '0-1-3-3' },
          ],
        },
        {
          title: '文章写作',
          key: '0-1-4',
          children: [
            { title: '议论文', key: '0-1-4-0' },
            { title: '策论文', key: '0-1-4-1' },
          ],
        },
      ],
    },
    {
      title: '面试',
      key: '0-2',
      children: [
        {
          title: '综合分析能力',
          key: '0-2-0',
          children: [
            { title: '社会现象类', key: '0-2-0-0' },
            { title: '政策理解类', key: '0-2-0-1' },
            { title: '名言警句类', key: '0-2-0-2' },
          ],
        },
        {
          title: '计划组织协调能力',
          key: '0-2-1',
          children: [
            { title: '活动策划', key: '0-2-1-0' },
            { title: '调研组织', key: '0-2-1-1' },
            { title: '会议组织', key: '0-2-1-2' },
          ],
        },
        {
          title: '应急应变能力',
          key: '0-2-2',
          children: [
            { title: '工作危机处理', key: '0-2-2-0' },
            { title: '公共危机处理', key: '0-2-2-1' },
          ],
        },
        {
          title: '人际交往意识与技巧',
          key: '0-2-3',
          children: [
            { title: '与领导关系', key: '0-2-3-0' },
            { title: '与同事关系', key: '0-2-3-1' },
            { title: '与群众关系', key: '0-2-3-2' },
          ],
        },
        {
          title: '言语理解与表达能力',
          key: '0-2-4',
          children: [
            { title: '演讲', key: '0-2-4-0' },
            { title: '情景模拟', key: '0-2-4-1' },
          ],
        },
      ],
    },
  ]

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys)
    setAutoExpandParent(false)
  }

  const onSearch = (value: string) => {
    setSearchValue(value)
    if (value) {
      // 搜索逻辑：展开包含搜索关键词的节点
      const expandedKeys = getExpandedKeys(treeData, value)
      setExpandedKeys(expandedKeys)
      setAutoExpandParent(true)
    }
  }

  const getExpandedKeys = (data: DataNode[], searchValue: string): React.Key[] => {
    const expandedKeys: React.Key[] = []
    
    const findKeys = (nodes: DataNode[], parentKey?: React.Key) => {
      nodes.forEach((node) => {
        if (node.title && node.title.toString().toLowerCase().includes(searchValue.toLowerCase())) {
          if (parentKey) expandedKeys.push(parentKey)
          if (node.key) expandedKeys.push(node.key)
        }
        if (node.children) {
          findKeys(node.children, node.key)
        }
      })
    }
    
    findKeys(data)
    return expandedKeys
  }

  const getNodeMenu = (nodeKey: string) => (
    <Menu
      items={[
        {
          key: 'add',
          icon: <PlusOutlined />,
          label: '添加子节点',
          onClick: () => onNodeAdd?.(nodeKey),
        },
        {
          key: 'edit',
          icon: <EditOutlined />,
          label: '编辑节点',
          onClick: () => onNodeEdit?.(nodeKey),
        },
        {
          type: 'divider',
        },
        {
          key: 'delete',
          icon: <DeleteOutlined />,
          label: '删除节点',
          danger: true,
          onClick: () => onNodeDelete?.(nodeKey),
        },
      ]}
    />
  )

  const titleRender = (nodeData: DataNode) => {
    const title = nodeData.title as string
    const index = title.toLowerCase().indexOf(searchValue.toLowerCase())
    
    if (index > -1 && searchValue) {
      const beforeStr = title.substring(0, index)
      const matchStr = title.substring(index, index + searchValue.length)
      const afterStr = title.substring(index + searchValue.length)
      
      return (
        <div className="flex items-center justify-between group">
          <span>
            {beforeStr}
            <span className="bg-yellow-200">{matchStr}</span>
            {afterStr}
          </span>
          <Dropdown
            overlay={getNodeMenu(nodeData.key as string)}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button
              type="text"
              size="small"
              icon={<MoreOutlined />}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            />
          </Dropdown>
        </div>
      )
    }
    
    return (
      <div className="flex items-center justify-between group">
        <span>{title}</span>
        <Dropdown
          overlay={getNodeMenu(nodeData.key as string)}
          trigger={['click']}
          placement="bottomRight"
        >
          <Button
            type="text"
            size="small"
            icon={<MoreOutlined />}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          />
        </Dropdown>
      </div>
    )
  }

  return (
    <Card title="知识点结构" className="h-full">
      <div className="mb-4">
        <Space className="w-full">
          <Search
            placeholder="搜索知识点"
            allowClear
            onSearch={onSearch}
            style={{ width: 200 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => onNodeAdd?.()}
          >
            添加根节点
          </Button>
        </Space>
      </div>
      
      <Tree
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        treeData={treeData}
        onSelect={onNodeSelect}
        titleRender={titleRender}
        className="knowledge-tree"
      />
    </Card>
  )
}

export default KnowledgeTree