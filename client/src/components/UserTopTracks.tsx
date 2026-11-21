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

export function UserTopTracks({ trackList }: { trackList: TrackObject[] }) {
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
