// Web server and DB drivers
const express = require('express');
const sqlite = require('sqlite');

// Utils
const Promise = require('bluebird');
const fs = require('fs');

// Application models & configuration
const config = require('./config');
const { FriendListAPIException } = require('./apiModels');

// Configure the web server
const app = express();
app.use(express.static(config.staticDir));

// Setup the database
initDatabase(getDb());

function getDb() {
  return sqlite.open(config.databaseLocation, { Promise });
}

/**
* @param dbPromise Resolves with a reference to a SQLite database
*/
async function initDatabase(dbPromise) {
  try {
    // Create the friend list table if it doesn't exist
    const createSQL = fs.readFileSync(config.initSQLiteFile, 'utf8');
    const db = await dbPromise;
    const result = await db.run(createSQL);

    return Promise.resolve('Database initialized');

  } catch (err) {
    throw new FriendListAPIException(`Error creating SQL friend_list table.
      Nested exception: `, err);
  }
}

async function runSQLStatement(dbPromise, sql) {
  const response = {
    error: false,
    data: null
  };

  try {
    const db = await dbPromise;
    response.data = await db.all(sql);

  } catch (err) {
    response.error = true;
    console.log(err);
    throw new FriendListAPIException(`Problem executing SQL
      statement. Nested exception: `, err);
  } finally {
    return Promise.resolve(response);
  }
}

app.put('/friend/:id/lastCatchUpTime', async function(req, res) {
  const now = new Date().getTime();
  const id = parseInt(req.params.id);
  const sql = `UPDATE friend_list SET lastCatchUpTime=${now} WHERE id=${id}`

  const response = await runSQLStatement(getDb(), sql);
  res.send(response);
});

app.get('/friend-list', async function(req, res) {
  const response = await runSQLStatement(getDb(), 'SELECT * FROM friend_list');
  res.send(response);
});

console.log(`Listening on ${config.port}`);
app.listen(config.port);
