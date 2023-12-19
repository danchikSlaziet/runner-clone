

import * as PIXI from 'pixi.js';
import { Modals } from '../modals/modals.ts';
import { User } from './../modals/rating-modal.ts';

import { bgContainer } from './pixi-onload.ts';
import { bonusHpContainer } from './pixi-onload.ts';
import { bossContainer } from './pixi-onload.ts';
import { diamondsContainer } from './pixi-onload.ts';
import { diamondsList } from './pixi-onload.ts';
import { finger } from './pixi-onload.ts';
import { hero } from './pixi-onload.ts';
import { hp } from './pixi-onload.ts';
import { loader } from './pixi.ts';
import { pixi } from './pixi.ts';
import { randomArrayElement } from './utils/random.pixi-utils.ts';
import { timerContainer } from './pixi-onload.ts';


let isFirstRender = true;
export let diamonds = 0;
let speed = 4;
export let level = 1;
let cdStatic = 0;
export let hpCount = 2;
export let gender: 'man' | 'woman' = 'man';
let isBossActuallyOnboarded = false;
let isDamaged = false;
let needRandomBoss = false;
let isGameStarted = false;
let diamondSpawnTime = Date.now() + 1005000;
let touchDiamondTime = Date.now();
let touchBonusHpTime = Date.now();
let lastBoss: Bosses = 'grudge';
let startTime = 0;
let lastTimeUpdate = Date.now() + 1000;
let needDisableOnboarding = false;
let isBonusHpSpawned = false;

type BossWithBossName = PIXI.AnimatedSprite & {
    bossname?: string;
};

export const setisGameStarted = (): void => {
    isGameStarted = true;
    fetchStartGame();
    diamondSpawnTime = Date.now() + 1005000;
    startTime = 0;
    lastTimeUpdate = Date.now() + 1000;
};

let fetchTime = Date.now() + 20000;

export type Bosses =
    | 'word'
    | 'angrygreen'
    | 'chatchew'
    | 'cruper'
    | 'grudge'
    | 'elfie';

export const bosses: Bosses[] = [
    'word',
    'angrygreen',
    'chatchew',
    'elfie',
    'cruper',
    'grudge'
];

const bossesByLevel: Bosses[][] = [
    ['word'],
    ['angrygreen', 'chatchew'],
    ['elfie'],
    ['cruper', 'grudge']
];

export const opened: { bosses: Bosses[]; modal: Bosses[]; feature: Bosses[] } =
    {
        bosses: [],
        modal: [],
        feature: []
    };

export const onboarding = {
    is: true,
    stage: 0,
    maxStage: 4
};
let openBossModal = false;

export const changeGender = (type: number) => {
    gender = type === 1 ? 'man' : 'woman';
    hero.state = 'start-fall';
    const textures = loader.resources['fall_' + gender].textures;
    if (!textures) return;
    hero.textures = Object.values(textures);
};

