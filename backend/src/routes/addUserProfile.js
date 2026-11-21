const db = require('../persistence');
const { v4: uuid } = require('uuid');

module.exports = async (req, res) => {
    await db.storeUser(req.body.user);
    await db.storeArtists(req.body.artists);
    await db.storeTracks(req.body.tracks);
    await db.storeUserArtists(req.body.user, req.body.artists);
    await db.storeUserTracks(req.body.user, req.body.tracks);

    res.send();
};
