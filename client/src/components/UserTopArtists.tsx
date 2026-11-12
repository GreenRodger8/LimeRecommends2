import { useEffect, useState } from 'react';
import { ArtistObject } from '../util/spotifyTypes';

function ArtistCard({ artist }: { artist: ArtistObject }) {
    return (
        <>
            <ul>
                <li>
                    <a id="url" href={artist.external_urls.spotify}>
                        {artist.external_urls.spotify}
                    </a>
                </li>
                {artist.images?.map((image) => (
                    <li>
                        <img src={image.url}></img>
                    </li>
                ))}
                <li>{artist.name}</li>
                <li>
                    <a id="url" href={artist.uri}>
                        {artist.uri}
                    </a>
                </li>
            </ul>
        </>
    );
}

export function UserTopArtists({ token }: { token: string }) {
    const [artistList, setArtistList] = useState<ArtistObject[] | null>(null);

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
                    {artistList.map((artist: ArtistObject) => (
                        <ArtistCard artist={artist} />
                    ))}
                </>
            ) : (
                <>Loading artists...</>
            )}
        </>
    );
}
