import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "./layout/AuthLayout";
import ProtectedLayout from "./layout/ProtectedLayout";
import PublicLayout from "./layout/PublicLayout";

import Login from "./pages/AuthPages/Login";

import Admin from "./pages/AdminPages/Admin";
import Calendar from "./pages/AdminPages/Calendar";
import Encuestas from "./pages/AdminPages/Encuestas";

import MenuDay from "./pages/MenuPages/MenuDay";

import { AuthProvider } from './context/AuthProvider'
import { MenusProvider } from "./context/MenusProvider";

function App() {
  return (
    <BrowserRouter basename="/menu">
        <AuthProvider>
            <MenusProvider>
                <Routes>
                    <Route path="/" element={<PublicLayout />}>
                        <Route index element={<MenuDay />}/>
                        <Route path="*" element={<Navigate to="/" />} />
                    </Route>

                    <Route path="/app" element={<AuthLayout />}>
                        <Route index element={<Login />}/>
                        <Route path="*" element={<Navigate to="/app" />} />
                    </Route>

                    <Route path="/app/admin" element={<ProtectedLayout />}>
                        <Route index element={<Admin />}/>
                        <Route path="calendar" element={<Calendar />}/>
                        <Route path="encuestas" element={<Encuestas />}/>
                        <Route path="*" element={<Navigate to="/app/admin" />} />
                    </Route>
                </Routes>
            </MenusProvider>
        </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
