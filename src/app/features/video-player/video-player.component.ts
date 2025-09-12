import {
    Component,
    ViewChild,
    ElementRef,
    Renderer2,
    OnDestroy,
} from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoService } from '../../core/services/video.service';
import Hls from 'hls.js';

@Component({
    selector: 'app-video-player',
    templateUrl: './video-player.component.html',
    styleUrls: ['./video-player.component.scss'],
})
export class VideoPlayerComponent implements OnDestroy {
    @ViewChild('videoElement', { static: true })
    videoRef!: ElementRef<HTMLVideoElement>;

    videoUrl = '';
    private hls?: Hls;

    /**
     * Initializes the video player component and sets up the necessary
     * subscriptions for query params and video data.
     *
     */
    constructor(
        private location: Location,
        private renderer: Renderer2,
        private el: ElementRef,
        private route: ActivatedRoute,
        private router: Router,
        private videoService: VideoService
    ) {
        this.route.queryParams.subscribe((params) => {
            const slug = params['slug'];
            if (!slug) return;

            const normalizedSlug = this.normalizeSlug(slug);

            if (!this.isValidSlug(normalizedSlug)) {
                this.router.navigate(['/not-found']);
                return;
            }

            this.videoService
                .getVideoBySlug(normalizedSlug)
                .subscribe((video) => {
                    if (!video) {
                        this.router.navigate(['/not-found']);
                        return;
                    }

                    this.videoService.title.set(video.title);
                    this.videoUrl = this.videoService.getHlsUrl(
                        normalizedSlug,
                        '480p'
                    );
                    this.initHlsPlayer();
                });
        });
    }

    /**
     * Normalizes a slug by removing leading and trailing whitespace
     * and replacing consecutive whitespace characters with a single underscore.
     *
     */
    private normalizeSlug(slug: string): string {
        return slug.trim().replace(/\s+/g, '_');
    }

    /**
     * Checks if a slug is valid by testing if it matches the pattern
     * /^[a-zA-Z0-9_-]+$/. Valid slugs can only contain alphanumeric characters,
     * underscores, and hyphens.
     *
     */
    private isValidSlug(slug: string): boolean {
        const slugPattern = /^[a-zA-Z0-9_-]+$/;
        return slugPattern.test(slug);
    }

    /**
     * Initializes the HLS player if supported by the browser and the video element,
     * and attaches it to the video element. If the browser does not support HLS or the
     * video element is not available, the video src is set to the video URL and the
     * video is played.
     *
     * Emits an error event if there is an error during the HLS initialization or playback.
     *
     */
    private initHlsPlayer(): void {
        const videoEl = this.videoRef.nativeElement;
        if (!videoEl || !this.videoUrl) return;

        if (this.hls) {
            this.hls.destroy();
            this.hls = undefined;
        }

        if (Hls.isSupported()) {
            this.hls = new Hls({ startLevel: 0, maxBufferHole: 0.5 });
            this.hls.loadSource(this.videoUrl);
            this.hls.attachMedia(videoEl);

            this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                videoEl.play().catch(() => {});
            });

            this.hls.on(Hls.Events.ERROR, (event, data) => {
                console.error('HLS error:', data);
            });
        } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
            videoEl.src = this.videoUrl;
            videoEl.play().catch(() => {});
        }
    }

    /**
     * Navigates the user back to the main page.
     *
     */
    goBack(): void {
        this.router.navigate(['/mainpage']);
    }

    /**
     * Toggles the visibility of the header component by adding or removing the
     * 'hide' class to the header element. If the header element is not found,
     * nothing happens.
     *
     */
    toggleHeader(hide: boolean): void {
        const header = document.querySelector('app-header .header');
        if (header) {
            hide
                ? this.renderer.addClass(header, 'hide')
                : this.renderer.removeClass(header, 'hide');
        }
    }

    /**
     * Hides the header after a delay of 5 seconds.
     *
     */
    hideHeader(): void {
        setTimeout(() => {
            this.toggleHeader(true);
        }, 5000);
    }

    /**
     * Shows the header after a delay of 500 milliseconds.
     *
     */
    showHeader(): void {
        setTimeout(() => {
            this.toggleHeader(false);
        }, 500);
    }

    /**
     * Cleanup function that destroys the HLS player and releases resources when the component is destroyed.
     *
     */
    ngOnDestroy(): void {
        if (this.hls) {
            this.hls.destroy();
            this.hls = undefined;
        }
    }
}