export const ticker = (delta: number): void => {
    if (isDamaged) {
        if (hero.rotation > -1) {
            hero.rotation -= 0.1;
        } else {
            window.dispatchEvent(
                new CustomEvent('modal', {
                    detail: Modals.damage
                })
            );
            isDamaged = false;
            pixi.stop();
        }
        return;
    }
    if (isFirstRender) {
        pixi.stage.on('pointerdown', jump);
        window.dispatchEvent(new CustomEvent('loaded'));
        isFirstRender = false;
        fetch('https://avito-tg-game.trendsurfers.ru/api/user', {
            headers: {
                Authorization: window.Telegram.WebApp.initData
            }
        }).then(async (result) => {
            const { data } = await result.json();
            onboarding.is =
                (data as User & { training: boolean }).training || true;
        });
        return;
    } else {
        if (!hero.playing) hero.play();
    }
    if (!isGameStarted) return;
    if (fetchTime <= Date.now()) {
        fetchTime = Date.now() + 20000;
        fetch('https://avito-tg-game.trendsurfers.ru/api/game/ping', {
            headers: {
                Authorization: window.Telegram.WebApp.initData
            }
        });
    }
    if (lastTimeUpdate <= Date.now()) {
        lastTimeUpdate = Date.now() + 1000;
        startTime += 1;
        const timerText: PIXI.Text | undefined = timerContainer
            .children[1] as PIXI.Text;
        if (timerText && timerText.text) {
            const time = new Date(startTime * 1000)
                .toISOString()
                .substring(14, 19);
            timerText.text = time.replace(
                ':',
                parseInt(time.substring(4, 5), 10) % 2 === 0 ? ' ' : ':'
            );
        }
    }
    if (hero.state === 'jump') {
        if (hero.y > pixi.screen.height - hero.height * 3) {
            hero.y -= speed * 2;
        } else {
            hero.state = 'static-up';
        }
    } else if (hero.state === 'fall') {
        if (hero.y < pixi.screen.height - bgContainer.height / 10) {
            hero.y += speed * 1.5;
        } else {
            hero.state = 'walk';
            const textures = loader.resources['walk_' + gender].textures;
            if (!textures) return;
            hero.textures = Object.values(textures);
            hero.play();
        }
    } else if (hero.state === 'static-up') {
        if (cdStatic === 0) {
            cdStatic = Date.now() + 50;
            hero.y += speed;
        } else if (cdStatic < Date.now()) {
            cdStatic = 0;
            hero.state = 'fall';
            hero.textures.reverse();
            hero.animationSpeed = 0.1;
            hero.play();
        }
    } else if (hero.state === 'start-fall') {
        if (hero.y < pixi.screen.height - bgContainer.height / 10) {
            hero.y += speed * 2;
            if (timerContainer.alpha < 1) {
                timerContainer.alpha += 0.25;
                const timerText: PIXI.Text | undefined = timerContainer
                    .children[1] as PIXI.Text;
                if (timerText && timerText.text) {
                    const time = new Date(startTime * 1000)
                        .toISOString()
                        .substring(14, 19);
                    timerText.text = time.replace(
                        ':',
                        parseInt(time.substring(4, 5), 10) % 2 === 0 ? ' ' : ':'
                    );
                }
            } else {
                timerContainer.alpha = 1;
            }
            if (hp.alpha < 1) {
                hp.alpha += 0.25;
            } else {
                hp.alpha = 1;
            }
            if (diamondsList.alpha < 1) {
                diamondsList.alpha += 0.25;
            } else {
                diamondsList.alpha = 1;
            }
        } else {
            hero.play();
            hero.y = pixi.screen.height - bgContainer.height / 10;
            hero.state = 'walk';
            const textures = loader.resources['walk_' + gender].textures;
            if (!textures) return;
            hero.textures = Object.values(textures);
            hero.play();
            // hero.onFrameChange = (frame: number) => {
            //     if (frame === hero.totalFrames - 1) {
            //         hero.state = 'walk';
            //         const textures =
            //             loader.resources['walk_' + gender].textures;
            //         if (!textures) return;
            //         hero.textures = Object.values(textures);
            //         hero.play();
            //         hero.onFrameChange = () => void 0;
            //     }
            // };
        }
    }
    if (
        !isBonusHpSpawned &&
        onboarding.is &&
        level > 1 &&
        diamondsContainer.children.length < 1 &&
        bossContainer.children.length < 1 &&
        bonusHpContainer.children.length < 1 &&
        hpCount < 2
    ) {
        addBonusHp();
    }
    if (
        diamondsContainer.children.length < 1 &&
        bossContainer.children.length < 1 &&
        bonusHpContainer.children.length < 1 &&
        level > 1 &&
        diamondSpawnTime <= Date.now() &&
        diamonds <= 2
    ) {
        diamondSpawnTime = Date.now() + 1005000;
        addDiamonds();
    }
    if (
        bossContainer.children.length < 1 &&
        bonusHpContainer.children.length < 1 &&
        diamondsContainer.children.length === 0
    ) {
        addBoss();
    }
    for (const bonus_hp of bonusHpContainer.children as PIXI.Sprite[]) {
        if (checkCollision2(hero, bonus_hp)) {
            if (touchBonusHpTime <= Date.now()) {
                touchBonusHpTime = Date.now() + 10000;
                hpCount++;
                const hptextures = loader.resources['hp'].textures;
                if (!hptextures) return;
                hp.texture = Object.values(hptextures)[hpCount];
            }
            bonus_hp.alpha /= 1.5;
            // window.dispatchEvent(
            //     new CustomEvent('modal', {
            //         detail: Modals.diamonds
            //     })
            // );
        } else {
            bonus_hp.x -= speed * delta;
            bonus_hp.x %=
                (bgContainer.children[0] as PIXI.TilingSprite).texture.width *
                speed *
                2;
            if (bonus_hp.x < -(bonus_hp as PIXI.Sprite).width) {
                bonusHpContainer.removeChild(bonus_hp);
            }
        }
    }
    for (const diamond of diamondsContainer.children as PIXI.Sprite[]) {
        if (checkCollision2(hero, diamond)) {
            if (touchDiamondTime <= Date.now()) {
                touchDiamondTime = Date.now() + 10000;
                diamonds++;
                const resource = loader.resources['diamonds_list'];
                if (resource.textures) {
                    diamondsList.texture = Object.values(resource.textures)[
                        diamonds
                    ];
                }
                if (diamonds > 2 && !onboarding.is)
                    fetch(
                        'https://avito-tg-game.trendsurfers.ru/api/game/promocode',
                        {
                            headers: {
                                Authorization: window.Telegram.WebApp.initData
                            }
                        }
                    );
            }
            diamond.alpha /= 1.5;
            // window.dispatchEvent(
            //     new CustomEvent('modal', {
            //         detail: Modals.diamonds
            //     })
            // );
        } else {
            diamond.x -= speed * delta;
            diamond.x %=
                (bgContainer.children[0] as PIXI.TilingSprite).texture.width *
                speed *
                2;
            if (diamond.x < -(diamond as PIXI.Sprite).width) {
                diamondsContainer.removeChild(diamond);
            }
        }
    }
    for (const boss of bossContainer.children as BossWithBossName[]) {
        if (checkCollision(hero, boss)) {
            hpCount--;
            if (hpCount < 0) hpCount = 0;
            const textures = loader.resources['hp'].textures;
            if (!textures) return;
            hp.texture = Object.values(textures)[hpCount];
            const heroTextures = loader.resources['damage_' + gender].textures;
            if (!heroTextures) return;
            hero.textures = Object.values(heroTextures);
            hero.animationSpeed = 0.25;
            hero.play();
            isDamaged = true;
            return;
        } else {
            boss.x -= speed * delta;
            boss.x %=
                (bgContainer.children[0] as PIXI.TilingSprite).texture.width *
                speed *
                2;
            const bossName = opened.bosses[opened.bosses.length - 1];
            if (
                boss.x - boss.width < pixi.screen.width - boss.width &&
                !openBossModal &&
                onboarding.is &&
                (!bossName || !opened.modal.includes(bossName)) &&
                bossName === boss.bossname
            ) {
                if (bossName) opened.modal.push(bossName);
                needRandomBoss = true;
                openBossModal = true;
                window.dispatchEvent(
                    new CustomEvent('modal', {
                        detail: Modals.boss
                    })
                );
            }
            if (
                boss.x < -(boss as PIXI.Sprite).width &&
                onboarding.is &&
                finger.alpha === 1
            ) {
                finger.alpha = 0;
            }
            if (boss.x < -(boss as PIXI.Sprite).width * 3) {
                if (boss.x < -(boss as PIXI.Sprite).width * 3) {
                    const bossName = opened.bosses[opened.bosses.length - 1];
                    if (
                        onboarding.is &&
                        !isBossActuallyOnboarded &&
                        (!bossName || !opened.feature.includes(bossName)) &&
                        bossName === boss.bossname
                    ) {
                        if (bossName) opened.feature.push(bossName);
                        isBossActuallyOnboarded = true;
                        window.dispatchEvent(
                            new CustomEvent('modal', {
                                detail: Modals.feature
                            })
                        );
                    }
                }
                if (
                    boss.x < -(boss as PIXI.Sprite).width * 5 &&
                    onboarding.is
                ) {
                    isBossActuallyOnboarded = false;
                    openBossModal = false;
                    bossContainer.removeChild(boss);
                } else if (!onboarding.is) {
                    bossContainer.removeChild(boss);
                }
            }
        }
    }
    for (const bg of bgContainer.children as PIXI.Sprite[]) {
        bg.x -= speed * delta;
        if (bg.x < -bg.texture.width * 1.05) {
            bgContainer.removeChild(bg);
            return;
        }
        const bgTextures = loader.resources['bg_' + level].textures;
        if (!bgTextures) return;
        if (
            bgContainer.children.length <=
                Object.values(bgTextures).length / 2 &&
            needRandomBoss
        ) {
            if (onboarding.is && level === 4) {
                diamondSpawnTime = Date.now();
            }
            needRandomBoss = false;
        }
        if (Math.abs(bg.x) >= bg.texture.width - pixi.screen.width) {
            if (bgContainer.children.length === 1) {
                speed += 0.25;
                const nextLevel = level >= 4 ? 1 : level + 1;
                const resource = loader.resources['bg_' + nextLevel];
                level++;
                if (onboarding.is && level < 4) {
                    diamondSpawnTime = Date.now() + 20000;
                } else {
                    diamondSpawnTime = Date.now() + 105000;
                }
                // if (level === 4) diamondSpawnTime = Date.now();
                if (level !== 4 && level !== 1) {
                    diamondSpawnTime = Date.now() + 10000;
                }
                if (level > 4) {
                    level = 1;
                    if (onboarding.is) {
                        needDisableOnboarding = true;
                    }
                }
                if (onboarding.is) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    gtag('event', 'level_' + level);
                }
                if (!resource.textures) return;
                for (const [index, texture] of Object.values(
                    resource.textures
                ).entries()) {
                    const background = new PIXI.Sprite(texture);
                    background.anchor.set(0, 1);
                    const width = Object.values(resource.textures)[index - 1]
                        ? Object.values(resource.textures)[index - 1].width
                        : texture.width;
                    background.x = width * index + pixi.screen.width;
                    background.y = pixi.screen.height;
                    if (background.x <= 0) background.x = pixi.screen.width;
                    // background.height = pixi.screen.height;
                    bgContainer.addChild(background);
                }
            }
        }
    }
    if (needDisableOnboarding) {
        needDisableOnboarding = false;
        onboarding.is = false;
        window.dispatchEvent(
            new CustomEvent('modal', {
                detail: Modals.onBoardingEnd
            })
        );
        pixi.stop();
        return;
    }
};

