import { MonPromise } from "../../helpers/PromiseMonad";
import { AsyncIO, Maybe, MaybeA } from "../../helpers/AsyncIO";
import { useEffect, useState } from "react";
import useMenus from "../../hooks/useMenus";
import clientAxios from "../../../config/axios";
import { isEmpty } from "lodash";
import { Link } from "react-router-dom";
const months = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SETIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
const week = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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

const Encuestas = () => {

    const actualDate = new Date()
    const [ymom, setYmom] = useState([actualDate.getFullYear(), actualDate.getMonth(), 1])
    const [encuestas, setEncuestas] = useState(new Map())
    const [texts, setTexts] = useState([])
    const { meals } = useMenus()

    useEffect(() => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        };

        const testimonials = MonPromise.of(() => clientAxios(`/testimonials/${ymom[0]}/${ymom[1]+1}/${ymom[2]}`, config))
            .fmap(x => new Map(x.data.map(e => [e.mealId, e.testimonials])))

        testimonials.fromPromise(
            e => setEncuestas(e),
            () => console.log("Error al obtener los testimoniales")
        )

        const tls = MonPromise.of(() => clientAxios(`/testimonials/get/${ymom[0]}/${ymom[1]+1}/${ymom[2]}`, config))
            .fmap(x => x.data)

        tls.fromPromise(
            e => setTexts(e),
            () => console.log("Error al obtener los testimoniales")
        )
    }, [ymom])
    const downloadCSV = () => {
        const a = texts.map(e => {
            const date = e.menu.date.split("-")
            return `"${e.menu.date}","${months[date[1]-1]}","${date[0]}","${meals.get(e.menu.mealId)}","${e.rating}","${e.message}"\n`
        })
        const file = new Blob(["Fecha, Mes, Ano, Comida, Rating, Comentario\n"].concat(a), {type: 'text/plain'});
        const element = document.createElement("a");
        element.href = URL.createObjectURL(file);
        element.download = "encuesta_" + formatDate(new Date()) + ".txt";
        document.body.appendChild(element);
        element.click();
    }

    if(!isEmpty(meals)){
        return(
            <main className="encuestas">
                <div className="app__title">
                    <Link to="/app/admin/" className="back">
                        <i className="fa-solid fa-chevron-left"></i>
                        <i className="fa-solid fa-chevron-left"></i>
                    </Link>
                    <h1>
                        Estadísticas de encuesta
                    </h1>
                </div>
                <div className="app__content">
                    <div className="selector">
                        <div className="date">
                            <div style={{ textAlign: "left" }}>
                                <a 
                                    onClick={() => {
                                        if (ymom[1] === 0) {
                                            setYmom([ymom[0]-1, 11, ymom[2]])
                                        } else {
                                            setYmom([ymom[0], ymom[1]-1, ymom[2]])
                                        }
                                    }}
                                >
                                    <i className="fa-solid fa-angle-left"></i>
                                    <i className="fa-solid fa-angle-left"></i>
                                </a>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <a 
                                    onClick={() => {
                                        setYmom([actualDate.getFullYear(), actualDate.getMonth(), ymom[2]])
                                    }}
                                >
                                    { months[ymom[1]] + " " + ymom[0] }
                                </a>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <a 
                                    onClick={() => {
                                        if (ymom[1] === 11) {
                                            setYmom([ymom[0]+1, 0, ymom[2]])
                                        } else {
                                            setYmom([ymom[0], ymom[1]+1, ymom[2]])
                                        }
                                    }}
                                >
                                    <i className="fa-solid fa-angle-right"></i>
                                    <i className="fa-solid fa-angle-right"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="testimonials">
                        <div className="testimonials__body">
                            <table className="testimonial__table">
                                <thead>
                                    <tr>
                                        <th>
                                            Encuesta
                                        </th>
                                        {[1,2,3,4,5].map(e => {
                                            return (
                                                <th key={e}>
                                                    {e}
                                                </th>
                                            )    
                                        })} 
                                    </tr>
                                </thead>
                                <tbody>
                                {[...encuestas.keys()].map(key => {
                                    const i = encuestas.get(key)
                                    return (
                                        <tr key={key}>
                                            <td>
                                                {capitalizeFirstLetter(meals.get(key))}
                                            </td>
                                            {[0,1,2,3,4].map(a => {
                                                const e = i[a]
                                                return (
                                                    <td key={a}>
                                                        {e == 0 ? "-" : e}
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    )
                                })
                                }
                                </tbody>
                            </table>
                        </div>
                        <div className="testimonials__head">
                            <div className="dBotton">
                                <button id="downloadBtn" value="download" onClick={downloadCSV}>Descargar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        )
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


export default Encuestas;
