const express = require("express");
const multer = require("multer");
const app = express();
const port = 8080;

//CORS設定
app.use(function (req, res, next) {
    //クロスオリジンリクエストを許可するドメインを設定する、* は任意のドメインのクロスオリジンリクエストを許可することを意味する
    res.header("Access-Control-Allow-Origin", "*");
    //許可されたヘッダータイプ
    res.header("Access-Control-Allow-Headers", "*");
    //クロスオリジンで許可されるリクエストメソッド
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE. OPTIONS");
    if (req.method == "OPTIONS") {
      return res.status(200);
    } else {
      next();
    }
  });

//MiddleWare
app.use(express.json());

const update = multer({
    dest: "public/upload/temp"
})
// update.any() は、特定のファイルタイプに制限されることなく、任意のタイプのファイルを受け入れることを意味する
app.use(update.any());  

// 登録ルート
app.use("/test", require("./routers/TestRouter"));
app.use("/admin", require("./routers/AdminRouter"))

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
