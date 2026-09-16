import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<h1>Tela de Cadastro</h1>} />
        <Route path="/dashboard" element={<h1>Dashboard de Tarefas</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;