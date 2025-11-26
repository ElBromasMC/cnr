import { useState, useEffect } from "react";
import { range, map, isEmpty } from "lodash";
import Select from 'react-select';
import Comida from "./Comida";
import Alerta from "./Alerta";
import Confirmar from "./Confirmar";

import useMenus from "../hooks/useMenus";

const months = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SETIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
const week = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];

function dateToDay(date) {
    const a = date.split("-");
    return new Date(a[0], a[1] - 1, a[2]);
}

const CreatableWithId = ({ contents, typeId, menu, setSaveMenu, saveContent, setIsModified }) => {
    const c = contents.get(typeId);
    const contentList = [...c.keys()].map(key => {
        const name = c.get(key);
        return {
            label: name,
            value: key,
        }
    });

    const ids = menu.contents.get(typeId);
    const value = ids ? ids.map(e => {
        return {
            label: c.get(e),
            value: e,
        }
    }) : []

    const handleChange = input => {
        setIsModified(true);
        const contents = menu.contents;

        let newContent;
        if (!isEmpty(input)) {
            newContent = new Map([...contents, [typeId, input.map(e => e.value)]])
        } else {
            const a = new Map([...contents])
            a.delete(typeId)
            newContent = a
        }
        setSaveMenu({
            ...menu,
            contents: newContent
        });
    };

    return (
        <Select
            isMulti
            isClearable
            onChange={handleChange}
            options={contentList}
            value={value}
        />
    )


}

const Menu = () => {
    const [saveMenu, setSaveMenu] = useState({});
    const { types, contents, menu, menus, domMenus, saveContent, savMenu, delMenu, setTypeEdition } = useMenus();
    const [isModified, setIsModified] = useState(false);
    const [alert, setAlert] = useState([null, undefined]);
    const [confirmated, setConfirmated] = useState(false)

    useEffect(() => {
        setIsModified(false);
        const id = [...domMenus.keys()].find(key => {
            const dom = domMenus.get(key);
            return (dom[0] == menu[0]) && (dom[1] == menu[1]) && (dom[2] == menu[2])
        });
        const contents = id ? menus.get(id) : new Map()
        setSaveMenu({
            id,
            menu,
            contents,
        })
    }, [menu]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsModified(false);
        savMenu(saveMenu).then((id) => {
            if (!saveMenu.id) {
                setSaveMenu({
                    ...saveMenu,
                    id
                })
                setAlert([3, "Menú agregado exitosamente"]);
            } else {
                setAlert([3, "Menú modificado exitosamente"]);
            }
        });
    };

    const handleReset = () => {
        setIsModified(false);
        delMenu(saveMenu.id);
        setSaveMenu({
            ...saveMenu,
            id: undefined,
            contents: new Map()
        })
        setAlert([3, "Menú eliminado exitosamente"]);
    }

    return (
        <article className="card">
            <form onSubmit={handleSubmit}>
                <div className="card__title">
                    <h3 className={isModified ? "modified" : null}>
                        {!isEmpty(saveMenu) && week[dateToDay(saveMenu.menu[0]).getDay()] + " " + saveMenu.menu[0].slice(-2)}
                    </h3>
                </div>
                <Comida />
                <div className="card__content">
                    {!isEmpty(saveMenu) && !isEmpty(contents) &&
                        (new Map([[1, [7]], [2, [2, 3, 4, 5]], [3, [8]]])).get(menu[2]).sort((a, b) => a - b).map(i => {
                            return (
                                <div key={i}>
                                    <h4 className="field__title">
                                        {types.get(i)?.toUpperCase() + ":"}
                                    </h4>
                                    <div className="field__content">
                                        <CreatableWithId contents={contents} typeId={i} menu={saveMenu} setSaveMenu={setSaveMenu} saveContent={saveContent} setIsModified={setIsModified} />
                                        <span className="open" onClick={() => {
                                            setTypeEdition(i);
                                        }}>
                                            <i className="fa-solid fa-plus"></i>
                                        </span>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="card__buttons">
                    {saveMenu.id ?
                        <>
                            <input type="submit" value="Guardar cambios" disabled={isEmpty(saveMenu.contents) || !isModified} />
                            <input type="reset" value={"Eliminar menú"} onClick={() => {
                                setConfirmated(true);
                            }} />
                            <Confirmar action={handleReset} open={confirmated} setOpen={setConfirmated} />
                        </>
                        :
                        <input type="submit" value="Agregar menú" disabled={isEmpty(saveMenu.contents)} />
                    }
                </div>
            </form>
            {alert[1] && <Alerta alert={alert} />}
        </article>
    )
}

export default Menu;
