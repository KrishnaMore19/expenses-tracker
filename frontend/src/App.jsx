import React from "react";
import { AuthProvider } from "./context/AuthContext";

import { ExpenseProvider } from "./context/ExpenseContext";
import { IncomeProvider } from "./context/IncomeContext";
import AppRouter from "./router";

const App = () => {
  return (
    <AuthProvider>
      
        <ExpenseProvider>
          <IncomeProvider>
            <AppRouter />
          </IncomeProvider>
        </ExpenseProvider>
      
    </AuthProvider>
  );
};

export default App;



