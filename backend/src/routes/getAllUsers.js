const db = require('../persistence');

module.exports = async (req, res) => {
    const item = await db.getAllUsers();
    res.send(item);
};
