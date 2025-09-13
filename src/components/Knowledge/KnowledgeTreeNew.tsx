import React, { useState, useEffect } from 'react';
import { Tree, Input, Card, Spin, message } from 'antd';
import { SearchOutlined, BookOutlined, FileTextOutlined } from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';
import api from '../../services/api';

const { Search } = Input;

interface KnowledgeTreeProps {
  onSelect?: (selectedKeys: React.Key[], info: any) => void;
}

interface KnowledgePoint {
  id: number;
  title: string;
  subject: string;
  category: string;
  content: string;
  tags?: string;
}

const KnowledgeTreeNew: React.FC<KnowledgeTreeProps> = ({ onSelect }) => {
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKnowledgePoints();
  }, []);

  const fetchKnowledgePoints = async () => {
    try {
      setLoading(true);
      const response = await api.get('/knowledge-points');
      const knowledgePoints: KnowledgePoint[] = response.data;
      
      // 构建树形结构
      const tree = buildTreeFromKnowledgePoints(knowledgePoints);
      setTreeData(tree);
      
      // 默认展开第一级
      const defaultExpandedKeys = tree.map(node => node.key);
      setExpandedKeys(defaultExpandedKeys);
      
    } catch (error) {
      console.error('获取知识点数据失败:', error);
      message.error('获取知识点数据失败');
      
      // 使用备用数据
      const fallbackTree = createFallbackTree();
      setTreeData(fallbackTree);
      setExpandedKeys(fallbackTree.map(node => node.key));
    } finally {
      setLoading(false);
    }
  };

  const buildTreeFromKnowledgePoints = (points: KnowledgePoint[]): DataNode[] => {
    const subjectMap = new Map<string, Map<string, KnowledgePoint[]>>();
    
    // 按科目和分类分组
    points.forEach(point => {
      if (!subjectMap.has(point.subject)) {
        subjectMap.set(point.subject, new Map());
      }
      
      const categoryMap = subjectMap.get(point.subject)!;
      if (!categoryMap.has(point.category)) {
        categoryMap.set(point.category, []);
      }
      
      categoryMap.get(point.category)!.push(point);
    });

    // 构建树形结构
    const tree: DataNode[] = [];
    let keyCounter = 0;

    subjectMap.forEach((categoryMap, subject) => {
      const subjectKey = `subject-${keyCounter++}`;
      const subjectNode: DataNode = {
        title: subject,
        key: subjectKey,
        icon: <BookOutlined />,
        children: []
      };

      categoryMap.forEach((points, category) => {
        const categoryKey = `category-${keyCounter++}`;
        const categoryNode: DataNode = {
          title: `${category} (${points.length})`,
          key: categoryKey,
          icon: <FileTextOutlined />,
          children: points.map(point => ({
            title: point.title,
            key: `point-${point.id}`,
            isLeaf: true,
            data: point
          }))
        };

        subjectNode.children!.push(categoryNode);
      });

      tree.push(subjectNode);
    });

    return tree;
  };

  const createFallbackTree = (): DataNode[] => {
    return [
      {
        title: '行政职业能力测验',
        key: 'subject-xingce',
        icon: <BookOutlined />,
        children: [
          {
            title: '数量关系 (5)',
            key: 'category-shuliang',
            icon: <FileTextOutlined />,
            children: [
              { title: '数学运算基础', key: 'point-1', isLeaf: true },
              { title: '数字推理', key: 'point-2', isLeaf: true },
              { title: '几何问题', key: 'point-3', isLeaf: true },
              { title: '概率统计', key: 'point-4', isLeaf: true },
              { title: '排列组合', key: 'point-5', isLeaf: true }
            ]
          },
          {
            title: '言语理解与表达 (4)',
            key: 'category-yanyu',
            icon: <FileTextOutlined />,
            children: [
              { title: '阅读理解', key: 'point-6', isLeaf: true },
              { title: '逻辑填空', key: 'point-7', isLeaf: true },
              { title: '语句表达', key: 'point-8', isLeaf: true },
              { title: '文章阅读', key: 'point-9', isLeaf: true }
            ]
          }
        ]
      },
      {
        title: '申论',
        key: 'subject-shenlun',
        icon: <BookOutlined />,
        children: [
          {
            title: '归纳概括 (3)',
            key: 'category-guina',
            icon: <FileTextOutlined />,
            children: [
              { title: '概括主要内容', key: 'point-10', isLeaf: true },
              { title: '概括主要问题', key: 'point-11', isLeaf: true },
              { title: '概括主要观点', key: 'point-12', isLeaf: true }
            ]
          }
        ]
      }
    ];
  };

  const getExpandedKeys = (data: DataNode[], searchValue: string): React.Key[] => {
    const expandedKeys: React.Key[] = [];
    
    const findExpandedKeys = (nodes: DataNode[]) => {
      nodes.forEach(node => {
        if (node.title && typeof node.title === 'string' && 
            node.title.toLowerCase().includes(searchValue.toLowerCase())) {
          expandedKeys.push(node.key);
        }
        if (node.children) {
          findExpandedKeys(node.children);
        }
      });
    };
    
    findExpandedKeys(data);
    return expandedKeys;
  };

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);
    
    if (value) {
      const newExpandedKeys = getExpandedKeys(treeData, value);
      setExpandedKeys(newExpandedKeys);
      setAutoExpandParent(true);
    } else {
      setExpandedKeys([]);
      setAutoExpandParent(false);
    }
  };

  const renderTreeNodes = (data: DataNode[]): DataNode[] => {
    return data.map(item => {
      const strTitle = item.title as string;
      const index = strTitle.toLowerCase().indexOf(searchValue.toLowerCase());
      const beforeStr = strTitle.substring(0, index);
      const afterStr = strTitle.substring(index + searchValue.length);
      
      const title = index > -1 && searchValue ? (
        <span>
          {beforeStr}
          <span className="text-red-500 bg-yellow-200">{searchValue}</span>
          {afterStr}
        </span>
      ) : (
        <span>{strTitle}</span>
      );

      if (item.children) {
        return {
          ...item,
          title,
          children: renderTreeNodes(item.children)
        };
      }

      return {
        ...item,
        title
      };
    });
  };

  if (loading) {
    return (
      <Card title="知识点树">
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  return (
    <Card title="知识点树" className="h-full">
      <div className="mb-4">
        <Search
          placeholder="搜索知识点"
          onChange={onChange}
          prefix={<SearchOutlined />}
        />
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        <Tree
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          treeData={renderTreeNodes(treeData)}
          onSelect={onSelect}
          showIcon
          className="bg-white"
        />
      </div>
    </Card>
  );
};

export default KnowledgeTreeNew;