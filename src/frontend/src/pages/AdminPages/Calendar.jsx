import { useEffect } from "react";
import useMenus from "../../hooks/useMenus";
import { range, map, isEmpty } from "lodash";
import { Link } from 'react-router-dom'

import Calendario from "../../components/Calendario";
import Menu from "../../components/Menu";
import PopUp from "../../components/PopUp";
import Alerta from "../../components/Alerta";

const Calendar = () => {

    const { organizations, alert } = useMenus();

    if (!isEmpty(organizations)) {
        return (
            <main className="calendar">
                <div className="app__title">
                    <Link to="/app/admin/" className="back">
                        <i className="fa-solid fa-chevron-left"></i>
                        <i className="fa-solid fa-chevron-left"></i>
                    </Link>
                    <h1>
                        Administrador de Menús
                    </h1>
                </div>
                <div className="app__content">
                    <Calendario />
                    <Menu />
                    <PopUp />
                    { alert[1] && <Alerta /> }
                </div>
            </main>
        );
    } else {
        return (
            <main className="calendar" style={
                {
                    height: "35em",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                }
            }>
                <span className="loader"></span>
                <h3>Cargando administrador...</h3>
            </main>
        );
    }

}

export default Calendar;
