import * as PIXI from 'pixi.js';

import { config } from '../config.ts';

import { initLoader } from './pixi-loader.ts';
import { pixiResizeHandler } from './utils/on-resize-handler.pixi-utils.ts';

PIXI.settings.ROUND_PIXELS = true;

export const pixi = new PIXI.Application({
    height:
        window.innerHeight >= config.maxHeight
            ? config.maxHeight
            : window.innerHeight,
    width:
        window.innerWidth >= config.maxWidth
            ? config.maxWidth
            : window.innerWidth,
    antialias: false,
    autoDensity: false,
    resolution: window.devicePixelRatio || 2,
    autoStart: true,
    backgroundAlpha: 1
    // resizeTo: window
});

export const loader = PIXI.Loader.shared;

export const loadPixiEngine = (): void => {
    window.addEventListener('resize', pixiResizeHandler);
    pixi.stage = new PIXI.Container();
    pixi.ticker = PIXI.Ticker.shared;
    pixi.ticker.maxFPS = 60;
    pixi.view.style.position = 'absolute';
    pixi.view.style.display = 'block';
    pixi.renderer.view.style.width =
        (window.innerWidth > config.maxWidth
            ? config.maxWidth
            : window.innerWidth) + 'px';
    pixi.renderer.view.style.height =
        (window.innerHeight > config.maxHeight
            ? config.maxHeight
            : window.innerHeight) + 'px';
    const gameElement = document.getElementById('Game');
    pixi.resize();
    if (gameElement && !gameElement.children.length) {
        (document.getElementById('Game') as HTMLElement).appendChild(pixi.view);
        initLoader();
    }
};
