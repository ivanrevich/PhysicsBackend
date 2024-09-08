import Login from './pages/Login';
import Home from './pages/Home';
import Layout from './components/Layout';
import Missing from './pages/Missing';
import Unauthorized from './pages/Unauthorized';
import RequireAuth from './components/RequireAuth';
import { Routes, Route } from 'react-router-dom';
import Users from './pages/Users';
const ROLES = {
  'User': "USER",
  'Editor': "MANAGER",
  'Admin': "ADMIN"
}

function App() {

  return (
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* public routes */}
          <Route path="login" element={<Login />} />
          <Route path="unauthorized" element={<Unauthorized />} />

          {/* we want to protect these routes */}
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Editor]} />}>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
          </Route>

          {/* catch all */}
          <Route path="*" element={<Missing />} />
        </Route>
      </Routes>
  );
}

export default App;