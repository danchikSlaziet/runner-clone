import * as PIXI from 'pixi.js';

import { diamonds } from './pixi-ticker.ts';
import { hpCount } from './pixi-ticker.ts';
import { level } from './pixi-ticker.ts';
import { loader } from './pixi.ts';
import { pixi } from './pixi.ts';
import { ticker } from './pixi-ticker.ts';

export const bgContainer = new PIXI.Container();
export let hero: PIXI.AnimatedSprite & {
    state?: 'jump' | 'walk' | 'fall' | 'static-up' | 'start-fall';
};
export const bossContainer = new PIXI.Container();
export const hp = new PIXI.Sprite();
export const diamondsContainer = new PIXI.Container();
export const bonusHpContainer = new PIXI.Container();
export const timerContainer = new PIXI.Container();
export const diamondsList = new PIXI.Sprite();
export let finger: PIXI.AnimatedSprite;

export const onLoad = (): void => {
    const resources = Object.keys(loader.resources);
    resources.map((item) => {
        const resource = loader.resources[item];
        switch (item) {
            case `bg_${level}`: {
                if (!resource.textures) return;
                for (const [index, texture] of Object.values(
                    resource.textures
                ).entries()) {
                    const background = new PIXI.Sprite(texture);
                    background.anchor.set(0, 1);
                    const width = Object.values(resource.textures)[index - 1]
                        ? Object.values(resource.textures)[index - 1].width
                        : texture.width;
                    background.x =
                        width * index -
                        (background.width *
                            Object.values(resource.textures).length) /
                            2;
                    background.y = pixi.screen.height;
                    // background.height = pixi.screen.height;
                    bgContainer.addChild(background);
                }
                bgContainer.zIndex = -1;
                pixi.stage.addChild(bgContainer);
                break;
            }
            case 'finger': {
                if (!resource.textures) return;
                finger = new PIXI.AnimatedSprite(
                    Object.values(resource.textures)
                );
                // finger.anchor.set(1);
                finger.y = pixi.screen.height / 2 - finger.height / 2;
                finger.x = pixi.screen.width / 2 - finger.width / 2;
                finger.animationSpeed = 0.25;
                finger.play();
                pixi.stage.addChild(finger);
                finger.alpha = 0;
                break;
            }
            case 'walk_man': {
                if (!resource.textures) return;
                hero = new PIXI.AnimatedSprite(
                    Object.values(resource.textures)
                );
                hero.state = 'start-fall';
                hero.animationSpeed = 0.1;
                hero.anchor.set(1);
                hero.height /= 7;
                hero.width /= 7;
                hero.x = 75;
                hero.y = -hero.height;
                pixi.stage.addChild(
                    hero,
                    bossContainer,
                    diamondsContainer,
                    bonusHpContainer
                );
                break;
            }
            case 'hp': {
                if (!resource.textures) return;
                hp.texture = Object.values(resource.textures)[hpCount];
                hp.anchor.set(1);
                hp.height /= 2;
                hp.width /= 2;
                hp.x = hp.width / 2 + 75;
                hp.y = hp.height + 10;
                hp.alpha = 0;
                pixi.stage.addChild(hp);
                break;
            }
            case 'timer': {
                if (!resource.texture) return;
                const timerSprite = new PIXI.Sprite(resource.texture);
                timerSprite.width /= 11.8;
                timerSprite.height /= 11.8;
                timerSprite.x = pixi.screen.width - timerSprite.width * 1.25;
                timerSprite.y = timerSprite.height / 2;

                timerContainer.addChild(timerSprite);
                timerContainer.alpha = 0;
                pixi.stage.addChild(timerContainer);
                break;
            }
            case 'pixel': {
                const style = new PIXI.TextStyle({
                    fontFamily: 'pixel',
                    fill: 0x898989,
                    fontSize: 12
                });
                const scoreText = new PIXI.Text('00:00', style);
                // scoreText.resolution = 16;
                scoreText.anchor.set(1);
                const timerSprite = timerContainer.children[0] as PIXI.Sprite;
                scoreText.x = pixi.screen.width - timerSprite.width / 2.45;
                scoreText.y = timerSprite.height + scoreText.height / 1.5;
                timerContainer.addChild(scoreText);
                break;
            }
            case 'diamonds_list': {
                if (!resource.textures) return;
                diamondsList.texture = Object.values(resource.textures)[
                    diamonds
                ];
                diamondsList.alpha = 0;
                diamondsList.height /= 3;
                diamondsList.width /= 3;
                diamondsList.anchor.set(1);
                diamondsList.x = pixi.screen.width - diamondsList.width / 4;
                diamondsList.y = diamondsList.height * 2.65;
                pixi.stage.addChild(diamondsList);
                break;
            }
        }
    });
    pixi.stage.interactive = true;
    pixi.ticker.add(ticker);
};
