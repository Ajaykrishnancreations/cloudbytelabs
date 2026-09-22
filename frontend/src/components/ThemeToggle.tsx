import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
type Theme = "light" | "dark";
export default function ThemeToggle() {
  const { i18n } = useTranslation();
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === "dark" ? "dark" : "light",
  );
  const labels: Record<string, [string, string]> = {
    en: ["Light", "Dark"],
    ta: ["ஒளி", "இருள்"],
    hi: ["लाइट", "डार्क"],
    ml: ["ലൈറ്റ്", "ഡാർക്ക്"],
    kn: ["ಲೈಟ್", "ಡಾರ್ಕ್"],
  };
  const [light, dark] = labels[i18n.language] || labels.en;
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#0b152b" : "#ffffff");
    try {
      localStorage.setItem("cloudbyte-theme", theme);
    } catch {}
  }, [theme]);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (
        event.key === "cloudbyte-theme" &&
        (event.newValue === "light" || event.newValue === "dark")
      )
        setTheme(event.newValue);
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  return (
    <button
      className="theme-toggle"
      role="switch"
      aria-checked={theme === "dark"}
      aria-label="Dark mode"
      title={theme === "dark" ? light : dark}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <Moon size={17} /> : <Sun size={17} />}
      <span>{theme === "dark" ? dark : light}</span>
    </button>
  );
}
