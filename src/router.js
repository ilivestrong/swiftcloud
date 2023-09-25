const { Router } = require("express");
const bodyParser = require("body-parser")

const { SongsController } = require("./controllers/songs.js");
const { db, getParameterizedSQLWithParams }= require("./data/db.js")

const router = Router();
router.use(bodyParser.json());

router.post("/songs", async (req, res) => {
    try {
        const { sql, values } = getParameterizedSQLWithParams(req)
        const result = await SongsController.Query(db, sql, values);
        if (result == null) {
            return res.status(404).send({
                message: "No result found with your search criteria."
            });
        }
        res.json({ data: result });
    } catch (err) {
        return res.status(500).send({
            message: "There was an error processing your request."
        });
    }
});

module.exports = router;
