import { useState } from "react";
import { Button } from "./components/ui/button";
import { PricingPage } from "./pages/pricing";

export function App() {
  const [dark, setDark] = useState(false);

  function toggleTheme() {
    document.documentElement.classList.toggle("dark", !dark);
    setDark(!dark);
  }

  return (
    <>
      <header className="flex justify-end border-b border-border px-6 py-3">
        <Button variant="secondary" onClick={toggleTheme}>
          {dark ? "Light" : "Dark"} theme
        </Button>
      </header>
      <PricingPage />
    </>
  );
}
