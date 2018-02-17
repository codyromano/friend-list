const path = require('path');

module.exports = {
  port: 3030,
  staticDir: 'public',
  databaseLocation: path.join(__dirname, './data/friends.db'),
  initSQLiteFile: path.join(__dirname, './schemas/friend_list.sql')
};
