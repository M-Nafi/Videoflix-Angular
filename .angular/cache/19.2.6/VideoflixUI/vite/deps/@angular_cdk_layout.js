import "./chunk-MNVRMXNX.js";
import {
  isPlatformBrowser
} from "./chunk-USG4KVQR.js";
import {
  CSP_NONCE,
  Injectable,
  NgModule,
  NgZone,
  PLATFORM_ID,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule
} from "./chunk-SC6VRSP2.js";
import "./chunk-PEBH6BBU.js";
import "./chunk-WPM5VTLQ.js";
import {
  Observable,
  Subject,
  combineLatest,
  concat,
  debounceTime,
  map,
  skip,
  startWith,
  take,
  takeUntil
} from "./chunk-4S3KYZTJ.js";
import "./chunk-GOMI4DH3.js";

// node_modules/@angular/cdk/fesm2022/coercion.mjs
function coerceArray(value) {
  return Array.isArray(value) ? value : [value];
}

// node_modules/@angular/cdk/fesm2022/platform.mjs
var hasV8BreakIterator;
try {
  hasV8BreakIterator = typeof Intl !== "undefined" && Intl.v8BreakIterator;
} catch {
  hasV8BreakIterator = false;
}
var Platform = class _Platform {
  _platformId = inject(PLATFORM_ID);
  // We want to use the Angular platform check because if the Document is shimmed
  // without the navigator, the following checks will fail. This is preferred because
  // sometimes the Document may be shimmed without the user's knowledge or intention
  /** Whether the Angular application is being rendered in the browser. */
  isBrowser = this._platformId ? isPlatformBrowser(this._platformId) : typeof document === "object" && !!document;
  /** Whether the current browser is Microsoft Edge. */
  EDGE = this.isBrowser && /(edge)/i.test(navigator.userAgent);
  /** Whether the current rendering engine is Microsoft Trident. */
  TRIDENT = this.isBrowser && /(msie|trident)/i.test(navigator.userAgent);
  // EdgeHTML and Trident mock Blink specific things and need to be excluded from this check.
  /** Whether the current rendering engine is Blink. */
  BLINK = this.isBrowser && !!(window.chrome || hasV8BreakIterator) && typeof CSS !== "undefined" && !this.EDGE && !this.TRIDENT;
  // Webkit is part of the userAgent in EdgeHTML, Blink and Trident. Therefore we need to
  // ensure that Webkit runs standalone and is not used as another engine's base.
  /** Whether the current rendering engine is WebKit. */
  WEBKIT = this.isBrowser && /AppleWebKit/i.test(navigator.userAgent) && !this.BLINK && !this.EDGE && !this.TRIDENT;
  /** Whether the current platform is Apple iOS. */
  IOS = this.isBrowser && /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);
  // It's difficult to detect the plain Gecko engine, because most of the browsers identify
  // them self as Gecko-like browsers and modify the userAgent's according to that.
  // Since we only cover one explicit Firefox case, we can simply check for Firefox
  // instead of having an unstable check for Gecko.
  /** Whether the current browser is Firefox. */
  FIREFOX = this.isBrowser && /(firefox|minefield)/i.test(navigator.userAgent);
  /** Whether the current platform is Android. */
  // Trident on mobile adds the android platform to the userAgent to trick detections.
  ANDROID = this.isBrowser && /android/i.test(navigator.userAgent) && !this.TRIDENT;
  // Safari browsers will include the Safari keyword in their userAgent. Some browsers may fake
  // this and just place the Safari keyword in the userAgent. To be more safe about Safari every
  // Safari browser should also use Webkit as its layout engine.
  /** Whether the current browser is Safari. */
  SAFARI = this.isBrowser && /safari/i.test(navigator.userAgent) && this.WEBKIT;
  constructor() {
  }
  static ɵfac = function Platform_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Platform)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _Platform,
    factory: _Platform.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Platform, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
var PlatformModule = class _PlatformModule {
  static ɵfac = function PlatformModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PlatformModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _PlatformModule
  });
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PlatformModule, [{
    type: NgModule,
    args: [{}]
  }], null, null);
})();
var RtlScrollAxisType;
(function(RtlScrollAxisType2) {
  RtlScrollAxisType2[RtlScrollAxisType2["NORMAL"] = 0] = "NORMAL";
  RtlScrollAxisType2[RtlScrollAxisType2["NEGATED"] = 1] = "NEGATED";
  RtlScrollAxisType2[RtlScrollAxisType2["INVERTED"] = 2] = "INVERTED";
})(RtlScrollAxisType || (RtlScrollAxisType = {}));

// node_modules/@angular/cdk/fesm2022/layout.mjs
var LayoutModule = class _LayoutModule {
  static ɵfac = function LayoutModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LayoutModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _LayoutModule
  });
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LayoutModule, [{
    type: NgModule,
    args: [{}]
  }], null, null);
})();
var mediaQueriesForWebkitCompatibility = /* @__PURE__ */ new Set();
var mediaQueryStyleNode;
var MediaMatcher = class _MediaMatcher {
  _platform = inject(Platform);
  _nonce = inject(CSP_NONCE, {
    optional: true
  });
  /** The internal matchMedia method to return back a MediaQueryList like object. */
  _matchMedia;
  constructor() {
    this._matchMedia = this._platform.isBrowser && window.matchMedia ? (
      // matchMedia is bound to the window scope intentionally as it is an illegal invocation to
      // call it from a different scope.
      window.matchMedia.bind(window)
    ) : noopMatchMedia;
  }
  /**
   * Evaluates the given media query and returns the native MediaQueryList from which results
   * can be retrieved.
   * Confirms the layout engine will trigger for the selector query provided and returns the
   * MediaQueryList for the query provided.
   */
  matchMedia(query) {
    if (this._platform.WEBKIT || this._platform.BLINK) {
      createEmptyStyleRule(query, this._nonce);
    }
    return this._matchMedia(query);
  }
  static ɵfac = function MediaMatcher_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MediaMatcher)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _MediaMatcher,
    factory: _MediaMatcher.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MediaMatcher, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
