const express = require("express");
const multer = require("multer");
const app = express();
const path = require("path")
const { db, genid } = require("./db/DbUtils");
const port = 8080;

// CORS設定
app.use(function (req, res, next) {
    //クロスオリジンリクエストを許可するドメインを設定する、* は任意のドメインのクロスオリジンリクエストを許可することを意味する
    res.header("Access-Control-Allow-Origin", "*");
    //許可されたヘッダータイプ
    res.header("Access-Control-Allow-Headers", "*");
    //クロスオリジンで許可されるリクエストメソッド
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method == "OPTIONS") {
      res.sendStatus(200);
    } else {
      next();
    }
  });

// MiddleWare
/**
 *express.json は、Express.js が提供する組み込みミドルウェアであり、受信したリクエストの JSON 形式データを解析するために使用されます。
 *解析されたデータは req.body に格納され、リクエストを処理する際に開発者が簡単にアクセスして利用できるようになります。
 */
app.use(express.json());

/**
 * multer は、Node.js におけるミドルウェアであり、multipart/form-data タイプのリクエストデータを処理するために特化しています。
 * 主にファイルアップロードに使用され、Express.js と一緒に利用することで、開発者が簡単にファイルアップロードを実現できるようになります。
 */
const update = multer({
    dest: "public/upload/temp"
})
app.use(update.any());  // update.any() は、特定のファイルタイプに制限されることなく、任意のタイプのファイルを受け入れることを意味する

/**
 * トークンを検証するためのカスタムミドルウェア
 */
const ADMIN_TOKEN_PATH = "/_token"
app.all("*", async(req, res, next) => {
  if(req.path.indexOf(ADMIN_TOKEN_PATH) > -1) {
    let {token} = req.headers;

    let admin_token_sql = "SELECT * FROM `admin` WHERE `token` = ?"
    let adminResult = await db.async.all(admin_token_sql, [token])
    if(adminResult.err != null || adminResult.rows.length == 0){
      res.send({
        code: 403,
        msg: "先にログインしてください"
      })
      return;  // 検証に失敗した場合、後続の処理を中止します
    }
    else{
      next()  // 検証に成功した場合、次のミドルウェアを実行します
    }
  }
  else{
    next()    // 検証が不要なパスは、そのまま通過します
  }
})

/**
 * ミドルウェア:静的リソースのパスを指定する
 */
app.use(express.static(path.join(__dirname, "public")))

// 登録ルート
app.use("/test", require("./routers/TestRouter"));
app.use("/admin", require("./routers/AdminRouter"))
app.use("/category", require("./routers/CategoryRouter"))
app.use("/blog", require("./routers/BlogRouter"))
app.use("/upload", require("./routers/UploadRouter"))

// テスト用
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
