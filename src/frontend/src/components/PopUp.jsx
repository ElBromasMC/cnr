import { useState, useEffect } from "react";

import useMenus from "../hooks/useMenus";
import Select from 'react-select';
import Alerta from "./Alerta";

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const Action = ({action, typeId, setAlert}) => {
    
    const { contents, saveContent, updateContent } = useMenus();
    const [newContent, setNewContent] = useState("");
    const [upContent, setUpContent] = useState({})

    const handleCreate = e => {
        e.preventDefault()

        if (!newContent) {
            setAlert([2, "Debe ingresar un contenido"]);
            return;
        }

        if ([...contents.get(typeId).values()].includes(newContent)) {
            setAlert([2, "El contenido ingresado ya existe"]);
            return;
        }

        saveContent({
            name: newContent,
            typeId
        })
        
        setNewContent("");
        setAlert([3, "Contenido creado exitosamente"]);
    }

    const handleUpdate = e => {
        e.preventDefault()

        if (!upContent.id || !upContent.name) {
            setAlert([2, "Debe ingresar información en ambos campos"]);
            return;
        }

        if ([...contents.get(typeId).values()].includes(upContent.name)) {
            setAlert([2, "El contenido ingresado ya existe"]);
            return;
        }

        updateContent(upContent)
        setAlert([3, "Contenido modificado exitosamente"]);
    }

    const handleChange = input => {
        if (input) {
            setUpContent({
                ...upContent,
                id: input.value
            })
        } else {
            setUpContent({
                ...upContent,
                id: null
            })
        }
    };

    const c = contents.get(typeId);
    const contentList = [...c.keys()].map(key => {
        const name = c.get(key);
        return {
            label: name,
            value: key,
        }
    });
    const value = upContent.id ? {
        label: c.get(upContent.id),
        value: upContent.id,
    } : null

    if (action == 0) {
        return (
            <form className="create" onSubmit={handleCreate}>
                <input
                    id="content"
                    type="text"
                    placeholder="Ingrese el nuevo contenido"
                    autoComplete="off"
                    value={newContent}
                    onChange={e => {
                        setNewContent(e.target.value)
                    }}
                />
                <div className="botton">
                    <input 
                        type="submit"
                        value="Añadir contenido"
                    />
                </div>
            </form>
        )
    }

    if (action == 1) {
        return (
            <form onSubmit={handleUpdate} className="update">
                <Select
                    isClearable
                    onChange={handleChange}
                    options={contentList}
                    value={value}
                />
                <input
                    id="content"
                    type="text"
                    placeholder="Ingrese el nuevo nombre"
                    autoComplete="off"
                    value={upContent.name || ""}
                    onChange={e => {
                        setUpContent({
                            ...upContent,
                            name: e.target.value
                        })
                    }}
                />
                <div className="botton">
                    <input 
                        type="submit"
                        value="Modificar contenido"
                    />
                </div>
            </form>
            
        )
    }

    if (action == 2) {
        return (
            <form className="delete">
    
            </form>
        )
    }

}

const PopUp = () => {
    const [action, setAction] = useState(0);
    const { type, setTypeEdition, types } = useMenus();
    const [alert, setAlert] = useState([null, undefined]);

    if (type) {
        return (
            <div className="popup" style={{display: "flex"}}>
                <div className="popup__content">
                    <span className="close" onClick={() => {
                        setTypeEdition(null);
                        setAction(0);
                    }}>&times;</span>
                    <div className="content">
                        <h2>
                            {capitalizeFirstLetter(types.get(type))}
                        </h2>
                        <div className="options">
                            <a onClick={() => {setAction(0)}} className={action===0 ? "active" : null}>
                                Añadir
                            </a>
                            <a onClick={() => {setAction(1)}} className={action===1 ? "active" : null}>
                                Modificar
                            </a>
                            <a onClick={() => {setAction(2)}} className={action===2 ? "active" : null}>
                                Eliminar
                            </a>
                        </div>
                        <Action action={action} typeId={type} setAlert={setAlert}/>
                    </div>
                </div>
                { alert[1] && <Alerta alert={alert}/> }
            </div>
        )
    } else {
        return (
            <div className="popup" style={{display: "none"}}>
            </div>
        )
    }

};

export default PopUp;

