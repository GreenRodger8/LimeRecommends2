import { useCallback, useEffect, useState } from 'react';
import { AddItemForm } from './AddNewItemForm';
import { ItemDisplay } from './ItemDisplay';
import PropTypes from 'prop-types';

function ArtistCard({ link, images, name, uri }) {
    return (
        <>
            <ul>
                <li>
                    <a id="url" href={link}>
                        {link}
                    </a>
                </li>
                {images.map((image) => (
                    <li>
                        <img src={image.url}></img>
                    </li>
                ))}
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

ArtistCard.propTypes = {
    link: PropTypes.string,
    images: PropTypes.array,
    name: PropTypes.string,
    uri: PropTypes.string,
};

export function UserTopArtists({ token }) {
    const [artistList, setArtistList] = useState(null);

    useEffect(() => {
        if (token && !artistList) {
            fetch(
                'https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50',
                {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                },
            )
                .then((r) => r.json())
                .then((res) => {
                    setArtistList(res.items);
                });
        }
    }, [token]);

    //if (items === null) return 'Loading...';

    return (
        <>
            {artistList ? (
                <>
                    {artistList.map((artist) => (
                        <ArtistCard
                            link={artist.external_urls.spotify}
                            images={artist.images}
                            name={artist.name}
                            uri={artist.uri}
                        />
                    ))}
                </>
            ) : (
                <>Loading artists...</>
            )}
        </>
    );
}

UserTopArtists.propTypes = {
    token: PropTypes.string,
};
