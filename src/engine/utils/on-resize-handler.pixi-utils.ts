import { pixi } from '../pixi.ts';

export const pixiResizeHandler = (): void => {
    const ratio = pixi.renderer.width / pixi.renderer.height;
    const isRatioSmall = window.innerWidth / window.innerHeight >= ratio;
    const newWidth = isRatioSmall
        ? window.innerHeight * ratio
        : window.innerWidth;
    const newHeight = isRatioSmall
        ? window.innerHeight
        : window.innerWidth / ratio;

    pixi.renderer.view.style.width = newWidth + 'px';
    pixi.renderer.view.style.height = newHeight + 'px';
    pixi.resize();
};
