import * as PIXI from 'pixi.js';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import React from 'react';

import { Modal } from '../components/modal/modal.tsx';
import {bossContainer} from '../engine/pixi-onload.ts';
import {gender} from '../engine/pixi-ticker.ts';
import {hero} from '../engine/pixi-onload.ts';
import {hpCount} from '../engine/pixi-ticker.ts';
import {loader} from '../engine/pixi.ts';
import {onboarding} from '../engine/pixi-ticker.ts';
import {pixi} from '../engine/pixi.ts';
import {restartGame} from '../engine/pixi-ticker.ts'

import { Modals } from './modals.ts';

export const DamageModal: FC = (): JSX.Element => {
    const [haveFirst, setHaveFirst] = useState<boolean | number>(0);
    const [disabled, setDisabled] = useState<number>(Date.now() + 1000);
    useEffect(() => {
        setTimeout(() => {
            setDisabled(0);
        }, disabled - Date.now());
        if (!hpCount) {
            const data = { training: !onboarding.is };
            fetch('https://avito-tg-game.trendsurfers.ru/api/game/finish', {
                method: 'POST',
                headers: {
                    Authorization: window.Telegram.WebApp.initData
                },
                body: JSON.stringify(data)
            });
            fetch('https://avito-tg-game.trendsurfers.ru/api/game/haveFirst', {
                method: 'GET',
                headers: {
                    Authorization: window.Telegram.WebApp.initData
                }
            }).then(async (result) => {
                const { data } = await result.json();
                setHaveFirst(data || false);
            });
        }
    }, [disabled]);
    const navigate = useNavigate();

    const next = (): void => {
        bossContainer.children[0].x =
            pixi.screen.width +
            (bossContainer.children[0] as PIXI.Sprite).width * 3;
        if (!hpCount) {
            navigate('/');
            return restartGame();
        } else {
            pixi.start();
            const textures = loader.resources['walk_' + gender].textures;
            if (!textures) return;
            hero.textures = Object.values(textures);
            hero.animationSpeed = 0.1;
            hero.rotation = 0;
            hero.play();
            return navigate('/');
        }
    };

    const copy =
        hpCount > 0
            ? {
                  header: 'Опасность',
                  text: 'Ой-ой,впредь будь осторожнее!<br />Такие события отнимают много сил.\n'
              }
            : {
                  header: 'Game over',
                  text:
                      haveFirst === 0
                          ? 'Загрузка...'
                          : haveFirst
                          ? 'Упс! Кажется, ты&nbsp;слишком устал, чтобы&nbsp;продолжать путешествие. Отдохни, а&nbsp;потом возвращайся к&nbsp;нам, чтобы&nbsp;вновь попробовать свои силы.'
                          : 'Упс! Кажется, ты&nbsp;слишком устал, чтобы&nbsp;продолжать путешествие. Отдохни, а&nbsp;потом возвращайся к&nbsp;нам, чтобы&nbsp;получить главный приз!'
              };

    return (
        <Modal id={Modals.damage} header={copy.header}>
            <p dangerouslySetInnerHTML={{ __html: copy.text }} />
            <div className="Modal__actions">
                <button
                    className="Button--blue"
                    onClick={next}
                    disabled={disabled > Date.now()}
                >
                    Далее
                </button>
            </div>
        </Modal>
    );
};
