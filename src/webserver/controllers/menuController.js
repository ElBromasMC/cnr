import { Menu } from "../models/Menu.js";
import { Content } from "../models/Content.js";
import { Type } from "../models/Type.js";
import { Meal } from "../models/Meal.js";
import { Organization } from "../models/Organization.js";
import { AsyncIO, Maybe, MaybeA, ListM } from "../helpers/AsyncIO.js";

// Menus
// Get menus by month and year
/*
const getMenusByMonth = async (req, res) => {
    const { month, year } = req.params;
    let menu;
    try{
        menu = await Menu.findAll({
            where: {
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM "menu"."date"')), year),
                    Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "menu"."date"')), month)
                ]
            },
            include: [
                {
                    model: Content,
                    attributes: {exclude: ["name"]},
                    through: {attributes: []},
                },
            ],
        });
    } catch {
        const error = new Error("Error desconocido al obtener los menús");
        return res.status(404).json({ msg: error.message });
    }
    res.json(menu);
};
*/
const getMenus = async (req, res) => {
    let menu;
    try {
        menu = await Menu.findAll({
            attributes: { exclude: ["date", "organizationId", "mealId"] },
            include: [
                {
                    model: Content,
                    attributes: { exclude: ["name"] },
                    through: { attributes: [] },
                },
            ],
        });
    } catch {
        const error = new Error("Error desconocido al obtener los menús");
        return res.status(404).json({ msg: error.message });
    }
    res.json(menu);
};

// Useful functions
const prop = str => obj => {
    const a = obj[str]
    return a !== undefined && a !== null ? Maybe.just(a) : Maybe.nothing()
}
const props = lst => obj => lst.map(x => prop(x)(obj))
const isNull = val => (val === null) || (val === undefined)


// Get menu
const getMenu = (req, res) => {
    const [date, organizationId] = props(["date", "organizationId"])(req.params)
    const abc = date => organizationId => AsyncIO.of(
        () => Menu.findAll({
            where: { date, organizationId },
            attributes: { exclude: ["date", "organizationId"] },
            include: [{ model: Content, attributes: { exclude: ["id"] }, through: { attributes: [] } }],
        })
    )
    const menu = Maybe.pure(abc)
        .ap(date)
        .ap(organizationId)
        .sequence()
        .fmap(Maybe.join)
        .toMaybeA()

    menu.fromPromise(x => res.json(x), () => res.status(400).json({ msg: "No encontrado" }))
}


// Get Dom
const getDomMenus = async (req, res) => {
    let menu;
    try {
        menu = await Menu.findAll({
            attributes: { exclude: [] },
        });
    } catch {
        const error = new Error("Error desconocido al obtener los menús");
        return res.status(400).json({ msg: error.message });
    }

    res.json(menu);

};

// Add menu
const addMenu = async (req, res) => {
    const { date, organizationId, mealId } = req.body;
    if (!date && !organizationId && !mealId) {
        const error = new Error("Debe ingresar los siguientes campos: date, organizationId, mealId");
        return res.status(400).json({ msg: error.message });
    }
    const menuExists = await Menu.findOne({ where: { date, organizationId, mealId, } });
    if (menuExists) {
        const error = new Error("Menú ya registrado");
        return res.status(400).json({ msg: error.message });
    }
    let menuSaved;
    try {
        const menu = new Menu(req.body, { fields: ["date", "organizationId", "mealId"] });
        menuSaved = await menu.save();
    } catch {
        const error = new Error("Error desconocido al registrar el menú");
        return res.status(400).json({ msg: error.message });
    }
    const { contents } = req.body;
    if (!contents) {
        const error = new Error("Debe ingresar los siguientes campos: menuContents");
        return res.status(400).json({ msg: error.message });
    }
    if (!Array.isArray(contents)) {
        const error = new Error("Formato inválido en menuContents");
        return res.status(400).json({ msg: error.message });
    }
    await Promise.all(contents.map(async (c) => {
        try {
            const content = await Content.findByPk(c.id);
            await menuSaved.addContent(content);
        } catch {
            const error = new Error(`Error desconocido al asociar el contenido ${c.id}`);
            return error;
        }
    }));
    let newMenu;
    try {
        newMenu = await Menu.findByPk(menuSaved.id, { include: [{ model: Content, attributes: { exclude: ["name"] }, through: { attributes: [] } }] });
    } catch {
        const error = new Error("Error desconocido al obtener el menú");
        return res.status(400).json({ msg: error.message });
    }
    return res.json(newMenu);
}

