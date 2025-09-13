import React, { useCallback, useMemo, useState } from 'react'
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  NodeTypes,
  Position,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Card, Select, Button, Space, Tag, Drawer, Typography } from 'antd'
import { FullscreenOutlined } from '@ant-design/icons'
import { KnowledgePoint } from '../../store/slices/knowledgeSlice'
import KnowledgeDetail from './KnowledgeDetail'

const { Option } = Select
const { Title } = Typography

// 自定义节点组件
const KnowledgeNode = ({ data }: { data: any }) => {
  const { knowledge, onNodeClick } = data
  
  const getNodeColor = (subject: string) => {
    const colors = {
      xingce: '#1890ff',
      shenlun: '#52c41a', 
      mianshi: '#fa8c16',
    }
    return colors[subject as keyof typeof colors] || '#666'
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: '#52c41a',
      medium: '#fa8c16',
      hard: '#ff4d4f',
    }
    return colors[difficulty as keyof typeof colors] || '#666'
  }

  return (
    <div
      className="px-4 py-2 shadow-md rounded-md bg-white border-2 cursor-pointer hover:shadow-lg transition-shadow"
      style={{ 
        borderColor: getNodeColor(knowledge.subject),
        minWidth: 150,
        maxWidth: 200,
      }}
      onClick={() => onNodeClick(knowledge)}
    >
      <div className="flex flex-col">
        <div className="font-bold text-sm text-gray-800 mb-1 line-clamp-2">
          {knowledge.title}
        </div>
        <div className="flex justify-between items-center">
          <Tag 
            color={getNodeColor(knowledge.subject)}
            className="text-xs"
          >
            {knowledge.subject === 'xingce' ? '行测' : 
             knowledge.subject === 'shenlun' ? '申论' : '面试'}
          </Tag>
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: getDifficultyColor(knowledge.difficulty) }}
            title={`难度: ${knowledge.difficulty === 'easy' ? '简单' : 
                          knowledge.difficulty === 'medium' ? '中等' : '困难'}`}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {knowledge.category}
        </div>
      </div>
    </div>
  )
}

const nodeTypes: NodeTypes = {
  knowledgeNode: KnowledgeNode,
}

interface KnowledgeGraphProps {
  knowledgePoints: KnowledgePoint[]
}

const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ knowledgePoints }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedKnowledge, setSelectedKnowledge] = useState<KnowledgePoint | null>(null)
  const [isDetailVisible, setIsDetailVisible] = useState(false)

  // 处理节点点击
  const handleNodeClick = useCallback((knowledge: KnowledgePoint) => {
    setSelectedKnowledge(knowledge)
    setIsDetailVisible(true)
  }, [])

  // 生成节点和边
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    // 过滤知识点
    const filteredPoints = knowledgePoints.filter(point => {
      const subjectMatch = selectedSubject === 'all' || point.subject === selectedSubject
      const difficultyMatch = selectedDifficulty === 'all' || point.difficulty === selectedDifficulty
      return subjectMatch && difficultyMatch
    })

    // 创建节点
    const nodes: Node[] = filteredPoints.map((point, index) => {
      const angle = (index / filteredPoints.length) * 2 * Math.PI
      const radius = Math.min(300, filteredPoints.length * 30)
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius

      return {
        id: point.id,
        type: 'knowledgeNode',
        position: { x: x + 400, y: y + 300 },
        data: { 
          knowledge: point,
          onNodeClick: handleNodeClick,
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      }
    })

    // 创建边（基于前置关系和相关关系）
    const edges: Edge[] = []
    
    filteredPoints.forEach(point => {
      // 前置关系边
      if (point.prerequisites) {
        point.prerequisites.forEach(prereqId => {
          if (filteredPoints.find(p => p.id === prereqId)) {
            edges.push({
              id: `${prereqId}-${point.id}`,
              source: prereqId,
              target: point.id,
              type: 'smoothstep',
              style: { stroke: '#ff4d4f', strokeWidth: 2 },
              label: '前置',
              labelStyle: { fontSize: 10, fill: '#ff4d4f' },
              markerEnd: {
                type: 'arrowclosed' as any,
                color: '#ff4d4f',
              },
            })
          }
        })
      }

      // 相关关系边
      if (point.relatedTopics) {
        point.relatedTopics.forEach(relatedId => {
          if (filteredPoints.find(p => p.id === relatedId) && 
              !edges.find(e => 
                (e.source === point.id && e.target === relatedId) ||
                (e.source === relatedId && e.target === point.id)
              )) {
            edges.push({
              id: `${point.id}-${relatedId}`,
              source: point.id,
              target: relatedId,
              type: 'smoothstep',
              style: { stroke: '#1890ff', strokeWidth: 1, strokeDasharray: '5,5' },
              label: '相关',
              labelStyle: { fontSize: 10, fill: '#1890ff' },
            })
          }
        })
      }
    })

    return { nodes, edges }
  }, [knowledgePoints, selectedSubject, selectedDifficulty, handleNodeClick])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // 更新节点和边
  React.useEffect(() => {
    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [initialNodes, initialEdges, setNodes, setEdges])

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const graphContent = (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'h-96'}`}>
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center space-x-4">
          <Title level={4} className="m-0">知识图谱</Title>
          <Space>
            <Select
              value={selectedSubject}
              onChange={setSelectedSubject}
              style={{ width: 120 }}
              placeholder="选择科目"
            >
              <Option value="all">全部科目</Option>
              <Option value="xingce">行测</Option>
              <Option value="shenlun">申论</Option>
              <Option value="mianshi">面试</Option>
            </Select>
            <Select
              value={selectedDifficulty}
              onChange={setSelectedDifficulty}
              style={{ width: 120 }}
              placeholder="选择难度"
            >
              <Option value="all">全部难度</Option>
              <Option value="easy">简单</Option>
              <Option value="medium">中等</Option>
              <Option value="hard">困难</Option>
            </Select>
          </Space>
        </div>
        <Button
          icon={<FullscreenOutlined />}
          onClick={toggleFullscreen}
        >
          {isFullscreen ? '退出全屏' : '全屏显示'}
        </Button>
      </div>
      
      <div className={`${isFullscreen ? 'h-full' : 'h-80'} relative`}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          <Controls />
          <MiniMap 
            nodeColor={(node) => {
              const subject = node.data?.knowledge?.subject
              const colors = {
                xingce: '#1890ff',
                shenlun: '#52c41a', 
                mianshi: '#fa8c16',
              }
              return colors[subject as keyof typeof colors] || '#666'
            }}
            className="!bg-white !border"
          />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>

      {/* 图例 */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded shadow-md border">
        <div className="text-sm font-medium mb-2">图例</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-red-500"></div>
            <span>前置关系</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-blue-500 border-dashed border-t"></div>
            <span>相关关系</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>简单</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span>中等</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>困难</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {isFullscreen ? (
        graphContent
      ) : (
        <Card className="shadow-sm">
          {graphContent}
        </Card>
      )}

      {/* 知识点详情抽屉 */}
      <Drawer
        title="知识点详情"
        placement="right"
        width={600}
        open={isDetailVisible}
        onClose={() => setIsDetailVisible(false)}
      >
        {selectedKnowledge && (
          <KnowledgeDetail
            knowledge={selectedKnowledge}
            onEdit={() => {
              // 编辑功能
              setIsDetailVisible(false)
            }}
            onDelete={() => {
              // 删除功能
              setIsDetailVisible(false)
            }}
            onStartStudy={() => {
              // 开始学习功能
            }}
          />
        )}
      </Drawer>
    </>
  )
}

export default KnowledgeGraph
