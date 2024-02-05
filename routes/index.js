const router = require("express").Router()
const Todo = require("../models/Todo")

// routers will be here...
router.get("/", checkAuthenticated, async(req, res) => {
    const allTodo = await Todo.find();
    res.render("index", {todo: allTodo, user: req.user})
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect("/login")
}

module.exports = router;