import { useEffect, useState } from "react";
import clientAxios from "../../../config/axios"

import Encuesta from "../../components/Encuesta";

const week = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];

function formatDate(d) {
    let month = (d.getMonth() + 1).toString();
    let day = (d.getDate()).toString();
    let year = (d.getFullYear()).toString();

    if (month.length < 2) {
        month = '0' + month;
    }
    if (day.length < 2) {
        day = '0' + day;
    }
    let fecha = [year, month, day].join('-');
    return fecha;
}

function dateToDay(date) {
    const a = date.split("-");
    return new Date(a[0], a[1] - 1, a[2]);
}

function sumDay(date, n) {
    let d = dateToDay(date);
    let nDay = new Date(d);
    let day = d.getDate();
    nDay.setDate(day + n);
    return nDay;
}

const MenuDay = () => {

    const [menu, setMenu] = useState([formatDate(new Date()), 1]); // (date, organizationId)
    const [menuData, setMenuData] = useState(new Map()); // [(mealId, (id, [(typeId, [name])]))]
    const [meals, setMeals] = useState(new Map()); // [(id, name)]
    const [types, setTypes] = useState(new Map()); // [(id, name)]

    const [charged, setCharged] = useState(false);

    useEffect(() => {
        setCharged(false);
        const getMenu = async () => {
            const data = async (path) => {
                return (await clientAxios(path)).data;
            };
            setCharged(false);
            const [md0, mls0, ts0] = await Promise.all([
                `/menus/${menu[0]}/${menu[1]}`,
                "/menus/meals",
                "/menus/types",
            ].map(data));

            const md = new Map(md0.map(e => {
                const contents = e.contents;
                const keys = [...new Set(contents.map(e => e.typeId))];
                return [e.mealId, [e.id, new Map(keys.map(e => {
                    const ctn = contents.filter(o => e == o.typeId).map(o => o.name)
                    return [e, ctn]
                }))]]
            }));
            const mls = new Map(mls0.map(i => [i.id, i.name]));
            const ts = new Map(ts0.map(i => [i.id, i.name]));

            setMenuData(md);
            setMeals(mls);
            setTypes(ts);
        }
        getMenu().then(() => {
            setCharged(true);
        });
    }, [menu]);

    return (
        <main className="calendario">
            <div className="info">
                <div className="menu">
                    <a className={charged ? null : "disable"} onClick={() => {
                        setMenu([formatDate(sumDay(menu[0], -1)), menu[1]]);
                    }}>
                        <i className="fa-solid fa-angle-left"></i>
                        <i className="fa-solid fa-angle-left"></i>
                    </a>
                    <h2>
                        <a className={charged ? null : "disable"} onClick={() => {
                            setMenu([formatDate(new Date()), menu[1]]);
                        }}>
                            MENÚ
                        </a>
                    </h2>
                    <a className={charged ? null : "disable"} onClick={() => {
                        setMenu([formatDate(sumDay(menu[0], +1)), menu[1]]);
                    }}>
                        <i className="fa-solid fa-angle-right"></i>
                        <i className="fa-solid fa-angle-right"></i>
                    </a>
                </div>
                <div className="month">
                    <span>{week[dateToDay(menu[0]).getDay()] + " " + menu[0].slice(-2)} </span>
                </div>
            </div>
            <div className="calendar">
                {
                    [...meals.keys()].sort((a, b) => a - b).map(key => {

                        const data = menuData.get(key) || [undefined, new Map()]
                        return (
                            <article className={"card " + (new Map([[1, "desayuno"], [2, "almuerzo"], [3, "cena"]])).get(key)} key={key}>
                                <div className="content">
                                    <div className="card__title">
                                        <h3>
                                            {meals.get(key).toUpperCase()}
                                        </h3>
                                    </div>
                                    <div className="card__content">
                                        {
                                            (new Map([[1, [7]], [2, [2, 3, 4, 5]], [3, [8]]])).get(key).map(typeId => {

                                                const a = data[1].get(typeId) || []

                                                return (
                                                    <div key={typeId}>
                                                        <h4>
                                                            {types.get(typeId)?.toUpperCase()}
                                                        </h4>
                                                        <hr />
                                                        <span>
                                                            {a.map(e => {
                                                                return (
                                                                    <div key={e}>
                                                                        {e}
                                                                    </div>
                                                                )
                                                            })}
                                                        </span>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                {menu[0] === formatDate(new Date()) && <Encuesta menuId={data[0]} />}
                            </article>
                        )
                    })
                }
            </div>
            <div className="info">
                <div className="menu">
                    <a className={charged ? null : "disable"} onClick={() => {
                        setMenu([formatDate(sumDay(menu[0], -1)), menu[1]]);
                    }}>
                        <i className="fa-solid fa-angle-left"></i>
                        <i className="fa-solid fa-angle-left"></i>
                    </a>
                    <h2>
                        <a className={charged ? null : "disable"} onClick={() => {
                            setMenu([formatDate(new Date()), menu[1]]);
                        }}>
                            MENÚ
                        </a>
                    </h2>
                    <a className={charged ? null : "disable"} onClick={() => {
                        setMenu([formatDate(sumDay(menu[0], +1)), menu[1]]);
                    }}>
                        <i className="fa-solid fa-angle-right"></i>
                        <i className="fa-solid fa-angle-right"></i>
                    </a>
                </div>
                <div className="month">
                    <span>{week[dateToDay(menu[0]).getDay()] + " " + menu[0].slice(-2)} </span>
                </div>
            </div>
        </main>
    )

}

export default MenuDay;
