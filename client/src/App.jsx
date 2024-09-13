import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import NotFound from "./pages/NotFound";

// Import all page components
import HomePage from "./pages/HomePage";
import ManualCatalog from "./pages/ManualCatalog";
import AICatalog from "./pages/AICatalog";
import Classification from "./pages/Classifcation";
import Indexes from "./pages/Indexes";
import Authority from "./pages/Authority";

// Define routes configuration
const routes = [
  { path: "/", element: HomePage },
  { path: "/catalog/manual", element: ManualCatalog },
  { path: "/catalog/ai", element: AICatalog },
  { path: "/classification", element: Classification },
  { path: "/indexes", element: Indexes },
  { path: "/authority", element: Authority },
];

function App() {
  return (
    <Layout>
      <Routes>
        {/* Dynamically generate routes based on configuration */}
        {routes.map(({ path, element: Element }) => (
          <Route key={path} path={path} element={<Element />} />
        ))}
        {/* Catch-all route for 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
