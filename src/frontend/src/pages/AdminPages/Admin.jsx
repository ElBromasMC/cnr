import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Admin = () => {

    const navigate = useNavigate();

    return (
        <main className="admin-page">
            <div className="admin">
                <h1 className="admin__title">
                    Administrador
                </h1>
                <div className="admin__tools">
                    <div className="admin__tools__item" onClick={() => {
                        navigate("/app/admin/calendar")
                    }}>
                        <i className="fa-solid fa-compass"></i>
                        <span>
                            Administrador de menús
                        </span>
                    </div>
                    <div className="admin__tools__item" onClick={() => {
                        navigate("/app/admin/encuestas")
                    }}>
                        <i className="fa-sharp fa-solid fa-square-poll-vertical"></i>
                        <span>
                            Estadísticas de encuesta
                        </span>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Admin;
