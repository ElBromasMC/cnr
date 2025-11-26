import { useCallback } from "react";
import { createContext, useState, useEffect } from "react";
import clientAxios from "../../config/axios";
import useAuth from "../hooks/useAuth";

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

const MenusContext = createContext();

export const MenusProvider = ({children}) => {

    const { auth } = useAuth();

    const [meals, setMeals] = useState(new Map()); // [(id, name)]
    const [organizations, setOrganizations] = useState(new Map()); // [(id, name)]
    const [types, setTypes] = useState(new Map()); // [(id, name)]
    const [contents, setContents] = useState(new Map()); // [typeId, [(id, name)]]
    const [domMenus, setDomMenus] = useState(new Map()); // [(id, (date, organizationId, mealId))]
    const [menus, setMenus] = useState(new Map()); // [(id, [(typeId, [id])])]

    const [menu, setMenu] = useState([formatDate(new Date()), 1, 1]); // (date, organizationId, mealId)
    const [type, setType] = useState(null); // typeId

    const [alert, setAlert] = useState([undefined, null]); // (type, msg)

    const token = localStorage.getItem('token');
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    };
    
    useEffect(() => {
        const getData = async () => {
            if(!token) return;
            try {
                const data = async (path) => {
                    return (await clientAxios(path, config)).data;
                };

                const [mls0, os0, ts0, cs0, dms0, ms0] = await Promise.all([
                    "/menus/meals",
                    "/menus/organizations",
                    "/menus/types",
                    "/menus/contents",
                    "/menus/dom",
                    "/menus",
                ].map(data));

                const mls = new Map(mls0.map(i => [i.id, i.name]));
                const os = new Map(os0.map(i => [i.id, i.name]));
                const ts = new Map(ts0.map(i => [i.id, i.name]));
                const cs = new Map(cs0.map(i => [i.id, new Map(i.contents.map(e => [e.id, e.name]))]));
                const dms = new Map(dms0.map(i => [i.id, [i.date, i.organizationId, i.mealId]]));
                const ms = new Map(ms0.map(i => {
                    const contents = i.contents;
                    const keys = [...new Set(contents.map(e => e.typeId))];
                    return [i.id, new Map(keys.map(e => {
                        const ctn = contents.filter(o => e == o.typeId).map(o => o.id)
                        return [e, ctn]
                    }))]
                }));

                setMeals(mls);
                setOrganizations(os);
                setTypes(ts);
                setContents(cs);
                setDomMenus(dms);
                setMenus(ms);

            } catch (e) {
                console.log(e);
            }
        } 
        getData();
    }, [auth]);

    const setEdition = (menu) => {
        setMenu(menu);
    }

    const setTypeEdition = (typeId) => {
        setType(typeId);
    }

    const setMeal = (id) => {
        setMenu([menu[0], menu[1], id]);
    }

    const saveContent = async (content) => {
        try {
            const { data } = await clientAxios.post('/menus/contents', content, config);
            const cnt = new Map([...(contents.get(data.typeId)), [data.id, data.name]]);
            const contentsUpdated = new Map([...contents, [data.typeId, cnt]]);
            setContents(contentsUpdated);
            return data.id;
        } catch (error) {
            console.log(error);
        }
    }

    const updateContent = async (content) => {
        try {
            const { data } = await clientAxios.put(`/menus/contents/${content.id}`, {name: content.name}, config);
            const cnt = new Map([...(contents.get(data.typeId)), [data.id, data.name]]);
            const contentsUpdated = new Map([...contents, [data.typeId, cnt]]);
            setContents(contentsUpdated);
            return data.id;
        } catch (error) {
            console.log(error);
        }
    }

    const savMenu = async (menu) => {
        if (menu.id) {
            try {
                const cnt = menu.contents;
                const contents = [...(cnt.keys())].flatMap(key => {
                    return cnt.get(key).map(e => {
                        return {
                            id: e,
                            typeId: key
                        }
                    });
                });
                const { data } = await clientAxios.put(`/menus/${menu.id}`, {
                    contents
                }, config);

                const newContents = data.contents
                const keys = [...new Set(newContents.map(e => e.typeId))];
                const menusUpdated = new Map([...menus, [data.id, new Map(keys.map(e => {
                    const ctn = newContents.filter(o => e == o.typeId).map(o => o.id)
                    return [e, ctn]
                }))]])
                setMenus(menusUpdated);
                return data.id;
            } catch (error) {
                console.log(error);
            }
        } else {
            try {
                const cnt = menu.contents;
                const contents = [...(cnt.keys())].flatMap(key => {
                    return cnt.get(key).map(e => {
                        return {
                            id: e,
                            typeId: key
                        }
                    });
                });
                const { data } = await clientAxios.post('/menus', {
                    date: menu.menu[0],
                    organizationId: menu.menu[1],
                    mealId: menu.menu[2],
                    contents
                }, config);

                const newContents = data.contents
                const keys = [...new Set(newContents.map(e => e.typeId))];
                const menusUpdated = new Map([...menus, [data.id, new Map(keys.map(e => {
                    const ctn = newContents.filter(o => e == o.typeId).map(o => o.id)
                    return [e, ctn]
                }))]])

                const domMenusUpdated = new Map([...domMenus, [data.id, [data.date, data.organizationId, data.mealId]]]);
                setMenus(menusUpdated);
                setDomMenus(domMenusUpdated);
                return data.id;
            } catch (error) {
                console.log(error);
            }
        }
    }

    const delMenu = async (id) => {
        try {
            await clientAxios.delete(`/menus/${id}`, config);
            const a = new Map([...menus]);
            a.delete(id);
            setMenus(a);
            
            const b = new Map([...domMenus]);
            b.delete(id);
            setDomMenus(b);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <MenusContext.Provider
            value={{
                meals,
                organizations,
                types,
                contents,
                domMenus,
                menus,
                menu,
                type,
                alert,
                setEdition,
                setTypeEdition,
                setMeal,
                saveContent,
                updateContent,
                savMenu,              
                delMenu,
                setAlert,
            }}
        >
            {children}
        </MenusContext.Provider>
    )
}

export default MenusContext;
