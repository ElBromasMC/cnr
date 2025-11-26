import express from "express";
import {
    addTestimonial,
    getTestimonials,
    getTestimonial
} from "../controllers/testimonialController.js";
import checkAuth from "../middleware/authMiddleware.js";
import checkAdmin from "../middleware/adminMiddleware.js";

const router = express.Router();

router
    .route("/")
    .post(addTestimonial)

router
    .route("/get/:year/:month/:organizationId")
    .get(checkAuth, checkAdmin, getTestimonials)

router
    .route("/:year/:month/:organizationId")
    .get(checkAuth, checkAdmin, getTestimonial);



export default router;
