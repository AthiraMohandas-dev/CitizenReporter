// context/ReportContext.js
import { createContext, useContext, useState } from "react";

const ReportContext = createContext(null);

export function ReportProvider({ children }) {
  const [report, setReport] = useState({
    // fields collected on Screen 02 (user input)
    category: "Plastic burning",
    district: "",
    location: "",
    description: "",
    photo: null,

    // fields returned by the backend (Screen 03 draft)
    draft: null, // will hold { category, district, subject, body, officer, mailto }
    referenceId: null, // set on Screen 04 after sending, if you generate one client-side or the API returns one
  });

  const updateReport = (fields) => {
    setReport((prev) => ({ ...prev, ...fields }));
  };

  return (
    <ReportContext.Provider value={{ report, updateReport }}>
      {children}
    </ReportContext.Provider>
  );
}

export function useReport() {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error("useReport must be used within a ReportProvider");
  }
  return context;
}