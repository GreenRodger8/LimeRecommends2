import { useCallback, useEffect, useState } from 'react';
import { AddItemForm } from './AddNewItemForm';
import { ItemDisplay } from './ItemDisplay';
import PropTypes from 'prop-types';

function TrackCard({ link, image, name, uri }) {
    return (
        <>
            <ul>
                <li>
                    <a id="url" href={link}>
                        {link}
                    </a>
                </li>
                <li>
                    <img src={image.url}></img>
                </li>
                <li>{name}</li>
                <li>
                    <a id="url" href={uri}>
                        {uri}
                    </a>
                </li>
            </ul>
        </>
    );
}

TrackCard.propTypes = {
    link: PropTypes.string,
    image: PropTypes.string,
    name: PropTypes.string,
    uri: PropTypes.string,
};

export function UserTopTracks({ token }) {
    const [trackList, setTrackList] = useState(null);

    useEffect(() => {
        if (token && !trackList) {
            fetch(
                'https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50',
                {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                },
            )
                .then((r) => r.json())
                .then((res) => {
                    setTrackList(res.items);
                });
        }
    }, [token]);

    //if (items === null) return 'Loading...';

    return (
        <>
            {trackList ? (
                <>
                    {trackList.map((track) => (
                        <TrackCard
                            link={track.external_urls.spotify}
                            image={track.album.images[0]}
                            name={track.name}
                            uri={track.uri}
                        />
                    ))}
                </>
            ) : (
                <>Loading artists...</>
            )}
        </>
    );
}

UserTopTracks.propTypes = {
    token: PropTypes.string,
};
