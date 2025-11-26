import { Testimonial } from "../models/Testimonial.js";
import { Menu } from "../models/Menu.js";
import Sequelize from "sequelize";

const addTestimonial = async (req, res) => {
    const { rating, menuId } = req.body;

    // Check not null
    if (!rating){
        const error = new Error("Debe ingresar los siguientes campos: rating");
        return res.status(400).json({ msg: error.message });
    }

    if (!menuId){
        const error = new Error("El menú proporcionado no existe");
        return res.status(400).json({ msg: error.message });
    }
    
    try{
        // Save new testimonial
        const testimonial = new Testimonial(req.body, {
            fields: ["message", "rating", "menuId"]
        });
        await testimonial.save();
    } catch {
        const error = new Error("Error desconocido al guardar el testimonial");
        return res.status(400).json({ msg: error.message });
    }
    
    res.json({
        msg: "Testimonial enviado exitosamente"
    });
};

const getTestimonials = async (req, res) => {
    const { year, month, organizationId } = req.params;
    let testimonials;
    try{
        testimonials = await Testimonial.findAll({
            attributes: { exclude: ["menuId", "id"] },
            include: {
                model: Menu,
                where: {
                    [Sequelize.Op.and]: [
                        Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "menu"."date"')), month),
                        Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM "menu"."date"')), year),
                    ],
                    organizationId,
                },
                attributes: { exclude: ["id"] },
            },
        });
    } catch {
        const error = new Error("Error desconocido al obtener los testimoniales");
        return res.status(404).json({ msg: error.message });
    }
    res.json(testimonials);
};


/* Fix this */
const getTestimonial = async (req, res) => {
    const { year, month, organizationId } = req.params;

    let response
    try{
        response = await Promise.all([1,2,3].map(async mealId => {
            const testimonials = await Promise.all([1,2,3,4,5].map(async rating => {
                return await Testimonial.count({
                    include: {
                        model: Menu,
                        where: {
                            [Sequelize.Op.and]: [
                                Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "menu"."date"')), month),
                                Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM "menu"."date"')), year),
                            ],
                            organizationId,
                            mealId
                        },
                    },
                    where: {
                        rating
                    }
                });
            }))
            return {
                mealId,
                testimonials
            }
        }))

    } catch(e) {
        const error = new Error("Error desconocido al obtener el testimonial");
        console.log(e)
        return res.status(400).json({ msg: error.message });
    }

    res.json(response);
};

const getTestimonial0 = async (req, res) => {
    const { year, month, organizationId, mealId } = req.params;
    let testimonial;
    try{
        testimonial = await Testimonial.findAll({
            attributes: { exclude: ["menuId"] },
            include: {
                model: Menu,
                where: {
                    [Sequelize.Op.and]: [
                        Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "menu"."date"')), month),
                        Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM "menu"."date"')), year),
                    ],
                    organizationId,
                    mealId,
                },
                attributes: { exclude: ["id", "date", "organizationId", "mealId"] },
            }
        });
    } catch(e) {
        const error = new Error("Error desconocido al obtener el testimonial");
        console.log(e)
        return res.status(400).json({ msg: error.message });
    }

    res.json(testimonial);
};

export {
    addTestimonial,
    getTestimonials,
    getTestimonial
}