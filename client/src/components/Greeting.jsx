import { useEffect, useState } from 'react';
import { redirectToAuthCodeFlow } from '../util/authCodeFlow';
import PropTypes from 'prop-types';

export function Greeting({ onButtonClick }) {
    return (
        <>
            <h1 className="text-center mb-5">
                No code found. Click button to authenticate with Spotify
            </h1>
            <button onClick={onButtonClick}>Authenticate</button>
        </>
    );
}

Greeting.propTypes = {
    onButtonClick: PropTypes.func,
};
