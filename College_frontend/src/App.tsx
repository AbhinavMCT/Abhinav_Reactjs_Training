import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login/login.tsx";
import UserHome from "./pages/student/userHome.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/userhome" element={<UserHome />} />
      </Routes>
    </Router>
  );
}

export default App;