const addBonusHp = (): void => {
    isBonusHpSpawned = true;
    const texture = loader.resources['bonus_hp'].texture;
    if (!texture) return;
    const bonus_hp = new PIXI.Sprite(texture);
    bonus_hp.width /= 12;
    bonus_hp.height /= 12;
    bonus_hp.x = pixi.screen.width + bonus_hp.width;
    bonus_hp.y = pixi.screen.height - hero.height * 3;
    bonus_hp.anchor.set(1);
    bonusHpContainer.addChild(bonus_hp);
};

const addDiamonds = (): void => {
    const textures = loader.resources['diamonds'].textures;
    if (!textures) return;
    const diamond = new PIXI.Sprite(Object.values(textures)[diamonds]);
    diamond.width /= 2;
    diamond.height /= 2;
    diamond.x = pixi.screen.width + diamond.width;
    diamond.y = pixi.screen.height - hero.height * 3;
    diamond.anchor.set(1);
    diamondsContainer.addChild(diamond);
};

const addBoss = (): void => {
    if (hero.state === 'start-fall' || diamondsContainer.children.length > 0)
        return;
    const bossName = onboarding.is
        ? getBossOnOnboarding()
        : randomArrayElement(bosses.filter((name) => name !== lastBoss));
    lastBoss = bossName;
    try {
        const textures = loader.resources['boss_' + bossName];
        if (!textures || !textures.textures) return;
        const boss: BossWithBossName = new PIXI.AnimatedSprite(
            Object.values(textures.textures)
        );
        boss.bossname = bossName;
        boss.width /= 3;
        boss.height /= 3;
        boss.x = pixi.screen.width + boss.width;
        boss.y = pixi.screen.height - bgContainer.height / 10;
        boss.animationSpeed =
            bossName === 'word' || bossName === 'elfie' ? 0.5 : 0.05;
        boss.anchor.set(1);
        boss.play();
        bossContainer.addChild(boss);
    } catch (err) {
        console.log(err);
    }
};

