import { useEffect, useState } from 'react';
import { ArtistObject } from '../util/spotifyTypes';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/esm/Col';

function ArtistCard({ artist }: { artist: ArtistObject }) {
    return (
        <Card>
            <Card.Img
                variant="top"
                src={artist.images ? artist.images[0].url : ''}
            />
            <Card.Body>
                <Card.Title>{artist.name}</Card.Title>
            </Card.Body>
        </Card>
    );
}

export function UserTopArtists({ artistList }: { artistList: ArtistObject[] }) {
    return (
        <Row xs={2} md={5}>
            {artistList ? (
                <>
                    {artistList.map((artist: ArtistObject, idx) => (
                        <Col key={idx}>
                            <ArtistCard artist={artist} />
                        </Col>
                    ))}
                </>
            ) : (
                <Col>Loading artists...</Col>
            )}
        </Row>
    );
}
