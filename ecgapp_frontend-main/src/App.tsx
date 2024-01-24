import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import './App.css';
import MyAppBar from "./component/AppBar";
import PatientsPage from "./page/PatientsPage";
import ChartPage from "./page/ChartPage";
import LoginPage from "./page/LoginPage";

const customTheme = createTheme({
    palette: {
      mode: 'light', // Ustawienie trybu na jasny
      background: {
        default: '#ffffff', // Biały kolor tła
      },
      primary: {
        main: '#263238', // Bardziej czarniejszy kolor podobny do paska narzędzi
      },
      // Możesz tu dodać więcej niestandardowych kolorów
    },
    // Tutaj możesz dodać więcej opcji dla motywu, jeśli to potrzebne
  });

function App() {
  const isUserLoggedIn = localStorage.getItem("jwt");
  const [patientId, setPatientId] = useState(undefined);

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <BrowserRouter>
        {isUserLoggedIn ? (
          <>
            <MyAppBar />
            <Routes>
              <Route path="/" element={<PatientsPage setPatientId={setPatientId} />} />
              <Route path="/chart" element={<ChartPage patientId={patientId ?? -1} />} />
            </Routes>
          </>
        ) : (
          <Routes>
            <Route path="/*" element={<LoginPage />} />
          </Routes>
        )}
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
