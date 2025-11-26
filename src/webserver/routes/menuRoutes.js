import express from "express";
import {
    addMenu,
    getMenus,
    getMenu,
    getDomMenus,
    updateMenu,
    removeMenu,
    addContent,
    getContents,
    getContent,
    updateContent,
    removeContent,
    getTypes,
    getMeals,
    getOrganizations
} from "../controllers/menuController.js";
import checkAuth from "../middleware/authMiddleware.js";
import checkAdmin from "../middleware/adminMiddleware.js";

const router = express.Router();

// Organizations
router
    .route("/organizations")
    .get(getOrganizations);

// Meals
router
    .route("/meals")
    .get(getMeals);


// Types
router
    .route("/types")
    .get(getTypes);


// Contents
router
    .route("/contents")
    .post(checkAuth, checkAdmin, addContent)
    .get(checkAuth, checkAdmin, getContents);

router
    .route("/contents/:id")
    .get(getContent)
    .put(checkAuth, checkAdmin, updateContent)
    .delete(checkAuth, checkAdmin, removeContent);


// Menus
router
    .route("/")
    .post(checkAuth, checkAdmin, addMenu)
    .get(getMenus);


router
    .route("/:id")
    .put(checkAuth, checkAdmin, updateMenu)
    .delete(checkAuth, checkAdmin, removeMenu);

 router
    .route("/:date/:organizationId")
    .get(getMenu)

router
    .route("/dom")
    .get(getDomMenus)

export default router;
