import { Component, OnInit, OnDestroy, ViewChild, ElementRef, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import Hls from 'hls.js';
import { Video, VideoService } from '../../core/services/video.service';

interface VideoSection {
    title: string;
    images: string[];
}

@Component({
    selector: 'app-mainpage',
    imports: [],
    templateUrl: './mainpage.component.html',
    styleUrls: ['./mainpage.component.scss'],
})
export class MainpageComponent implements OnInit, OnDestroy {
    video = signal<Video | null>(null);
    videoUrl = '';
    videoSections: VideoSection[] = [];

    @ViewChild('previewVideo', { static: false })
    previewVideoRef!: ElementRef<HTMLVideoElement>;

    private hls?: Hls;

    /**
     * The constructor initializes the component and its dependencies.
     * It receives the `BreakpointObserver` to detect screen size changes,
     * the `Router` to navigate to other pages, and the `VideoService` to fetch video data.
     * @param breakpointObserver The `BreakpointObserver` to detect screen size changes.
     * @param router The `Router` to navigate to other pages.
     * @param videoService The `VideoService` to fetch video data.
     */
    constructor(
        private breakpointObserver: BreakpointObserver,
        private router: Router,
        private videoService: VideoService
    ) {}

    /**
     * The lifecycle hook to initialize the component.
     * It fetches a list of videos from the API and selects a random video to display.
     * It then sets the URL of the HLS video stream and handles the breakpoints.
     * The component property `videoSections` is also set to group the videos by genres.
     */
    ngOnInit(): void {
        this.videoService.getVideos().subscribe((videos) => {
            if (!videos?.length) return;

            const selected = this.selectRandomVideo(videos);
            this.video.set(selected);
            this.videoUrl = this.videoService.getHlsUrl(selected, '480p');

            this.handleBreakpoints();
            this.videoSections = this.groupVideosByGenre(videos, selected);
        });
    }

    /**
     * Navigates to the video player page with the currently selected video.
     * If no video is currently selected, the function does nothing.
     */
    playVideo(): void {
        const v = this.video(); 
        if (v) {
            this.router.navigate(['/video-player'], { state: { video: v } });
        }
    }

    /**
     * Selects a random video from the given array of videos.
     * @param videos The array of videos to select a random video from.
     * @returns The randomly selected video.
     */
    private selectRandomVideo(videos: Video[]): Video {
        const randomIndex = Math.floor(Math.random() * videos.length);
        return videos[randomIndex];
    }

    /**
     * Handles the screen size changes by observing the `(min-width: 960px)` media query.
     * When the screen size is larger than 960px, the HLS player is attached to the preview video element.
     * When the screen size is smaller than 960px, the HLS player is destroyed and the video element is reset.
     */
    private handleBreakpoints(): void {
        this.breakpointObserver
            .observe(['(min-width: 960px)'])
            .subscribe((result) => {
                const videoEl = this.previewVideoRef?.nativeElement;
                if (result.matches) {
                    this.attachPreviewHls();
                } else {
                    if (this.hls) {
                        this.hls.destroy();
                        this.hls = undefined;
                    }
                    if (videoEl) {
                        videoEl.pause();
                        videoEl.removeAttribute('src');
                        videoEl.load();
                    }
                }
            });
    }

    /**
     * Groups the given videos by genre and puts the thumbnail of the selected video first in its genre.
     * @param videos The array of videos to group.
     * @param selected The selected video.
     * @returns An array of { title: string, images: string[] } objects, where title is the genre and images is the array of thumbnails.
     */
    private groupVideosByGenre(
        videos: Video[],
        selected: Video
    ): VideoSection[] {
        const grouped: { [genre: string]: string[] } = {};
        for (const v of videos) {
            if (!v.genre || !v.thumbnail) continue;
            if (v.id === selected.id) {
                grouped[v.genre] = [v.thumbnail, ...(grouped[v.genre] || [])];
            } else {
                grouped[v.genre] = [...(grouped[v.genre] || []), v.thumbnail];
            }
        }
        return Object.entries(grouped).map(([genre, images]) => ({
            title: genre,
            images,
        }));
    }

    /**
     * Initializes the HLS player if supported by the browser and the
     * video element, and attaches it to the video element. If the browser
     * does not support HLS or the video element is not available, the
     * video src is set to the video URL and the video is played.
     * Emits an error event if there is an error during the HLS initialization
     * or playback.
     */
    private attachPreviewHls(): void {
        const videoEl = this.previewVideoRef?.nativeElement;
        if (!videoEl) return;

        if (this.hls) {
            this.hls.destroy();
            this.hls = undefined;
        }

        if (Hls.isSupported()) {
            this.hls = new Hls({ startLevel: 0 });
            this.hls.attachMedia(videoEl);

            this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
                this.hls!.loadSource(this.videoUrl);
            });

            this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                videoEl.play().catch(() => {});
            });
        } else if (videoEl.canPlayType('application/vnd.apple.mpegURL')) {
            // Safari / iOS
            videoEl.src = this.videoUrl;
            videoEl.play().catch(() => {});
        }
    }

    /**
     * Handles the click event of an image in the main page.
     * If the breakpoint is above 960px, it navigates to the video player page with the slug of the
     * video that was clicked.
     * @param image The thumbnail URL of the clicked image.
     */
    onImageClick(image: string): void {
        this.videoService.getVideos().subscribe((videos) => {
            const clicked = videos.find((x) => x.thumbnail === image);
            if (!clicked) return;

            this.breakpointObserver
                .observe(['(min-width: 960px)'])
                .subscribe(() => {
                    this.router.navigate(['/video-player'], {
                        state: { video: clicked },
                    });
                });
        });
    }

    /**
     * Returns the title of the given VideoSection, used as the trackBy function for
     * the video sections iterable in the main page template.
     * @param index The index of the VideoSection in the iterable.
     * @param section The VideoSection object.
     * @returns The title of the VideoSection.
     */
    trackByTitle(index: number, section: VideoSection): string {
        return section.title;
    }

    /**
     * Returns the image URL of the given image, used as the trackBy function for
     * the images iterable in the main page template.
     * @param index The index of the image in the iterable.
     * @param image The image URL.
     * @returns The image URL.
     */
    trackByImage(index: number, image: string): string {
        return image;
    }

    /**
     * Cleanup function that destroys the HLS player and releases resources when the component is destroyed.
     */
    ngOnDestroy(): void {
        const videoEl = this.previewVideoRef?.nativeElement;
        if (this.hls) {
            this.hls.destroy();
            this.hls = undefined;
        }
        if (videoEl) {
            videoEl.pause();
            videoEl.removeAttribute('src');
            videoEl.load();
        }
    }
}
