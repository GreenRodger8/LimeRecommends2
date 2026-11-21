const waitPort = require('wait-port');
const fs = require('fs');
const mysql = require('mysql2');

const {
    MYSQL_HOST: HOST,
    MYSQL_HOST_FILE: HOST_FILE,
    MYSQL_USER: USER,
    MYSQL_USER_FILE: USER_FILE,
    MYSQL_PASSWORD: PASSWORD,
    MYSQL_PASSWORD_FILE: PASSWORD_FILE,
    MYSQL_DB: DB,
    MYSQL_DB_FILE: DB_FILE,
} = process.env;

let pool;

async function init() {
    const host = HOST_FILE ? fs.readFileSync(HOST_FILE) : HOST;
    const user = USER_FILE ? fs.readFileSync(USER_FILE) : USER;
    const password = PASSWORD_FILE ? fs.readFileSync(PASSWORD_FILE) : PASSWORD;
    const database = DB_FILE ? fs.readFileSync(DB_FILE) : DB;

    await waitPort({
        host,
        port: 3306,
        timeout: 10000,
        waitForDns: true,
    });

    pool = mysql.createPool({
        connectionLimit: 5,
        host,
        user,
        password,
        database,
        charset: 'utf8mb4',
    });

    const users = new Promise((acc, rej) => {
        pool.query(
            'CREATE TABLE IF NOT EXISTS users (' +
                'user_id varchar(36), ' + // account_id in Spotify documentation
                'display_name varchar(255), ' +
                'external_urls varchar(255), ' +
                'img_url varchar(255), ' +
                'uri varchar(36))',
            (err) => {
                if (err) return rej(err);

                console.log('users table exists');
                acc();
            },
        );
    });

    const artists = new Promise((acc, rej) => {
        pool.query(
            'CREATE TABLE IF NOT EXISTS artists (' +
                'artist_id varchar(36), ' +
                'artist_name varchar(72), ' +
                'external_urls varchar(255), ' +
                'img_url varchar(255), ' +
                'uri varchar(36))',
            (err) => {
                if (err) return rej(err);

                console.log('artists table exists');
                acc();
            },
        );
    });

    const tracks = new Promise((acc, rej) => {
        pool.query(
            'CREATE TABLE IF NOT EXISTS tracks (' +
                'track_id varchar(36), ' +
                'track_name varchar(72), ' +
                'external_urls varchar(255), ' +
                'img_url varchar(255), ' +
                'uri varchar(36), ' +
                'explicit boolean)',
            (err) => {
                if (err) return rej(err);

                console.log('tracks table exists');
                acc();
            },
        );
    });

    const user_tracks = new Promise((acc, rej) => {
        pool.query(
            'CREATE TABLE IF NOT EXISTS user_tracks (' +
                'user_id varchar(36), ' +
                'track_id varchar(36))',
            (err) => {
                if (err) return rej(err);

                console.log('user_tracks table exists');
                acc();
            },
        );
    });

    const user_artists = new Promise((acc, rej) => {
        pool.query(
            'CREATE TABLE IF NOT EXISTS user_artists (' +
                'user_id varchar(36), ' +
                'artist_id varchar(36))',
            (err) => {
                if (err) return rej(err);

                console.log('user_artists table exists');
                acc();
            },
        );
    });

    return Promise.all([users, artists, tracks, user_tracks, user_artists]);
}

async function teardown() {
    return new Promise((acc, rej) => {
        pool.end((err) => {
            if (err) rej(err);
            else acc();
        });
    });
}

//

async function getAllUsers() {
    return new Promise((acc, rej) => {
        pool.query('SELECT * FROM users', (err, rows) => {
            if (err) return rej(err);
            acc(rows.map((item) => Object.assign({}, item)));
        });
    });
}

async function getUser(id) {
    return new Promise((acc, rej) => {
        pool.query('SELECT * FROM users WHERE user_id=?', [id], (err, rows) => {
            if (err) return rej(err);
            acc(rows.map((item) => Object.assign({}, item))[0]);
        });
    });
}

