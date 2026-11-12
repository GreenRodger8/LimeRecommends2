export interface ExternalUrlsObject {
    spotify: string;
}

export interface ExternalIdsObject {
    isrc: string;
    ean: string;
    upc: string;
}

export interface RestrictionsObject {
    reason: 'market' | 'product' | 'explicit';
}

export interface ImageObject {
    url: string;
    height: number;
    width: number;
}

export interface ArtistObject {
    external_urls: ExternalUrlsObject;
    href: string;
    id: string;
    images?: ImageObject[];
    name: string;
    type: 'artist';
    uri: string;
}

export interface AlbumObject {
    album_type: 'album' | 'single' | 'compilation';
    total_tracks: number;
    external_urls: ExternalUrlsObject;
    href: string;
    id: string;
    images: ImageObject[];
    name: string;
    release_date: string;
    release_date_precision: string;
    restrictions: RestrictionsObject;
    type: 'album';
    uri: string;
    artists: ArtistObject[];
}

export interface TrackObject {
    album: AlbumObject;
    artists: ArtistObject[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: ExternalIdsObject;
    href: string;
    id: string;
    is_playable: boolean;
    restrictions: RestrictionsObject;
    name: string;
    track_number: number;
    type: 'track';
    uri: string;
    is_local: boolean;
}

export interface ProfileObject {
    account_id: string;
    display_name: string | null;
    external_urls: ExternalUrlsObject;
    href: string;
    id: string;
    images: ImageObject[];
    type: 'user';
    uri: string;
}
