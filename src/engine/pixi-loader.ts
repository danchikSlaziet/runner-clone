import { config } from '../config.ts';

import { loader } from './pixi.ts';
import { onLoad } from './pixi-onload.ts';

export const initLoader = (): void => {
    loader
        .add('bg_1', config.assetsUrl + '/_bg_/bg_1.json')
        .add('bg_2', config.assetsUrl + '/_bg_/bg_2.json')
        .add('bg_3', config.assetsUrl + '/_bg_/bg_3.json')
        .add('bg_4', config.assetsUrl + '/_bg_/bg_4.json')
        .add('diamonds_list', config.assetsUrl + '/diamonds_list.json')
        .add('diamonds', config.assetsUrl + '/diamonds.json')
        .add('walk_man', config.assetsUrl + '/walk_man.json')
        .add('jump_man', config.assetsUrl + '/jump_man.json')
        .add('walk_woman', config.assetsUrl + '/walk_woman.json')
        .add('fall_man', config.assetsUrl + '/fall_man.json')
        .add('fall_woman', config.assetsUrl + '/fall_woman.json')
        .add('damage_man', config.assetsUrl + '/damage_man.json')
        .add('damage_woman', config.assetsUrl + '/damage_woman.json')
        .add('jump_woman', config.assetsUrl + '/jump_woman.json')
        .add('boss_word', config.assetsUrl + '/boss_word.json')
        .add('boss_angrygreen', config.assetsUrl + '/boss_angrygreen.json')
        .add('boss_chatchew', config.assetsUrl + '/boss_chatchew.json')
        .add('boss_cruper', config.assetsUrl + '/boss_cruper.json')
        .add('boss_grudge', config.assetsUrl + '/boss_grudge.json')
        .add('boss_elfie', config.assetsUrl + '/boss_elfie.json')
        .add('hp', config.assetsUrl + '/healthpoints.json')
        .add('timer', config.assetsUrl + '/time.png')
        .add('finger', config.assetsUrl + '/finger.json')
        .add('bonus_hp', config.assetsUrl + '/bonus_hp.png')
        .add('pixel', 'https://files.trendsurfers.ru/fonts/high_pixel-7.ttf')
        .load();
    loader.onComplete.add(onLoad);
    // loader.onProgress.add(console.log);
};
