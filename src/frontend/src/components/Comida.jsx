import { useState, useEffect } from "react";

import useMenus from "../hooks/useMenus";

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const Comida = () => {
    const { menu, meals, setMeal } = useMenus();

    return (
        <div className="meal">
            {[...meals.keys()].sort((a,b) => a-b).map(key => {
                return (
                    <a className={ key === menu[2] ? "clicked" : null } key={key} onClick={() => {
                        setMeal(key);
                    }}>
                        { capitalizeFirstLetter(meals.get(key)) }
                    </a>
                )
            })}            
        </div>
    )
}

export default Comida;
