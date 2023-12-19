import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Modal } from '../components/modal/modal.tsx';
import {pixi} from '../engine/pixi.ts';
import {diamonds} from '../engine/pixi-ticker.ts';
import { diamondsContainer } from '../engine/pixi-onload.ts';

import { Modals } from './modals.ts';

export const DiamondsModal: FC = (): JSX.Element => {
    const [disabled, setDisabled] = useState<number>(Date.now() + 1000);
    useEffect(() => {
        setTimeout(() => {
            setDisabled(0);
        }, disabled - Date.now());
        pixi.stop();
    }, [disabled]);

    const navigate = useNavigate();

    const next = (): void => {
        navigate('/');
        pixi.start();
        diamondsContainer.children[0].y = pixi.screen.height * 2;
    };

    const copy =
        diamonds < 2
            ? 'Поздравляю! Ты освободил мир Avito SafeRunner от проделок хитрых существ. Отправляйся использовать новые знания на Авито и покупай безопасно. Продолжай сражаться с монстрами, чтобы забраться в рейтинге игроков выше.'
            : 'Поздравляю! Ты освободил мир Avito SafeRunner от проделок хитрых существ. Отправляйся использовать новые знания на Авито и покупай безопасно. Продолжай сражаться с монстрами, чтобы забраться в рейтинге игроков выше.';
    return (
        <Modal id={Modals.onBoardingEnd} header={'Долина героев'}>
            <p dangerouslySetInnerHTML={{ __html: copy }} />
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