// const addMenu = (req, res) => {
//     const getMenuById = id => MaybeA.of(() => Menu.findByPk(id, {include: [{model: Content, attributes: {exclude: ["name"]}, through: {attributes: []}}]}))
//     const getMenu = date => organizationId => mealId => MaybeA.of(() => Menu.findOne({where: {date, organizationId, mealId}}))
//     const saveMenu = date => organizationId => mealId => MaybeA.of(() => {
//         const menu = new Menu({date, organizationId, mealId})
//         return menu.save()
//     })
//     const associateContent = id => menu => 
//         MaybeA.of(() => Content.findByPk(id)).chain(content =>
//         MaybeA.of(() => menu.addContent(content))
//         )

//     const [date, organizationId, mealId] = props(["date", "organizationId", "mealId"])(req.body)
//     const contents = prop("contents")(req.body).fmap(ListM.of)

//     const abc = 
//         Maybe.pure(getMenu).ap(date).ap(organizationId).ap(mealId).joinM().chain(menuExists =>
//         MaybeA.guard(isNull(menuExists)).concat(
//         Maybe.pure(saveMenu).ap(date).ap(organizationId).ap(mealId).joinM().chain(menuSaved =>
//         contents.fmap(ListM.fmap(e => associateContent(e.id)(menuSaved).runMaybeA())).fmap(ListM.sequence).sequence().toMaybeA().concat(
//         getMenuById(menuSaved.id)
//         ))))
//     abc.fromPromise(x => res.json(x), () => res.status(400).json({msg: "Error al agregar el menu"}))
// }

// Update menu
const updateMenu = async (req, res) => {
    const { id } = req.params;

    // Check if menu exists
    const menu = await Menu.findByPk(id);
    if (!menu) {
        const error = new Error("Menú no encontrado");
        return res.status(404).json({ msg: error.message });
    }

    // Menu contents
    const { contents } = req.body;
    // Check if not null
    if (!contents) {
        const error = new Error("Debe ingresar los siguientes campos: menuContents");
        return res.status(400).json({ msg: error.message });
    }
    if (!Array.isArray(contents)) {
        const error = new Error("Formato inválido en menuContents");
        return res.status(400).json({ msg: error.message });
    }

    await menu.setContents([])
    await Promise.all(contents.map(async (c) => {

        try {
            // Update menu
            const content = await Content.findByPk(c.id);

            // Asociate content
            await menu.addContent(content);
        } catch {
            const error = new Error(`Error desconocido al asociar el contenido ${c.id}`);
            return error;
        }

    }));

    let newMenu;

    try {
        newMenu = await Menu.findByPk(menu.id, {
            include: [
                {
                    model: Content,
                    attributes: { exclude: ["name"] },
                    through: { attributes: [] },
                }
            ],
        });
    } catch {
        const error = new Error("Error desconocido al actualizar el menú");
        return res.status(400).json({ msg: error.message });
    }

    return res.json(newMenu);
};

// Remove menu
const removeMenu = (req, res) => {
    const id = prop("id")(req.params)
    const e = id
        .fmap(id => AsyncIO.of(() => Menu.findByPk(id)))
        .sequence()
        .fmap(Maybe.join)
        .fmap(Maybe.chain(Maybe.of)) // Fix the null of findByPk
        .toMaybeA()
        .chain(menu => MaybeA.of(() => menu.destroy()))

    e.fromPromise(() => res.json({ msg: "Menú eliminado" }), () => res.status(400).json({ msg: "Error al eliminar el menú" }))
}

// Contents
// Get contents
const getContents = async (req, res) => {
    let content;
    try {
        content = await Type.findAll({
            attributes: { exclude: ["name"] },
            include: [
                {
                    model: Content,
                    attributes: { exclude: ["typeId"] },
                }
            ],
        });
    } catch {
        const error = new Error("Error desconocido al obtener los contenidos");
        return res.status(404).json({ msg: error.message });
    }
    res.json(content);
};

// Get content
const getContent = async (req, res) => {
    const { id } = req.params;
    let content;
    try {
        content = await Content.findByPk(id);
    } catch {
        const error = new Error("Error desconocido al obtener el contenido");
        return res.status(400).json({ msg: error.message });
    }
    if (!content) {
        const error = new Error("Contenido no encontrado");
        return res.status(404).json({ msg: error.message });
    }

    res.json(content);

};

