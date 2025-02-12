const express = require("express");
const router = express.Router();
const { db, genid } = require("../db/DbUtils");

// CategoryList API
// CategoryDelete API
// CategoryEdit API
// CategoryAdd API

// CategoryList API
router.get("/list", async(req, res) => {
    const search_sql = "SELECT * FROM `category`"
    let {err, rows} = await db.async.all(search_sql, [])

    if(err == null){
        res.send({
            code: 200,
            msg: "SUCCESS",
            rows
        })
    }
    else{
        res.send({
            code: 500,
            msg: "ERROR",
            rows
        })
    }
})

// CategoryDelete API
router.delete("/_token/delete", async (req, res) => {
    let id = req.query.id;
    const delete_sql = "DELETE FROM `category` WHERE `id` = ?"
    let {err, rows} = await db.async.run(delete_sql, [id])

    if(err == null){
        res.send({
            code: 200,
            msg: "SUCCESS"
        })
    }
    else{
        res.send({
            code: 500,
            msg: "ERROR"
        })
    }
});

// CategoryEdit API
router.put("/_token/update", async (req, res) => {
    let {id, name} = req.body;
    const update_sql = "UPDATE `category` SET `name` = ? WHERE `id` = ?"
    let {err, rows} = await db.async.run(update_sql, [name, id])

    if(err == null){
        res.send({
            code: 200,
            msg: "SUCCESS"
        })
    }
    else{
        res.send({
            code: 500,
            msg: "ERROR"
        })
    }
});

// CategoryAdd API
router.post("/_token/add", async (req, res) => {
    let {name} = req.body;
    const insert_sql = "INSERT INTO `category` (`id`, `name`) VALUES (?, ?)"
    let {err, rows} = await db.async.run(insert_sql, [genid.NextId(), name])

    if(err == null){
        res.send({
            code: 200,
            msg: "SUCCESS"
        })
    }
    else{
        res.send({
            code: 500,
            msg: "ERROR"
        })
    }

});

module.exports = router;
