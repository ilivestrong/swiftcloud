
const SongsController = ({
    Query: async function (db, sql, val) {
        return new Promise((resolve, reject) => {
            try {
                db.all(sql, val, (err, rows) => {
                    if (err) {
                        reject(err)
                    }

                    if (rows == undefined || rows == null || rows.length == 0) {
                        resolve(null)
                        return
                    }

                    return resolve(rows);
                });
            }
            catch (error) {
                reject(error)
            }
        })
    }
});

module.exports = { SongsController }