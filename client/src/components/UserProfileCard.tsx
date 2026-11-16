import { useEffect, useState } from 'react';
import { ProfileObject } from '../util/spotifyTypes';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/esm/Col';
import Image from 'react-bootstrap/Image';

export function UserProfileCard({ token }: { token: string }) {
    const [profile, setProfile] = useState<ProfileObject | null>(null);

    useEffect(() => {
        if (token && !profile) {
            fetch('https://api.spotify.com/v1/me', {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((r) => r.json())
                .then(setProfile);
        }
    }, [token]);

    //if (items === null) return 'Loading...';

    return (
        <Card>
            <Card.Body>
                <Card.Title>Profile</Card.Title>
                {profile ? (
                    <Container>
                        <Row>
                            <Col md={4}>
                                <Image src={profile.images[0].url} rounded />
                            </Col>
                            <Col md={8}>
                                <span>{profile.display_name}</span>
                                <span>User ID: {profile.account_id}</span>
                                <span>
                                    Spotify URI:
                                    <a id="uri" href={profile.uri}>
                                        {profile.uri}
                                    </a>
                                </span>
                                <span>
                                    Link:
                                    <a id="url" href={profile.href}>
                                        {profile.href}
                                    </a>
                                </span>
                            </Col>
                        </Row>
                    </Container>
                ) : (
                    <h1>Loading profile data...</h1>
                )}
            </Card.Body>
        </Card>
    );
}
