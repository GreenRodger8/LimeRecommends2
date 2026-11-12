import { useEffect, useState } from 'react';
import { TrackObject } from '../util/spotifyTypes';

function TrackCard({ track }: { track: TrackObject }) {
    return (
        <>
            <ul>
                <li>
                    <a id="url" href={track.href}>
                        {track.href}
                    </a>
                </li>
                <li>
                    <img src={track.album.images[0].url}></img>
                </li>
                <li>{track.name}</li>
                <li>
                    <a id="url" href={track.uri}>
                        {track.uri}
                    </a>
                </li>
            </ul>
        </>
    );
}

export function UserTopTracks({ token }: { token: string }) {
    const [trackList, setTrackList] = useState<TrackObject[] | null>(null);

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
                        <TrackCard track={track} />
                    ))}
                </>
            ) : (
                <>Loading artists...</>
            )}
        </>
    );
}
