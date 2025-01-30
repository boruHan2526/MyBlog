const express = require("express");
const router = express.Router();
const { db, genid } = require("../db/DbUtils");

// BlogList API
// BlogDelete API
// BlogEdit API
// BlogAdd API

// BlogList API
router.get("/list", async(req, res) => {
    /**
     * フロントエンドから渡される必要があるパラメータ:
     * keyword 
     * categoryId
     * 
     * ページネーション:
     * page
     * pageSize
     * 
     */
    let {keyword, categoryId, page, pageSize} = req.query

    page = page == null ? 1 : page;
    pageSize = pageSize == null ? 10 : pageSize;
    categoryId = categoryId == null ? 0 : categoryId;
    keyword = keyword == null ? "" : keyword;

    let params = []
    let whereSqls = []
    if(categoryId != 0){
        whereSqls.push(" `category_id` = ? ")
        params.push(categoryId)
    }

    if(keyword != ""){
        whereSqls.push(" `title` LIKE ? OR `content` LIKE ? ")
        params.push("%" + keyword + "%")
        params.push("%" + keyword + "%")
    }

    let whereSqlStr = ""
    if(whereSqls.length > 0){
        whereSqlStr = " WHERE " + whereSqls.join(" AND ")
    }

    // ページネーションデータを取得する
    let searchSql = " SELECT * FROM `blog` " + whereSqlStr + " ORDER BY `create_time` DESC LIMIT ?,? "
    // 1,10 2,10    3,5
    // 0,10 10,10   10,5
    let searchSqlParams = params.concat([(page - 1) * pageSize, pageSize])

    // データの総数を取得する
    let searchCountSql = " SELECT count(*) AS `count` FROM `blog` " + whereSqlStr
    let searchCountParams = params

    // ページネーションデータ
    let searchResult = await db.async.all(searchSql, searchSqlParams)
    let countResult = await db.async.all(searchCountSql, searchCountParams)

    console.log(countResult)

    if(searchResult.err == null && countResult.err == null){
        res.send({
            code: 200,
            msg: "查询成功",
            data: {
                keyword,
                categoryId,
                page,
                pageSize,
                rows: searchResult.rows,
                count: countResult.rows[0].count
            }
        })
    }
    else{
        res.send({
            code: 500,
            msg: "查询失败"
        })
    }


})

// BlogDelete API
router.delete("/_token/delete", async (req, res) => {
    let id = req.query.id;
    const delete_sql = "DELETE FROM `blog` WHERE `id` = ?"
    let {err, rows} = await db.async.run(delete_sql, [id])

    if(err == null){
        res.send({
            code: 200,
            msg: "删除成功"
        })
    }
    else{
        res.send({
            code: 500,
            msg: "删除失败"
        })
    }
});

// BlogEdit API
router.put("/_token/update", async (req, res) => {
    let {id, category_id, title, content} = req.body;
    let create_time = new Date().getTime();
    const update_sql = "UPDATE `blog` SET `category_id` = ?, `title` = ?, `content` = ?, `create_time` = ? WHERE `id` = ?"
    let {err, rows} = await db.async.run(update_sql, [category_id, title, content, create_time, id])

    if(err == null){
        res.send({
            code: 200,
            msg: "修改成功"
        })
    }
    else{
        res.send({
            code: 500,
            msg: "修改失败"
        })
    }
});

// BlogAdd API
router.post("/_token/add", async (req, res) => {
    let {category_id, title, content} = req.body;
    let create_time = new Date().getTime();
    const insert_sql = "INSERT INTO `blog` (`id`, `category_id`, `title`, `content`, `create_time`) VALUES (?, ?, ?, ?, ?)"
    let {err, rows} = await db.async.run(insert_sql, [genid.NextId(), category_id, title, content, create_time])

    if(err == null){
        res.send({
            code: 200,
            msg: "添加成功"
        })
    }
    else{
        res.send({
            code: 500,
            msg: "添加失败"
        })
    }
});

module.exports = router;
