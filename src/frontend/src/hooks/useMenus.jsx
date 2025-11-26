import { useContext } from "react";
import MenusContext from "../context/MenusProvider";

const useMenus = () => {
    return useContext(MenusContext);
};

export default useMenus;
