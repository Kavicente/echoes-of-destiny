import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import CharacterPage from './components/CharacterPage';

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient">
      <h1 className="text-7xl font-bold text-center leading-none text-black">
        PICK<br />A<br />CHARACTER
      </h1>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:name" element={<CharacterPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}