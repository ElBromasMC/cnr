import { useEffect, useState } from "react";
import clientAxios from "../../config/axios";
import Alerta from "./Alerta";

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

const Encuesta = ({ menuId }) => {
    const date = formatDate(new Date());
    const [rating, setRating] = useState(undefined);
    const [msg, setMsg] = useState("");
    const [send, setSend] = useState(false);
    const [alert, setAlert] = useState([null, undefined]);

    useEffect(() => {
        const data = localStorage.getItem('par');
        const par = data ? JSON.parse(data) : [date, []]
        setSend(par[1].includes(menuId))
    }, [menuId]);

    const handleSubmit = async e => {
        e.preventDefault();

        if (!rating) {
            setAlert([2, "Todos los campos son obligatorios"]);
            return;
        }

        if (3 > rating && !msg ) {
            setAlert([2, "Debe darnos su opinión"]);
            return;
        }

        try {
            const data = localStorage.getItem('par');
            const par = data ? JSON.parse(data) : [date, []]
            console.log(par)
            await clientAxios.post("/testimonials", {
                rating: rating,
                message: msg,
                menuId
            })
            if (par[0] === date) {
                console.log(menuId)
                const value = [date, [...par[1], menuId]]
                console.log(value)
                localStorage.setItem('par', JSON.stringify(value));
            } else {
                const value = [date, [menuId]]
                localStorage.setItem('par', JSON.stringify(value));
            }
            setSend(true);
        } catch(error) {
            setAlert([2, error.response.data.msg]);
            return;
        }

        setAlert([3, "Encuesta enviada exitosamente"]);

    }
    
    if (!send && menuId) {
        return (
            <div className="encuesta">
                <form onSubmit={handleSubmit}>
                    <div className="rating">
                        {
                            [1,2,3,4,5].map(e => {
                                return (
                                    <i key={e} className={"rating__star fa-solid fa-star " + (e <= rating ? "checked" : "")} onClick={() => setRating(e)}></i>
                                )
                            })
                        }
                    </div>
                    <div className="msg">

                        {
                            rating <= 2 &&
                            <textarea
                                id="msg" 
                                placeholder="Ingrese su opinión" 
                                value={msg}
                                onChange={e => setMsg(e.target.value)}
                            />
                        }
                    </div>
                    <div className="botton">
                        {rating && 
                            <input 
                                type="submit"
                                value="Enviar encuesta"
                            />
                        }
                    </div>
                </form>
                { alert[1] && <Alerta alert={alert}/> }
            </div>
        )
    } else {
        return (
            <div className="nothing">
                { alert[1] && <Alerta alert={alert}/> }
            </div>
        )
    }

}

export default Encuesta;