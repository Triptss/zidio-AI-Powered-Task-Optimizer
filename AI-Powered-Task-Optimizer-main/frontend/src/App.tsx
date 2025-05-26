import { Routes, Route } from 'react-router-dom';
import './index.css';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import AnalyzeEmotionPage from './pages/AnalyzeEmotionPage';
import AddTaskPage from './pages/AddTaskPage';
import RemoveTaskPage from './pages/RemoveTaskPage';
import NotFoundPage from './pages/NotFoundPage'; // Import NotFoundPage

// --- Main App Layout & Routing ---
function App() {
  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex flex-col">
      <Header />
      <main className="w-full max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 flex-grow flex justify-center items-start">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analyze" element={<AnalyzeEmotionPage />} />
          <Route path="/add-task" element={<AddTaskPage />} />
          <Route path="/remove-tasks" element={<RemoveTaskPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <footer className="w-full bg-gray-800 text-center text-gray-500 text-sm py-4 mt-auto">
        <p>&copy; {new Date().getFullYear()} TaskNova - AI Task Optimizer</p>
      </footer>
    </div>
  );
}

export default App;
