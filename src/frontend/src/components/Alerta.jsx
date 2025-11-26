import { useEffect } from "react";
import { useState } from "react";


const Alerta = ({alert}) => {

    const [closed, setClosed] = useState(false);

    useEffect(() => {
        setClosed(false)
        setTimeout(() => {
            setClosed(true)
        }, 1500)
    }, [alert])

    if (!closed) {
        return (
            <div className={ "alert " + (new Map([[0, "info"],[1, "warning"],[2, "error"], [3, "success"]])).get(alert[0]) }>
                <span className="close" onClick={() => {
                    setClosed(true);
                }}>&times;</span>
                <div className="alert__content">
                    { alert[1] }
                </div>            
            </div>
        )
    }
}

export default Alerta;
