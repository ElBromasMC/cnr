import { useState, useEffect } from "react";
import { range, map } from "lodash";

import useMenus from "../hooks/useMenus";

const months = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SETIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
const week = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];

function conditionalDate (e) {
    return e.filter((a) => a[1]).map((a) => a[0]).join(" ");
}

function dateToDay (date) {
    const a = date.split("-");
    return new Date(a[0], a[1]-1, a[2]);
}

function firstDay (d, i) {
    return (new Date(d.getFullYear(), d.getMonth()+i, 1));
}

function arrayMonth (d, i, m) {
    const fDay = firstDay(d, i);
    const k = fDay.getDay();
    let days = map(range(-k,42-k), (n) => {
        let nDay = new Date(fDay);
        let day = fDay.getDate();
        nDay.setDate(day + n);
        return [formatDate(nDay), m[1], m[2]];
    });
    return days;
}

function formatDate (d) {
    let month = (d.getMonth() + 1).toString();
    let day = (d.getDate()).toString();
    let year = (d.getFullYear()).toString();

    if (month.length < 2){
        month = '0' + month;
    }        
    if (day.length < 2){
        day = '0' + day;
    }
    let fecha=[year, month, day].join('-');
    return fecha;
}

const CalendarField = ({menu, today, index, amenu}) => {
    const { setEdition, domMenus } = useMenus();
    return (
        <div className={conditionalDate([
            ["pndate", dateToDay(menu[0]).getMonth() != firstDay(today, index).getMonth()],
            ["exists", [...domMenus.values()].some(([date, organizationId, mealId]) => {
                return (
                    menu[0] == date &&
                    menu[1] == organizationId &&
                    menu[2] == mealId
                )
            })],
            ["clicked", menu[0] == amenu[0]]
        ])}
        >
            <a onClick={() => {
                setEdition(menu)
            }}>
                {dateToDay(menu[0]).getDate()}
            </a>
        </div>
    )
}

const Calendario = () => {
    const [index, setIndex] = useState(0);
    const { menu } = useMenus();
    const today = new Date();

    return (
        <div className="calendar">
            <div className="calendar__head">
                <div style={{ textAlign: "left" }}>
                    <a onClick={() => {
                        setIndex(index-1);
                    }}>
                        <i className="fa-solid fa-angle-left"></i>
                        <i className="fa-solid fa-angle-left"></i>
                    </a>
                </div>
                <div style={{ textAlign: "center" }}>
                    <a onClick={() => { setIndex(0) }}>
                        {(() => {
                            const d = firstDay(today, index);
                            return months[d.getMonth()] + " " + d.getFullYear();
                        })()}
                    </a>
                </div>

                <div style={{ textAlign: "right" }}>
                    <a onClick={() => { setIndex(index+1) }}>
                        <i className="fa-solid fa-angle-right"></i>
                        <i className="fa-solid fa-angle-right"></i>
                    </a>
                </div>
            </div>

            <div className="calendar__body">
                {week.map((i) => {
                    return (
                        <div key={i.slice(0, 2)}>
                            {i.slice(0, 2)}
                        </div>
                    )
                })}
                {arrayMonth(today, index, menu).map((m) => {
                    return (
                        <CalendarField key={m[0]} menu={m} today={today} index={index} amenu={menu} />
                    )
                }
                )}
            </div>
        </div>
    );
}

export default Calendario;
