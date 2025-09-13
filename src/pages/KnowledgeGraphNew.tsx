import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Button, Tag, Spin, message } from 'antd';
import { NodeIndexOutlined, ReloadOutlined } from '@ant-design/icons';
import api from '../services/api';

interface KnowledgePoint {
  id: number;
  title: string;
  subject: string;
  difficulty: string;
  tags: string[];
  content: string;
  prerequisites: string[];
}

interface GraphNode {
  id: string;
  label: string;
  subject: string;
  difficulty: string;
  x: number;
  y: number;
}

interface GraphEdge {
  from: string;
  to: string;
  label: string;
}

const KnowledgeGraphNew: React.FC = () => {
  const [knowledgePoints, setKnowledgePoints] = useState<KnowledgePoint[]>([]);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  useEffect(() => {
    fetchKnowledgePoints();
  }, []);

  useEffect(() => {
    generateGraph();
  }, [knowledgePoints, selectedSubject]);

  const fetchKnowledgePoints = async () => {
    try {
      setLoading(true);
      const response = await api.get('/knowledge-points');
      setKnowledgePoints(response.data);
    } catch (error) {
      console.error('Failed to fetch knowledge points:', error);
      message.error('获取知识点失败');
    } finally {
      setLoading(false);
    }
  };

  const generateGraph = () => {
    const filteredPoints = selectedSubject === 'all' 
      ? knowledgePoints 
      : knowledgePoints.filter(point => point.subject === selectedSubject);

    // 生成节点
    const graphNodes: GraphNode[] = filteredPoints.map((point, index) => ({
      id: point.id.toString(),
      label: point.title,
      subject: point.subject,
      difficulty: point.difficulty,
      x: Math.cos(index * 2 * Math.PI / filteredPoints.length) * 200 + 300,
      y: Math.sin(index * 2 * Math.PI / filteredPoints.length) * 200 + 300,
    }));

    // 生成边（基于前置条件）
    const graphEdges: GraphEdge[] = [];
    filteredPoints.forEach(point => {
      if (point.prerequisites && point.prerequisites.length > 0) {
        point.prerequisites.forEach(prereq => {
          const prereqPoint = filteredPoints.find(p => p.title.includes(prereq));
          if (prereqPoint) {
            graphEdges.push({
              from: prereqPoint.id.toString(),
              to: point.id.toString(),
              label: '前置条件'
            });
          }
        });
      }
    });

    setNodes(graphNodes);
    setEdges(graphEdges);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '简单': return '#52c41a';
      case '中等': return '#faad14';
      case '困难': return '#f5222d';
      default: return '#d9d9d9';
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case '行政职业能力测验': return '#1890ff';
      case '申论': return '#722ed1';
      case '面试': return '#13c2c2';
      default: return '#d9d9d9';
    }
  };

  const subjects = ['all', ...Array.from(new Set(knowledgePoints.map(point => point.subject)))];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">知识图谱</h1>
        <p className="text-gray-600">可视化展示知识点之间的关联关系</p>
      </div>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Select
                  value={selectedSubject}
                  onChange={setSelectedSubject}
                  style={{ width: 200 }}
                  placeholder="选择科目"
                >
                  <Select.Option value="all">全部科目</Select.Option>
                  {subjects.filter(s => s !== 'all').map(subject => (
                    <Select.Option key={subject} value={subject}>
                      {subject}
                    </Select.Option>
                  ))}
                </Select>
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={generateGraph}
                >
                  重新生成
                </Button>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  节点数: {nodes.length}
                </span>
                <span className="text-sm text-gray-500">
                  连接数: {edges.length}
                </span>
              </div>
            </div>

            <div className="relative bg-gray-50 rounded-lg" style={{ height: '500px', overflow: 'hidden' }}>
              <svg width="100%" height="100%" viewBox="0 0 600 600">
                {/* 绘制边 */}
                {edges.map((edge, index) => {
                  const fromNode = nodes.find(n => n.id === edge.from);
                  const toNode = nodes.find(n => n.id === edge.to);
                  if (!fromNode || !toNode) return null;
                  
                  return (
                    <g key={index}>
                      <line
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        stroke="#d9d9d9"
                        strokeWidth="2"
                        markerEnd="url(#arrowhead)"
                      />
                    </g>
                  );
                })}
                
                {/* 绘制节点 */}
                {nodes.map((node) => (
                  <g key={node.id}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="30"
                      fill={getSubjectColor(node.subject)}
                      stroke={getDifficultyColor(node.difficulty)}
                      strokeWidth="3"
                      className="cursor-pointer hover:opacity-80"
                    />
                    <text
                      x={node.x}
                      y={node.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {node.label.length > 6 ? node.label.substring(0, 6) + '...' : node.label}
                    </text>
                  </g>
                ))}
                
                {/* 箭头标记 */}
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill="#d9d9d9"
                    />
                  </marker>
                </defs>
              </svg>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">图例</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  <span className="text-sm">行政职业能力测验</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                  <span className="text-sm">申论</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-cyan-500"></div>
                  <span className="text-sm">面试</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-green-500 rounded-full"></div>
                  <span className="text-sm">简单</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-yellow-500 rounded-full"></div>
                  <span className="text-sm">中等</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-red-500 rounded-full"></div>
                  <span className="text-sm">困难</span>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col span={24}>
          <Card title="知识点列表" extra={<NodeIndexOutlined />}>
            <div className="space-y-2">
              {nodes.map((node) => {
                const point = knowledgePoints.find(p => p.id.toString() === node.id);
                if (!point) return null;
                
                return (
                  <div key={node.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: getSubjectColor(point.subject) }}
                      ></div>
                      <span className="font-medium">{point.title}</span>
                      <Tag color={getDifficultyColor(point.difficulty)}>
                        {point.difficulty}
                      </Tag>
                    </div>
                    <div className="flex items-center space-x-2">
                      {point.tags.slice(0, 2).map((tag, index) => (
                        <Tag key={index} color="blue">
                          {tag}
                        </Tag>
                      ))}
                      {point.tags.length > 2 && (
                        <Tag color="default">+{point.tags.length - 2}</Tag>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default KnowledgeGraphNew;