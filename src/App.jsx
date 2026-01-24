import { useCallback } from 'react'
import { ReactFlowProvider } from 'reactflow'
import { useVsmStore } from './stores/vsmStore'
import Header from './components/ui/Header'
import Canvas from './components/canvas/Canvas'
import Sidebar from './components/ui/Sidebar'
import MetricsDashboard from './components/metrics/MetricsDashboard'
import WelcomeScreen from './components/ui/WelcomeScreen'
import StepEditor from './components/builder/StepEditor'

function App() {
  const { id, selectedStepId, isEditing, setEditing, clearSelection } =
    useVsmStore()

  const handleCanvasClick = useCallback(() => {
    if (isEditing) return
    clearSelection()
  }, [isEditing, clearSelection])

  const handleCloseEditor = useCallback(() => {
    setEditing(false)
    clearSelection()
  }, [setEditing, clearSelection])

  if (!id) {
    return <WelcomeScreen />
  }

  return (
    <ReactFlowProvider>
      <div className="h-screen flex flex-col bg-gray-100">
        <Header />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <main className="flex-1 flex flex-col" onClick={handleCanvasClick}>
            <div className="flex-1 relative">
              <Canvas />
            </div>
            <MetricsDashboard />
          </main>
          {selectedStepId && isEditing && (
            <StepEditor stepId={selectedStepId} onClose={handleCloseEditor} />
          )}
        </div>
      </div>
    </ReactFlowProvider>
  )
}

export default App
