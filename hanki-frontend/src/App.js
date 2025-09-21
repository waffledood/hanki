import "./App.css";
import { Route, Routes } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import DeckPage from "./pages/DeckPage";
import Home from "./layout/Home";
import LoginPage from "./pages/LoginPage";
import Settings from "./pages/Settings";
import Statistics from "./pages/Statistics";
import RegisterPage from "./pages/auth/RegisterPage";
import RequireAuth from "./components/RequireAuth";
import StudyPage from "./pages/study/StudyPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/decks/:deckId" element={<DeckPage />} />
          <Route path="/study/:deckId" element={<StudyPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