const getBossOnOnboarding = (): Bosses => {
    if (needRandomBoss)
        return randomArrayElement(
            opened.bosses.filter((name) =>
                opened.bosses.length > 1 ? name !== lastBoss : true
            )
        );
    const currentBossStage = bossesByLevel[level - 1];
    let pickedBoss: Bosses | undefined;
    for (const boss of currentBossStage) {
        if (!opened.bosses.includes(boss)) {
            pickedBoss = boss;
            opened.bosses.push(boss);
            break;
        }
    }
    const boss =
        pickedBoss ||
        randomArrayElement(
            opened.bosses.filter((name) =>
                opened.bosses.length > 1 ? name !== lastBoss : true
            )
        );
    lastBoss = boss;
    return boss;
};

const jump = (): void => {
    if (hero.state !== 'walk') return;
    hero.state = 'jump';
    const textures = loader.resources['jump_' + gender].textures;
    if (!textures) return;
    hero.textures = Object.values(textures);
    hero.animationSpeed = 0.1;
    hero.play();
};
const checkCollision2 = (
    r1: PIXI.Sprite | PIXI.AnimatedSprite,
    r2: PIXI.Sprite | PIXI.AnimatedSprite
): boolean => {
    const rect1 = r1.getBounds();
    const rect2 = r2.getBounds();
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.height + rect1.y > rect2.y
    );
};