// Add content
// const addContent = async (req, res) => {
//     const { typeId, name } = req.body;
//     // Check if not null
//     if (!typeId || !name){
//         const error = new Error("Debe ingresar los siguientes campos: typeId, name");
//         return res.status(400).json({ msg: error.message });
//     }

//     // Check if content exists
//     const contentExists = await Content.findOne({
//         where: {
//             typeId,
//             name
//         }
//     });
//     if (contentExists) {
//         const error = new Error("Contenido ya registrado");
//         return res.status(400).json({ msg: error.message });
//     }

//     let contentSaved;
//     try {
//         // Save new content
//         const content = new Content(req.body, {
//             fields: ["typeId", "name"]
//         });
//         contentSaved = await content.save();

//     } catch {
//         const error = new Error("Error desconocido al registrar el contenido");
//         return res.status(400).json({ msg: error.message });
//     }

//     let newContent;
//     try{
//         newContent = await Content.findByPk(contentSaved.id);
//     } catch {
//         const error = new Error("Error desconocido al obtener el contenido");
//         return res.status(400).json({ msg: error.message });
//     }

//     return res.json(newContent);
// }

const addContent = (req, res) => {
    const findContent = typeId => name => MaybeA.of(() => Content.findOne({ where: { typeId, name } }))
    const createContent = typeId => name => ((content = new Content({ typeId, name })) => MaybeA.of(() => content.save()))()
    const getContent = id => MaybeA.of(() => Content.findByPk(id))

    const [typeId, name] = props(["typeId", "name"])(req.body)
    const newContent =
        MaybeA.joinM(Maybe.pure(findContent).ap(typeId).ap(name)).chain(cnt =>
            MaybeA.guard(isNull(cnt)).concat(
                MaybeA.joinM(Maybe.pure(createContent).ap(typeId).ap(name)).chain(nCnt =>
                    MaybeA.joinM(Maybe.pure(getContent).ap(prop("id")(nCnt)))
                )))

    // const triangles = 
    //     ListM.range(1, 10).chain(c =>
    //     ListM.range(1, c).chain(b =>
    //     ListM.range(1, b).chain(a =>
    //     ListM.guard((a**2 + b**2) === c**2).concat(
    //     ListM.guard(a + b + c === 24).concat(
    //     ListM.pure([a, b, c])
    //     )))))
    //     .toList()

    newContent.fromPromise(x => res.json(x), () => res.status(400).json({ msg: "Error al agregar el contenido" }))
    // res.json(triangles)
}

// Update menu
const updateContent = async (req, res) => {
    const { id } = req.params;

    // Check if content exists
    const content = await Content.findByPk(id);
    if (!content) {
        const error = new Error("Contenido no encontrado");
        return res.status(404).json({ msg: error.message });
    }

    const { name } = req.body;
    content.name = name;

    await content.save();

    let newContent;
    try {
        newContent = await Content.findByPk(content.id);
    } catch {
        const error = new Error("Error desconocido al actualizar el contenido");
        return res.status(400).json({ msg: error.message });
    }

    return res.json(newContent);
};

// Remove content
const removeContent = async (req, res) => {

    const { id } = req.params;

    // Check if content exists
    const content = await Content.findByPk(id);
    if (!content) {
        const error = new Error("Contenido no encontrado");
        return res.status(404).json({ msg: error.message });
    }

    try {
        await content.destroy();
    } catch {
        const error = new Error("Error desconocido al eliminar el contenido");
        return res.status(400).json({ msg: error.message });
    }
    res.json({ msg: "Contenido eliminado" });
};



// Types
const getTypes = async (req, res) => {
    let type;
    try {
        type = await Type.findAll();
    } catch {
        const error = new Error("Error desconocido al obtener los tipos");
        return res.status(404).json({ msg: error.message });
    }
    res.json(type);
};

// Meals
const getMeals = async (req, res) => {
    let meal;
    try {
        meal = await Meal.findAll();
    } catch {
        const error = new Error("Error desconocido al obtener las comidas");
        return res.status(404).json({ msg: error.message });
    }
    res.json(meal);
};

// Organizations
const getOrganizations = async (req, res) => {
    let organization;
    try {
        organization = await Organization.findAll({
            attributes: { exclude: ["description", "createdAt", "updatedAt"] },
        });
    } catch {
        const error = new Error("Error desconocido al obtener las comidas");
        return res.status(404).json({ msg: error.message });
    }
    res.json(organization);
};


export {
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
}
