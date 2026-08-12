import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import { Home } from "./routes/home";
import { NotFound } from "./routes/not-found";
import { TagsPage } from "./routes/tags";

const StatsPage = lazy(() => import("./routes/stats"));

export function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route
        path="stats"
        element={
          <Suspense fallback={<p className="p-6 text-gray-400">Loading…</p>}>
            <StatsPage />
          </Suspense>
        }
      />
      <Route path="tags" element={<TagsPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
