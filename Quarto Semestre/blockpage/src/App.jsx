import { Routes, Route } from 'react-router-dom';
import BlockPage from './BlockPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<BlockPage />} />
    </Routes>
  );
}

export default App;
