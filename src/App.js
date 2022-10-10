import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Client from "./pages/Client";
import Employee from "./pages/Employee";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="" element={<Navigate to="client" replace />} />
          <Route path="client" element={<Client />} />
          <Route path="employee" element={<Employee />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
