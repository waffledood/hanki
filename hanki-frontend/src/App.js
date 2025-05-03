import "./App.css";
import { Route, Routes } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import DeckPage from "./pages/DeckPage";
import Home from "./layout/Home";
import LoginPage from "./pages/LoginPage";
import Settings from "./pages/Settings";
import Statistics from "./pages/Statistics";
import RegisterPage from "./pages/auth/RegisterPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/decks/:deckId" element={<DeckPage />} />
      </Routes>
    </div>
  );
}

export default App;
