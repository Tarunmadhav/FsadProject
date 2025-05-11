import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import FilesPage from './pages/FilesPage';
import ProfilePage from './pages/ProfilePage';
import RecentPage from './pages/RecentPage';
import SharedPage from './pages/SharedPage';
import StarredPage from './pages/StarredPage';
import TrashPage from './pages/TrashPage';
import LandingPage from './pages/LandingPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/files" element={<FilesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/recent" element={<RecentPage />} />
        <Route path="/shared" element={<SharedPage />} />
        <Route path="/starred" element={<StarredPage />} />
        <Route path="/trash" element={<TrashPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/welcome" element={<LandingPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;