import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import React from 'react';

import { Modal } from '../components/modal/modal.tsx';
import {pixi} from '../engine/pixi.ts';
import {diamonds} from '../engine/pixi-ticker.ts'

import { Modals } from './modals.ts';

export const OnboardingEndModal: FC = (): JSX.Element => {
    const [disabled, setDisabled] = useState<number>(Date.now() + 1000);
    useEffect(() => {
        setTimeout(() => {
            setDisabled(0);
        }, disabled - Date.now());
    }, [disabled]);
    if (diamonds > 2) {
        fetch('https://avito-tg-game.trendsurfers.ru/api/game/promocode', {
            headers: {
                Authorization: window.Telegram.WebApp.initData
            }
        });
    }
    const navigate = useNavigate();

    const next = (): void => {
        navigate('/');
        pixi.start();
    };

    const text =
        diamonds < 2
            ? 'Поздравляю! Ты освободил мир Avito SafeRunner от проделок хитрых существ. Отправляйся использовать новые знания на Авито и покупай безопасно. Продолжай сражаться с монстрами, чтобы забраться в рейтинге игроков выше.'
            : 'Поздравляю! Ты освободил мир Avito SafeRunner от проделок хитрых существ. Отправляйся использовать новые знания на Авито и покупай безопасно. Продолжай сражаться с монстрами, чтобы забраться в рейтинге игроков выше.';
    return (
        <Modal id={Modals.onBoardingEnd} header={'Долина героев'}>
            <p dangerouslySetInnerHTML={{ __html: text }} />
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
