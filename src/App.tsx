import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { techs } from "./techs";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound.tsx";
import { TechLayout } from "./shared/TechLayout.tsx";
import "./App.css";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {techs.map((exp) => {
          const Component = exp.component;
          return (
            <Route
              key={exp.id}
              path={`/${exp.id}`}
              element={
                <TechLayout title={exp.title} icon={exp.icon}>
                  <Suspense
                    fallback={<p className="page-loading">Loading tech…</p>}
                  >
                    <Component />
                  </Suspense>
                </TechLayout>
              }
            />
          );
        })}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
