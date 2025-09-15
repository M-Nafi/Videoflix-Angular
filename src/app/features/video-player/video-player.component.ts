import { Component, ViewChild, ElementRef, Renderer2, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { VideoService, Video } from '../../core/services/video.service';
import Hls from 'hls.js';

@Component({
    selector: 'app-video-player',
    templateUrl: './video-player.component.html',
    styleUrls: ['./video-player.component.scss'],
})
export class VideoPlayerComponent implements OnDestroy, AfterViewInit {
    @ViewChild('videoElement', { static: true })
    videoRef!: ElementRef<HTMLVideoElement>;

    video?: Video;
    videoUrl = '';
    private hls?: Hls;

    /**
     * Constructor for the VideoPlayerComponent.
     * It gets the video from the history state, navigates to the mainpage if the video is not found,
     * sets the video title to the video service title property, and sets the video URL to the HLS URL of the video.
     * @param router The router service for navigating to the mainpage.
     * @param renderer The renderer service for rendering the component.
     * @param videoService The video service for getting the video title and URL.
     */
    constructor(
        private router: Router,
        private renderer: Renderer2,
        private videoService: VideoService
    ) {
        this.video = history.state.video;
        if (!this.video) {
            this.router.navigate(['/mainpage']);
            return;
        }
        this.videoService.title.set(this.video.title);
        this.videoUrl = this.videoService.getHlsUrl(this.video, '480p');
    }

    /**
     * Lifecycle hook that is called after the component's view has been initialized.
     * It checks if the video and video element references are available, and if so, initializes the HLS player.
     */
    ngAfterViewInit(): void {
        if (this.video && this.videoRef) {
            this.initHlsPlayer();
        }
    }

    /**
     * Initializes the HLS player if supported by the browser and the
     * video element, and attaches it to the video element. If the browser
     * does not support HLS or the video element is not available, the
     * video src is set to the video URL and the video is played.
     *
     * Emits an error event if there is an error during the HLS initialization
     * or playback.
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
     * Navigates back to the mainpage.
     */
    goBack(): void {
        this.router.navigate(['/mainpage']);
    }

    /**
     * Toggles the visibility of the header component.
     * @param hide A boolean indicating whether the header should be hidden or not.
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
     * Hides the header component after a delay of 5000 milliseconds.
     * This method is called when the video is playing and the header should be hidden.
     */
    hideHeader(): void {
        setTimeout(() => {
            this.toggleHeader(true);
        }, 5000);
    }

    /**
     * Shows the header component after a delay of 500 milliseconds.
     * This method is called when the video is paused and the header should be shown.
     */
    showHeader(): void {
        setTimeout(() => {
            this.toggleHeader(false);
        }, 500);
    }

    /**
     * Lifecycle hook that is called just before Angular destroys the component.
     * It cleans up after the component by destroying the HLS player and releasing its resources,
     * and pauses and resets the video element.
     */
    ngOnDestroy(): void {
        if (this.hls) {
            this.hls.destroy();
            this.hls = undefined;
        }
        const videoEl = this.videoRef?.nativeElement;
        if (videoEl) {
            videoEl.pause();
            videoEl.removeAttribute('src');
            videoEl.load();
        }
    }
}