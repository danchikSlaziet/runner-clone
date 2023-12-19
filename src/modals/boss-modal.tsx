import { FC, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { Modal } from '../components/modal/modal.tsx';
import {Bosses} from '../engine/pixi-ticker.ts';
import { finger } from '../engine/pixi-onload.ts';
import { level } from '../engine/pixi-ticker.ts';
import { onboarding } from '../engine/pixi-ticker.ts';
import { opened } from '../engine/pixi-ticker.ts';
import { pixi } from '../engine/pixi.ts';
import copy from '../copy/onboarding-copy.json';

import { Modals } from './modals.ts';

export const BossModal: FC = (): JSX.Element => {
    const [disabled, setDisabled] = useState<number>(Date.now() + 1000);
    useEffect(() => {
        setTimeout(() => {
            setDisabled(0);
        }, disabled - Date.now());
    }, [disabled]);
    const navigate = useNavigate();

    useEffect(() => {
        pixi.stop();
        return () => {
            if (onboarding.is && level === 1 && finger) {
                finger.alpha = 1;
            }
        };
    }, []);

    const onboardingBossName = opened.bosses[
        opened.bosses.length - 1
    ] as Bosses;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const bossCopy = copy[onboardingBossName];
    if (!bossCopy) return <Navigate to="/" />;
    const next = (): void => {
        navigate('/');
        pixi.start();
    };

    return (
        <Modal id={Modals.boss} header={bossCopy.monster_header}>
            <p
                dangerouslySetInnerHTML={{
                    __html: bossCopy.start
                }}
            />
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
