import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { experiments } from "./experiments";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound.tsx";
import { ExperimentLayout } from "./shared/ExperimentLayout";
import "./App.css";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {experiments.map((exp) => {
          const Component = exp.component;
          return (
            <Route
              key={exp.id}
              path={`/${exp.id}`}
              element={
                <ExperimentLayout title={exp.title} icon={exp.icon}>
                  <Suspense
                    fallback={
                      <p className="page-loading">Loading experiment…</p>
                    }
                  >
                    <Component />
                  </Suspense>
                </ExperimentLayout>
              }
            />
          );
        })}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
