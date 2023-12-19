import { FC, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import React from 'react';

import { Modal } from '../components/modal/modal.tsx';
import {pixi} from '../engine/pixi.ts'
import { Bosses, opened } from '../engine/pixi-ticker.ts';
import copy from '../copy/onboarding-copy.json';

import { Modals } from './modals.ts';

export const FeatureModal: FC = (): JSX.Element => {
    const [disabled, setDisabled] = useState<number>(Date.now() + 1000);
    useEffect(() => {
        setTimeout(() => {
            setDisabled(0);
        }, disabled - Date.now());
    }, [disabled]);
    const navigate = useNavigate();
    const [stage, setStage] = useState<number>(0);

    useEffect(() => {
        pixi.stop();
    }, []);

    const onboardingBossName = opened.bosses[
        opened.bosses.length - 1
    ] as Bosses;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const bossCopy = copy[onboardingBossName];
    if (!bossCopy) return <Navigate to="/" />;
    const next = (): void => {
        if (stage + 1 >= bossCopy.features.length) {
            navigate('/');
            pixi.start();
        } else {
            setStage((prevState) => prevState + 1);
        }
    };

    return (
        <Modal id={Modals.feature} header={bossCopy.features_header}>
            <p
                dangerouslySetInnerHTML={{
                    __html: bossCopy.features[stage]
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
