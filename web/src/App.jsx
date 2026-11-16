import { Routes, Route } from 'react-router-dom';
import { BackendProvider } from './lib/BackendContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServicePage from './pages/services/ServicePage';
import Projects from './pages/Projects';
import Portal from './pages/Portal';
import Insights from './pages/Insights';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BackendProvider>
      <Routes>
        <Route path="admin" element={<Admin />} />
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:id" element={<ServicePage />} />
          <Route path="projects" element={<Projects />} />
          <Route path="portal" element={<Portal />} />
          <Route path="insights" element={<Insights />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BackendProvider>
  );
}
