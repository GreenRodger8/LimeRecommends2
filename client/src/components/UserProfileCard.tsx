import { useEffect, useState } from 'react';
import { ProfileObject } from '../util/spotifyTypes';

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
        <>
            {profile ? (
                <>
                    <h1>Display your Spotify profile data</h1>

                    <section id="profile">
                        <h2>Logged in as {profile.display_name}</h2>
                        <img
                            src={profile.images[0].url}
                            alt="Profile image"
                        ></img>
                        <ul>
                            <li>User ID: {profile.account_id}</li>
                            <li>
                                Spotify URI:{' '}
                                <a id="uri" href={profile.uri}>
                                    {profile.uri}
                                </a>
                            </li>
                            <li>
                                Link:{' '}
                                <a id="url" href={profile.href}>
                                    {profile.href}
                                </a>
                            </li>
                            <li>Profile Image: {profile.images[0].url}</li>
                        </ul>
                    </section>
                </>
            ) : (
                <h1>Loading profile data...</h1>
            )}
        </>
    );
}
