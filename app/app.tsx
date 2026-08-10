import { Route, Routes } from "react-router";
import { Home } from "./routes/home";
import { NotFound } from "./routes/not-found";

export function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
