import { useEffect, useState } from 'react';
import { TrackObject } from '../util/spotifyTypes';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/esm/Col';

function TrackCard({ track }: { track: TrackObject }) {
    const albumType = matchAlbumType(track.album.album_type);

    function matchAlbumType(album: string) {
        switch (album) {
            case 'album':
                return 'Album';
            case 'single':
                return 'Single';
            case 'compilation':
                return 'Compilation';
            default:
                return 'ERROR';
        }
    }

    return (
        <Card>
            <Card.Img variant="top" src={track.album.images[0].url} />
            <Card.Body>
                <Card.Title>{track.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                    <div>
                        {track.artists.length > 1 ? 'Artists: ' : 'Artist: '}
                        {track.artists.map((artist) => artist.name).join(', ')}
                    </div>
                    <div>
                        {`${albumType}: `}
                        {track.album.name}
                    </div>
                </Card.Subtitle>
            </Card.Body>
        </Card>
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
        <Row xs={2} md={3} xxl={5}>
            {trackList ? (
                <>
                    {trackList.map((track, idx) => (
                        <Col key={idx}>
                            <TrackCard track={track} />
                        </Col>
                    ))}
                </>
            ) : (
                <Col>Loading artists...</Col>
            )}
        </Row>
    );
}
