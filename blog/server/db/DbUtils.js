const sqlite3 = require('sqlite3').verbose();
const GenId = require('../utils/SnowFlake');
const path = require('path');

var db = new sqlite3.Database(path.join(__dirname, "blog.sqlite3"))
const genid = new GenId({WorkerId: 1});

// db オブジェクトに動的に async プロパティを追加し、それを空のオブジェクト {} で初期化します。
db.async = {}

/*この async オブジェクトにメソッドを追加します
（db.all のコールバック方式をラップし、Promise を返す方式にすることで、呼び出す際に async/await や .then/.catch を使って非同期結果を処理できるようにします）。*/

// db.all はクエリ操作に使用され、通常は SELECT 文を実行するために使用されます。このメソッドのコールバックは、クエリ結果を返します。
db.async.all = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            resolve({err, rows})
        })
    })
}

// db.run は挿入、更新、削除（INSERT、UPDATE、DELETE）などの操作を実行するために使用され、通常はデータ行を返さず、
// 操作の結果、例えば影響を受けた行数を返します。このメソッドは、結果セットを必要としない SQL 文を実行するのに適しています。
db.async.run = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, (err, rows) => {
            resolve({err, rows})
        })
    })
}

module.exports = {db, genid}