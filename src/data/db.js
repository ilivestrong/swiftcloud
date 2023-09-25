// import process from "process"
// import path from "path"
// import sqlite3 from 'sqlite3';

const process = require("process");
const path = require("path");
const sqlite3 = require('sqlite3');

const csvFilePath = path.join(process.cwd(), "src/data", "swiftcloud.db");
const db = new sqlite3.Database(csvFilePath);

function getParameterizedSQLWithParams(req) {
    const values = [];
    let whereClauses = [];
    let operationClause = "";
    let orderClause = "";
    let selectClause = "*";

    const {
        song,
        year,
        album,
        month, month2,
        artist, compareArtist,
        operation,
        sortBy, order,
        limit, offset,
        playsOver
    } = req.body;

    if (artist && operation != "compareArtists") {
        whereClauses.push(`artist = $${values.length + 1}`);
        values.push(artist);
    }

    if (song) {
        whereClauses.push(`song = $${values.length + 1}`);
        values.push(song);
    }

    if (year) {
        whereClauses.push(`year = $${values.length + 1}`);
        values.push(year);
    }

    if (album) {
        whereClauses.push(`album = $${values.length + 1}`);
        values.push(album);
    }

    switch (operation) {
        case "overallPlays":
            selectClause = `song, (CAST("Plays-June" AS INTEGER) + CAST("Plays-July" AS INTEGER) + CAST("Plays-August" AS INTEGER)) as total_plays`; // currently support June/July/August
            break;
        case "monthlyPlays":
            selectClause = `song, CAST("Plays-${month}" as INTEGER) as monthly_plays`;
            break;
        case "averagePlays":
            selectClause = `CAST(AVG("Plays-${month}") AS INTEGER) as average_plays`;
            break;
        case "compareMonths":
            selectClause = `song, CAST("Plays-${month}" AS INTEGER) as ${month}_plays, CAST("Plays-${month2}" AS INTEGER) as ${month2}_plays`;
            break;
        case "compareArtists":
            selectClause = `artist, SUM("Plays-June" + "Plays-July" + "Plays-August") as total_plays`; // currently support June/July/August
            whereClauses.push(`(artist = $${values.length + 1} OR artist = $${values.length + 2})`);
            values.push(artist, compareArtist);
            operationClause = `GROUP BY artist`;
            break;
        case "mostPopularByMonth":
            selectClause = `song, album,artist,writer,  CAST("Plays-${month}" AS INTEGER) as monthly_plays`;
            operationClause = `ORDER BY "Plays-${month}" DESC LIMIT 1`;
            break;
        case "mostPopularOverall":
            selectClause = `song, album,artist,writer, ("Plays-June" + "Plays-July" + "Plays-August") as total_plays`; // currently support June/July/August
            operationClause = `ORDER BY total_plays DESC LIMIT 1`;
            break;
        case "playsOverByMonth":
            whereClauses.push(`CAST("Plays-${month}" AS INTEGER) > ${playsOver}`);
            break;
        case "playsOverByOverall":
            whereClauses.push(`(CAST("Plays-June" AS INTEGER) + CAST("Plays-July" AS INTEGER) + CAST("Plays-August" AS INTEGER)) > ${playsOver}`);
            break;
    }

    if (sortBy) {
        orderClause = `ORDER BY [${sortBy}] ${order || 'ASC'}`;
    }

    // Pagination
    if (limit) {
        operationClause += ` LIMIT $${values.length + 1}`;
        values.push(parseInt(limit));
    }
    if (offset) {
        operationClause += ` OFFSET $${values.length + 1}`;
        values.push(parseInt(offset));
    }

    let sql = `SELECT ${selectClause} FROM songs`;

    if (whereClauses.length) {
        sql += " WHERE " + whereClauses.join(' AND ');
    }

    sql += " " + orderClause + " " + operationClause;
    console.log(sql, values)
    return { sql, values }
}

module.exports = { db, getParameterizedSQLWithParams};