function createEmptyStyleRule(query, nonce) {
  if (mediaQueriesForWebkitCompatibility.has(query)) {
    return;
  }
  try {
    if (!mediaQueryStyleNode) {
      mediaQueryStyleNode = document.createElement("style");
      if (nonce) {
        mediaQueryStyleNode.setAttribute("nonce", nonce);
      }
      mediaQueryStyleNode.setAttribute("type", "text/css");
      document.head.appendChild(mediaQueryStyleNode);
    }
    if (mediaQueryStyleNode.sheet) {
      mediaQueryStyleNode.sheet.insertRule(`@media ${query} {body{ }}`, 0);
      mediaQueriesForWebkitCompatibility.add(query);
    }
  } catch (e) {
    console.error(e);
  }
}
function noopMatchMedia(query) {
  return {
    matches: query === "all" || query === "",
    media: query,
    addListener: () => {
    },
    removeListener: () => {
    }
  };
}
var BreakpointObserver = class _BreakpointObserver {
  _mediaMatcher = inject(MediaMatcher);
  _zone = inject(NgZone);
  /**  A map of all media queries currently being listened for. */
  _queries = /* @__PURE__ */ new Map();
  /** A subject for all other observables to takeUntil based on. */
  _destroySubject = new Subject();
  constructor() {
  }
  /** Completes the active subject, signalling to all other observables to complete. */
  ngOnDestroy() {
    this._destroySubject.next();
    this._destroySubject.complete();
  }
  /**
   * Whether one or more media queries match the current viewport size.
   * @param value One or more media queries to check.
   * @returns Whether any of the media queries match.
   */
  isMatched(value) {
    const queries = splitQueries(coerceArray(value));
    return queries.some((mediaQuery) => this._registerQuery(mediaQuery).mql.matches);
  }
  /**
   * Gets an observable of results for the given queries that will emit new results for any changes
   * in matching of the given queries.
   * @param value One or more media queries to check.
   * @returns A stream of matches for the given queries.
   */
  observe(value) {
    const queries = splitQueries(coerceArray(value));
    const observables = queries.map((query) => this._registerQuery(query).observable);
    let stateObservable = combineLatest(observables);
    stateObservable = concat(stateObservable.pipe(take(1)), stateObservable.pipe(skip(1), debounceTime(0)));
    return stateObservable.pipe(map((breakpointStates) => {
      const response = {
        matches: false,
        breakpoints: {}
      };
      breakpointStates.forEach(({
        matches,
        query
      }) => {
        response.matches = response.matches || matches;
        response.breakpoints[query] = matches;
      });
      return response;
    }));
  }
  /** Registers a specific query to be listened for. */
  _registerQuery(query) {
    if (this._queries.has(query)) {
      return this._queries.get(query);
    }
    const mql = this._mediaMatcher.matchMedia(query);
    const queryObservable = new Observable((observer) => {
      const handler = (e) => this._zone.run(() => observer.next(e));
      mql.addListener(handler);
      return () => {
        mql.removeListener(handler);
      };
    }).pipe(startWith(mql), map(({
      matches
    }) => ({
      query,
      matches
    })), takeUntil(this._destroySubject));
    const output = {
      observable: queryObservable,
      mql
    };
    this._queries.set(query, output);
    return output;
  }
  static ɵfac = function BreakpointObserver_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BreakpointObserver)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _BreakpointObserver,
    factory: _BreakpointObserver.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BreakpointObserver, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
function splitQueries(queries) {
  return queries.map((query) => query.split(",")).reduce((a1, a2) => a1.concat(a2)).map((query) => query.trim());
}
var Breakpoints = {
  XSmall: "(max-width: 599.98px)",
  Small: "(min-width: 600px) and (max-width: 959.98px)",
  Medium: "(min-width: 960px) and (max-width: 1279.98px)",
  Large: "(min-width: 1280px) and (max-width: 1919.98px)",
  XLarge: "(min-width: 1920px)",
  Handset: "(max-width: 599.98px) and (orientation: portrait), (max-width: 959.98px) and (orientation: landscape)",
  Tablet: "(min-width: 600px) and (max-width: 839.98px) and (orientation: portrait), (min-width: 960px) and (max-width: 1279.98px) and (orientation: landscape)",
  Web: "(min-width: 840px) and (orientation: portrait), (min-width: 1280px) and (orientation: landscape)",
  HandsetPortrait: "(max-width: 599.98px) and (orientation: portrait)",
  TabletPortrait: "(min-width: 600px) and (max-width: 839.98px) and (orientation: portrait)",
  WebPortrait: "(min-width: 840px) and (orientation: portrait)",
  HandsetLandscape: "(max-width: 959.98px) and (orientation: landscape)",
  TabletLandscape: "(min-width: 960px) and (max-width: 1279.98px) and (orientation: landscape)",
  WebLandscape: "(min-width: 1280px) and (orientation: landscape)"
};
export {
  BreakpointObserver,
  Breakpoints,
  LayoutModule,
  MediaMatcher
};
//# sourceMappingURL=@angular_cdk_layout.js.map
