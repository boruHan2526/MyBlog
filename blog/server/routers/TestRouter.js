const express = require("express");
const router = express.Router();
const { db, genid } = require("../db/DbUtils");

router.get("/test", (req, res) => {
  db.all("select * from `admin`", [], (err, rows) => {
    console.log(rows);
  });

  res.send({
    id: genid.NextId(),
  });
});

module.exports = router;
