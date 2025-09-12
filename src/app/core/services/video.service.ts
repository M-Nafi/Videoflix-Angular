import { HttpClient } from '@angular/common/http';
import { Injectable, signal, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Video {
    id: number;
    title: string;
    description: string;
    thumbnail_url: string;
    category: string;
    created_at: string;
    slug: string;
    genre?: string;
    thumbnail?: string;
}

@Injectable({ providedIn: 'root' })
export class VideoService {
    title = signal('');
    private http = inject(HttpClient);
    private apiUrl = '/api/video/';

    /**
     * Fetches a list of videos from the API and returns an Observable
     * that emits an array of video objects. The video objects are
     * augmented with additional properties `genre` and `thumbnail`
     * which are aliases for the `category` and `thumbnail_url` properties
     * of the original response.
     */
    getVideos(): Observable<Video[]> {
        return this.http.get<Video[]>(this.apiUrl).pipe(
            map((videos) =>
                videos.map((v) => ({
                    ...v,
                    genre: v.category,
                    thumbnail: v.thumbnail_url,
                }))
            )
        );
    }

    /**
     * Fetches a video by its slug from the API, and returns an Observable
     * that emits the video object or undefined if no matching video is found.
     *
     * @param slug The slug of the video to fetch.
     * @returns An Observable that emits the video object or undefined.
     */
    getVideoBySlug(slug: string): Observable<Video | undefined> {
        return this.getVideos().pipe(
            map((videos) =>
                videos
                    .map((v) => ({
                        ...v,
                        genre: v.category,
                        thumbnail: v.thumbnail_url,
                    }))
                    .find((v) => v.slug === slug)
            )
        );
    }

    /**
     * Generates a URL for a HLS video stream.
     *
     * @param videoIdOrSlug The video ID or slug to fetch.
     * @param resolution The resolution of the video stream.
     * @returns A URL for the HLS video stream.
     */
    getHlsUrl(
        videoIdOrSlug: number | string,
        resolution: '480p' | '720p' | '1080p'
    ): string {
        let pathSegment: string;

        if (typeof videoIdOrSlug === 'number') {
            pathSegment = videoIdOrSlug.toString();
        } else {
            pathSegment = videoIdOrSlug.trim().replace(/[\s-]+/g, '_');
        }
        return `http://127.0.0.1:8000/media/videos/hls/${resolution}/${pathSegment}/index.m3u8`;
    }
}
