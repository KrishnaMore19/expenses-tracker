import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ExpenseProvider } from "./context/ExpenseContext";
import { IncomeProvider } from "./context/IncomeContext";
import AppRouter from "./router";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ExpenseProvider>
          <IncomeProvider>
            <AppRouter />
          </IncomeProvider>
        </ExpenseProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