async function storeUser(user) {
    return new Promise((acc, rej) => {
        pool.query(
            'INSERT INTO users (user_id, display_name, external_urls, img_url, uri) VALUES (?, ?, ?, ?, ?)',
            [
                user.account_id,
                user.display_name,
                user.external_urls.spotify,
                user.images[0].url,
                user.uri,
            ],
            (err) => {
                if (err) return rej(err);
                acc();
            },
        );
    });
}

async function getArtist(id) {
    return new Promise((acc, rej) => {
        pool.query(
            'SELECT * FROM artists WHERE artist_id=?',
            [id],
            (err, rows) => {
                if (err) return rej(err);
                acc(rows.map((item) => Object.assign({}, item))[0]);
            },
        );
    });
}

async function storeArtist(artist) {
    return new Promise((acc, rej) => {
        pool.query(
            'INSERT INTO artists (artist_id, artist_name, external_urls, img_url, uri) VALUES (?, ?, ?, ?, ?)',
            [
                artist.id,
                artist.name,
                artist.external_urls.spotify,
                artist.images[0].url,
                artist.uri,
            ],
            (err) => {
                if (err) return rej(err);
                acc();
            },
        );
    });
}

async function storeArtists(artists) {
    let valuesString = artists
        .map((artist) => {
            return (
                '(' +
                [
                    artist.id,
                    artist.name,
                    artist.external_urls.spotify,
                    artist.images[0].url,
                    artist.uri,
                ].join(', ') +
                ')'
            );
        })
        .join(', ');

    return new Promise((acc, rej) => {
        pool.query(
            `INSERT INTO artists (artist_id, artist_name, external_urls, img_url, uri) VALUES ${valuesString}`,
            (err) => {
                if (err) return rej(err);
                acc();
            },
        );
    });
}

async function storeTracks(tracks) {
    let valuesString = tracks
        .map((track) => {
            return (
                '(' +
                [
                    track.id,
                    track.name,
                    track.external_urls.spotify,
                    track.images[0].url,
                    track.uri,
                    track.explicit,
                ].join(', ') +
                ')'
            );
        })
        .join(', ');

    return new Promise((acc, rej) => {
        pool.query(
            `INSERT INTO tracks (track_id, track_name, external_urls, img_url, uri, explicit) VALUES ${valuesString}`,
            (err) => {
                if (err) return rej(err);
                acc();
            },
        );
    });
}

async function storeUserTracks(user, tracks) {
    let valuesString = tracks
        .map((track) => {
            return '(' + [user.account_id, track.id].join(', ') + ')';
        })
        .join(', ');

    return new Promise((acc, rej) => {
        pool.query(
            `INSERT INTO user_tracks (user_id, track_id) VALUES ${valuesString}`,
            (err) => {
                if (err) return rej(err);
                acc();
            },
        );
    });
}

async function getUserTracks(user) {
    pool.query(
        'SELECT * FROM user_tracks INNER JOIN tracks ON user_tracks.track_id = tracks.track_id WHERE user_id=?',
        [user.account_id],
        (err, rows) => {
            if (err) return rej(err);
            acc(rows.map((item) => Object.assign({}, item)));
        },
    );
}

async function storeUserArtists(user, artists) {
    let valuesString = artists
        .map((artist) => {
            return '(' + [user.account_id, artist.id].join(', ') + ')';
        })
        .join(', ');

    return new Promise((acc, rej) => {
        pool.query(
            `INSERT INTO user_artists (user_id, artist_id) VALUES ${valuesString}`,
            (err) => {
                if (err) return rej(err);
                acc();
            },
        );
    });
}

async function getUserArtists(user) {
    pool.query(
        'SELECT * FROM user_artists INNER JOIN artists ON user_artists.artist_id = artists.artist_id WHERE user_id=?',
        [user.account_id],
        (err, rows) => {
            if (err) return rej(err);
            acc(rows.map((item) => Object.assign({}, item)));
        },
    );
}

//

module.exports = {
    init,
    teardown,
    getAllUsers,
    getUser,
    storeUser,
    getArtist,
    storeArtist,
    storeArtists,
    storeTracks,
    storeUserTracks,
    getUserTracks,
    storeUserArtists,
    getUserArtists,
};
