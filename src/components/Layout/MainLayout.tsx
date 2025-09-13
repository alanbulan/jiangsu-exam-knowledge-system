import React, { useState } from 'react'
import { Layout, Menu, Avatar, Dropdown, Input, Badge, Button } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  DashboardOutlined,
  NodeIndexOutlined,
  RocketOutlined,
  BookOutlined,
  BarChartOutlined,
  UserOutlined,
  SearchOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  EditOutlined,
} from '@ant-design/icons'

const { Header, Sider, Content } = Layout
const { Search } = Input

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: '学习概览',
    },
    {
      key: '/knowledge-graph',
      icon: <NodeIndexOutlined />,
      label: '知识图谱',
    },
    {
      key: '/knowledge',
      icon: <EditOutlined />,
      label: '知识点管理',
    },
    {
      key: '/learning-path',
      icon: <RocketOutlined />,
      label: '学习路径',
    },
    {
      key: '/progress-tracking',
      icon: <BarChartOutlined />,
      label: '进度跟踪',
    },
    {
      key: '/smart-search',
      icon: <SearchOutlined />,
      label: '智能搜索',
    },
    {
      key: 'subjects',
      icon: <BookOutlined />,
      label: '科目学习',
      children: [
        {
          key: '/study/xingce',
          label: '行政职业能力测验',
        },
        {
          key: '/study/shenlun',
          label: '申论',
        },
        {
          key: '/study/mianshi',
          label: '面试',
        },
      ],
    },
    {
      key: '/progress',
      icon: <BarChartOutlined />,
      label: '学习统计',
    },
  ]

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        // 处理退出登录逻辑
        console.log('退出登录')
      },
    },
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  return (
    <Layout className="min-h-screen">
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        className="bg-white shadow-lg"
        width={240}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">江</span>
            </div>
            {!collapsed && (
              <span className="text-lg font-semibold text-gray-800">
                江苏省考知识库
              </span>
            )}
          </div>
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          className="border-r-0 mt-4"
        />
      </Sider>

      <Layout>
        <Header className="bg-white shadow-sm px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="text-lg"
            />
            
            <Search
              placeholder="搜索知识点、题目..."
              allowClear
              style={{ width: 300 }}
              onSearch={(value) => console.log('搜索:', value)}
            />
          </div>

          <div className="flex items-center space-x-4">
            <Badge count={3} size="small">
              <Button 
                type="text" 
                icon={<BellOutlined />} 
                className="text-lg"
              />
            </Badge>

            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
            >
              <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
                <Avatar 
                  size="small" 
                  icon={<UserOutlined />}
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                />
                <span className="text-sm text-gray-700">学习者</span>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content className="p-6 bg-gray-50 min-h-[calc(100vh-64px)]">
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout