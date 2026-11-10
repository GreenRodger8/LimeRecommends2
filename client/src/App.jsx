import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { TodoListCard } from './components/TodoListCard';
import { Greeting } from './components/Greeting';
import { redirectToAuthCodeFlow, getAccessToken } from './util/authCodeFlow';
import { UserProfileCard } from './components/UserProfileCard';
import { UserTopArtists } from './components/UserTopArtists';
import { useState, useEffect } from 'react';

function App() {
    const clientId = ''; // Replace with your client id
    const [accessResponse, setAccessResponse] = useState(null);
    const [backendResult, setBackendResult] = useState(null);
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    useEffect(() => {
        if (code) {
            getAccessToken(clientId, code).then((res) => {
                if (res) setAccessResponse(res);
            });
        }
    }, [code]);

    function testBackend() {
        fetch('/api/random')
            .then((res) => res.json())
            .then((data) => setBackendResult(data.random));
    }

    return (
        <Container>
            <Row>
                <Col>
                    I exist. Access token:{' '}
                    {accessResponse
                        ? accessResponse
                        : 'No access token available'}
                </Col>
            </Row>
            <Row>
                <Col md={{ offset: 3, span: 6 }}>
                    {accessResponse ? (
                        <UserProfileCard token={accessResponse} />
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
                    {accessResponse ? (
                        <UserTopArtists token={accessResponse}></UserTopArtists>
                    ) : (
                        <></>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default App;