const checkCollision = (
    r1: PIXI.Sprite | PIXI.AnimatedSprite,
    r2: PIXI.Sprite | PIXI.AnimatedSprite
): boolean => {
    const rect1 = r1.getBounds();
    const rect2 = r2.getBounds();
    return (
        rect1.x < rect2.x + rect2.width / 2 &&
        rect1.x + rect1.width / 2 > rect2.x &&
        rect1.y < rect2.y + rect2.height / 2 &&
        rect1.height / 2 + rect1.y > rect2.y
    );
};

export const restartGame = (): void => {
    diamondSpawnTime = Date.now() + 1005000;
    isBonusHpSpawned = false;
    startTime = 0;
    const timerText: PIXI.Text | undefined = timerContainer
        .children[1] as PIXI.Text;
    if (timerText && timerText.text) {
        const time = new Date(startTime * 1000).toISOString().substring(14, 19);
        timerText.text = time.replace(
            ':',
            parseInt(time.substring(4, 5), 10) % 2 === 0 ? ' ' : ':'
        );
        timerText.updateText(timerText.dirty);
    }
    lastTimeUpdate = Date.now() + 1000;
    needRandomBoss = false;
    lastBoss = 'grudge';
    fetchStartGame();
    isGameStarted = false;
    pixi.start();
    for (const hp_bonus of bonusHpContainer.children) {
        hp_bonus.destroy();
    }
    for (const bg of bgContainer.children) {
        bg.destroy();
    }
    hpCount = 2;
    const hptextures = loader.resources['hp'].textures;
    if (!hptextures) return;
    hp.texture = Object.values(hptextures)[hpCount];
    const textures = loader.resources['fall_' + gender].textures;
    if (!textures) return;
    hero.state = 'start-fall';
    hero.rotation = 0;
    hero.y = -hero.height;
    hero.textures = Object.values(textures);
    hero.play();
    level = 1;
    const resource = loader.resources['bg_' + level];
    if (!resource.textures) return;
    for (const [index, texture] of Object.values(resource.textures).entries()) {
        const background = new PIXI.Sprite(texture);
        background.anchor.set(0, 1);
        const width = Object.values(resource.textures)[index - 1]
            ? Object.values(resource.textures)[index - 1].width
            : 0;
        background.x = width * index;
        background.y = pixi.screen.height;
        // background.height = pixi.screen.height;
        bgContainer.addChild(background);
    }
    addBoss();
    if (onboarding.is) {
        openBossModal = false;
        isBossActuallyOnboarded = false;
    }
    isGameStarted = true;
};

export const fetchStartGame = (): void => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    gtag('event', 'start_game');
    fetch('https://avito-tg-game.trendsurfers.ru/api/game/start', {
        headers: {
            Authorization: window.Telegram.WebApp.initData
        }
    });
};
