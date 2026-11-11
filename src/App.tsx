import { Navigate, Route, Routes } from 'react-router-dom'
import { LinfaLayout } from './LinfaLayout'
import { LinfaHome } from './pages/LinfaHome'
import { LinfaPlants } from './pages/LinfaPlants'

function App() {
    return (
        <Routes>
            <Route element={<LinfaLayout />}>
                <Route index element={<LinfaHome />} />
                <Route path="piante" element={<LinfaPlants />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default App
