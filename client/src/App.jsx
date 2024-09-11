import { Routes, Route } from "react-router-dom";
import Catalog from "./pages/Catalog";
import Layout from "./Layout";
import HomePage from "./pages/HomePage";
import Classification from "./pages/Classifcation";
import AICatalog from "./pages/AICatalog";
import NotFound from "./pages/NotFound";
import Indexes from "./pages/Indexes";
import Authority from "./pages/Authority";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/catalog/ai" element={<AICatalog />} />
        <Route path="/classification" element={<Classification />} />
        <Route path="/indexes" element={<Indexes />} />
        <Route path="/authority" element={<Authority />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;