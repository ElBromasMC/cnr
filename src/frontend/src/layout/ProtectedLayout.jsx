import { Outlet, Navigate } from "react-router-dom"
import ProtectedHeader from "../components/ProtectedHeader";
import PublicFooter from "../components/PublicFooter"

import useAuth from "../hooks/useAuth";

const ProtectedLayout = () => {

    const { auth, cargando } = useAuth();

    if ( cargando ) {
        return (
            <>
                <ProtectedHeader /> 
                    <main style={
                        {
                            height: "35em",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                        }
                    }>
                        <h3>Cargando...</h3>
                    </main>
                <PublicFooter /> 
            </>
        )
    } else {
        return (
            <>
                <ProtectedHeader /> 
                    {auth?.id ? (
                        <Outlet /> 
                    ): <Navigate to="/app" /> }
                <PublicFooter /> 
            </>
        );
    }
};

export default ProtectedLayout;
