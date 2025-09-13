import React from 'react';
import { Card, Checkbox, Slider, Rate, Button, Divider } from 'antd';
import { ClearOutlined } from '@ant-design/icons';


const CheckboxGroup = Checkbox.Group;

interface SearchFiltersProps {
  filters: {
    subjects: string[];
    categories: string[];
    difficulty: [number, number];
    tags: string[];
    masteryLevel: [number, number];
    studyTime: [number, number];
    rating: number;
  };
  onFilterChange: (key: string, value: any) => void;
  onClearFilters: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters
}) => {
  const subjectOptions = ['行测', '申论', '面试'];
  const categoryOptions = [
    '数量关系', '言语理解与表达', '判断推理', '常识判断', '资料分析',
    '归纳概括', '综合分析', '提出对策', '应用文写作',
    '计划组织', '应变能力', '人际关系'
  ];
  const tagOptions = ['基础', '重点', '难点', '高频', '必考', '技巧', '方法', '理论', '实践', '案例'];

  return (
    <div className="space-y-6">
      {/* 科目筛选 */}
      <Card size="small" title="科目分类">
        <CheckboxGroup
          options={subjectOptions}
          value={filters.subjects}
          onChange={(value) => onFilterChange('subjects', value)}
        />
      </Card>

      {/* 知识分类 */}
      <Card size="small" title="知识分类">
        <CheckboxGroup
          options={categoryOptions}
          value={filters.categories}
          onChange={(value) => onFilterChange('categories', value)}
          className="grid grid-cols-1 gap-2"
        />
      </Card>

      {/* 难度等级 */}
      <Card size="small" title="难度等级">
        <div className="space-y-4">
          <Slider
            range
            min={1}
            max={5}
            value={filters.difficulty}
            onChange={(value) => onFilterChange('difficulty', value)}
            marks={{
              1: '简单',
              2: '较易',
              3: '中等',
              4: '较难',
              5: '困难'
            }}
          />
        </div>
      </Card>

      {/* 标签筛选 */}
      <Card size="small" title="标签筛选">
        <CheckboxGroup
          options={tagOptions}
          value={filters.tags}
          onChange={(value) => onFilterChange('tags', value)}
          className="grid grid-cols-2 gap-2"
        />
      </Card>

      {/* 掌握程度 */}
      <Card size="small" title="掌握程度">
        <div className="space-y-4">
          <Slider
            range
            min={0}
            max={100}
            value={filters.masteryLevel}
            onChange={(value) => onFilterChange('masteryLevel', value)}
            marks={{
              0: '0%',
              25: '25%',
              50: '50%',
              75: '75%',
              100: '100%'
            }}
          />
        </div>
      </Card>

      {/* 学习时长 */}
      <Card size="small" title="学习时长">
        <div className="space-y-4">
          <Slider
            range
            min={0}
            max={180}
            value={filters.studyTime}
            onChange={(value) => onFilterChange('studyTime', value)}
            marks={{
              0: '0分钟',
              60: '1小时',
              120: '2小时',
              180: '3小时'
            }}
          />
        </div>
      </Card>

      {/* 评分筛选 */}
      <Card size="small" title="评分筛选">
        <div className="space-y-4">
          <Rate
            value={filters.rating}
            onChange={(value) => onFilterChange('rating', value)}
            allowClear
          />
          <div className="text-sm text-gray-500">
            {filters.rating > 0 ? `${filters.rating}星及以上` : '不限评分'}
          </div>
        </div>
      </Card>

      {/* 清除按钮 */}
      <Divider />
      <Button 
        block 
        icon={<ClearOutlined />} 
        onClick={onClearFilters}
        disabled={!Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : v > 0)}
      >
        清除全部筛选
      </Button>
    </div>
  );
};

export default SearchFilters;