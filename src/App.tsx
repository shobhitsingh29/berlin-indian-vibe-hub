
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {AuthLayout} from '@/components/Layout/AuthLayout';
import Index from '@/pages/Index';
import Events from '@/pages/Events';
import Profile from '@/pages/Profile';
import Admin from '@/pages/Admin';
import CreateEvent from '@/pages/CreateEvent';
import Community from '@/pages/Community';
import NotFound from '@/pages/NotFound';
import { ConfigProvider } from '@/contexts/ConfigContext';

function App() {
  return (
    <ConfigProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route index element={<Index />} />
            <Route path="events" element={<Events />} />
            <Route path="profile" element={<Profile />} />
            <Route path="admin" element={<Admin />} />
            <Route path="create-event" element={<CreateEvent />} />
            <Route path="community" element={<Community />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
