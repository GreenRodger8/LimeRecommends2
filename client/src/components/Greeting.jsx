import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import { redirectToAuthCodeFlow } from '../util/authCodeFlow';
import PropTypes from 'prop-types';

export function Greeting({ onButtonClick }) {
    return (
        <>
            <h1 className="text-center mb-5">
                No code found. Click button to authenticate with Spotify
            </h1>
            <Button onClick={onButtonClick}>Authenticate</Button>
        </>
    );
}

Greeting.propTypes = {
    onButtonClick: PropTypes.func,
};
