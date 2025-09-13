import { Routes, Route } from 'react-router-dom'

import MainLayout from './components/Layout/MainLayout'
import DashboardNew from './pages/DashboardNew'
import KnowledgeGraphNew from './pages/KnowledgeGraphNew'
import LearningPathNew from './pages/LearningPathNew'
import StudyModuleNew from './pages/StudyModuleNew'
import ProgressNew from './pages/ProgressNew'
import ProfileNew from './pages/ProfileNew'
import KnowledgeManagement from './pages/KnowledgeManagementNew'
import ProgressTrackingNew from './pages/ProgressTrackingNew'
import SmartSearchNew from './pages/SmartSearchNew'

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<DashboardNew />} />
        <Route path="/knowledge-graph" element={<KnowledgeGraphNew />} />
        <Route path="/knowledge" element={<KnowledgeManagement />} />
        <Route path="/learning-path" element={<LearningPathNew />} />
        <Route path="/study/:subject/:module?" element={<StudyModuleNew />} />
        <Route path="/progress" element={<ProgressNew />} />
        <Route path="/progress-tracking" element={<ProgressTrackingNew />} />
        <Route path="/smart-search" element={<SmartSearchNew />} />
        <Route path="/profile" element={<ProfileNew />} />
      </Routes>
    </MainLayout>
  )
}

export default App