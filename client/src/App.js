import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import AccountCreation from "./components/AccountCreation";
import Content from "./components/content"; // Import the Content component
import { EthProvider } from "./contexts/EthContext";
import Demo from "./components/Demo"

const App = () => {
  return (
    <EthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />{" "}
          <Route path="/login" element={<LoginPage />} />
          {/* Default route redirects to LoginPage */}
          <Route path="/account-creation" element={<AccountCreation />} />
          <Route path="/file" element={<Content />} />{" "}
          <Route path="/testBlk" element={<Demo />} />{" "}
          {/* Route to the Content page */}
        </Routes>
      </Router>
    </EthProvider>
  );
};

export default App;
