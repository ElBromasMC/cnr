import { useEffect } from "react";
import { useState } from "react"


const Confirmar = ({action, open, setOpen}) => {
    if (open) {
        return (
            <div className="confirm" style={{display: "flex"}}>
                <div className="popup__content">
                    <div className="content">
                        <h2>
                            Confirmar
                        </h2>
                        <div className="options">
                            <a onClick={() => {
                                action()
                                setOpen(false)
                            }}>Sí</a>
                            <a onClick={() => {
                                setOpen(false)
                            }}>No</a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Confirmar;
