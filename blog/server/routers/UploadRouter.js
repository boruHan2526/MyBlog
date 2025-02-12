const express = require("express");
const router = express.Router();
const fs = require("fs")
const { db, genid } = require("../db/DbUtils");

router.post("/rich_editor_upload", async (req, res) => {
    if(!req.files){
        res.send({
            "errno": 1,
            "message": "ERROR MSG"
        })
    }

    let files = req.files;
    let ret_files = [];

    for(let file of files){
        //ファイル名の拡張子を取得する
        let file_ext = file.originalname.substring(file.originalname.lastIndexOf(".") + 1)
        //ランダムなファイル名
        let file_name = genid.NextId() + "." +file_ext

        //名前を変更してファイルを移動する
        fs.renameSync(process.cwd() + "/public/upload/temp/" + file.filename, process.cwd() + "/public/upload/" + file_name)
        ret_files.push("/upload/" + file_name)
    }

    res.send({
        "errno": 0,
        "data": {
            "url": ret_files[0]
        }
    })

});

module.exports = router;
