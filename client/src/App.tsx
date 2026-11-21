import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { TodoListCard } from './components/TodoListCard';
import { Greeting } from './components/Greeting';
import { redirectToAuthCodeFlow, getAccessToken } from './util/authCodeFlow';
import { UserProfileCard } from './components/UserProfileCard';
import { UserTopArtists } from './components/UserTopArtists';
import { UserTopTracks } from './components/UserTopTracks';
import { useState, useEffect } from 'react';
import { ProfileObject, ArtistObject, TrackObject } from './util/spotifyTypes';

function App() {
    const clientId = ''; // Replace with your client id
    const [token, setToken] = useState<string>('');
    const [artistList, setArtistList] = useState<ArtistObject[] | null>(null);
    const [trackList, setTrackList] = useState<TrackObject[] | null>(null);
    const [profile, setProfile] = useState<ProfileObject | null>(null);
    const [backendResult, setBackendResult] = useState<string | null>(null);
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    useEffect(() => {
        if (code) {
            getAccessToken(clientId, code)
                .then((res) => {
                    if (res) {
                        setToken(res);
                        return res;
                    }
                })
                .then((res) => {
                    fetchUser(res);
                    fetchUserArtists(res);
                    fetchUserTracks(res);
                });
        }
    }, [code]);

    function fetchUser(token: string) {
        fetch('https://api.spotify.com/v1/me', {
            method: 'GET',
            headers: { Authorization: 'Bearer ' + token },
        })
            .then((r) => r.json())
            .then((r) => {
                if (!r.error) setProfile(r);
            });
    }

    function fetchUserArtists(token: string) {
        fetch(
            'https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50',
            {
                method: 'GET',
                headers: { Authorization: 'Bearer ' + token },
            },
        )
            .then((r) => r.json())
            .then((res) => {
                if (!res.error) setArtistList(res.items);
            });
    }

    function fetchUserTracks(token: string) {
        fetch(
            'https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50',
            {
                method: 'GET',
                headers: { Authorization: 'Bearer ' + token },
            },
        )
            .then((r) => r.json())
            .then((res) => {
                if (!res.error) setTrackList(res.items);
            });
    }

    function testBackend() {
        setBackendResult('Loading');

        const options = {
            method: 'POST',
            body: JSON.stringify({
                user: profile,
                artists: artistList,
                tracks: trackList,
            }),
            headers: { 'Content-Type': 'application/json' },
        };

        fetch('/api/users', options)
            .then((res) => res.json())
            .then((data) =>
                setBackendResult(
                    'Finished loading. Result: ' + JSON.stringify(data),
                ),
            );
    }

    return (
        <Container>
            <Row>
                <Col>
                    I exist. Access token:{' '}
                    {token ? token : 'No access token available'}
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    {profile ? (
                        <UserProfileCard profile={profile} />
                    ) : (
                        <Greeting
                            onButtonClick={() => {
                                redirectToAuthCodeFlow(clientId);
                            }}
                        />
                    )}
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button onClick={testBackend}>Click to test backend</Button>
                </Col>
                <Col>{backendResult}</Col>
            </Row>
            <Row>
                <Col>
                    {artistList ? (
                        <UserTopArtists
                            artistList={artistList}
                        ></UserTopArtists>
                    ) : (
                        <></>
                    )}
                </Col>
            </Row>
            <Row>
                <Col>
                    {trackList ? (
                        <UserTopTracks trackList={trackList}></UserTopTracks>
                    ) : (
                        <></>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default App;
