import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import React from 'react';

import man from '../assets/img/man.png';
import manPick from '../assets/img/man_pick.png';
import woman from '../assets/img/woman.png';
import womanPick from '../assets/img/woman_pick.png';
import { Modal } from '../components/modal/modal.tsx';
import { changeGender } from '../engine/pixi-ticker.ts';
import { pixi } from '../engine/pixi.ts';
import { setisGameStarted } from '../engine/pixi-ticker.ts';

import { Modals } from './modals.ts';

export const PickModal: FC = (): JSX.Element => {
    const [pickedAvatar, setAvatar] = useState<0 | 1 | 2>(0);
    const navigate = useNavigate();
    const location = useLocation();

    const back = (): void => {
        navigate('/' + Modals.rules, {
            state: {
                modal: location
            }
        });
    };

    useEffect(() => {
        if (pickedAvatar !== 0) changeGender(pickedAvatar);
    }, [pickedAvatar]);

    const next = (): void => {
        navigate('/');
        setisGameStarted();
        pixi.start();
    };

    return (
        <Modal id={Modals.pickAvatar} header={'Аватар'}>
            <p>Скорее выбирай аватар для&nbsp;этого путешествия.</p>
            <div className="Modal__pickAvatar">
                <img
                    alt="мужчина"
                    src={pickedAvatar === 1 ? manPick : man}
                    onClick={() => setAvatar(1)}
                />
                <img
                    alt="мужчина"
                    src={pickedAvatar === 2 ? womanPick : woman}
                    onClick={() => setAvatar(2)}
                />
            </div>
            <div className="Modal__actions">
                <button className="Button--white" onClick={back}>
                    Назад
                </button>
                <button
                    className="Button--blue"
                    onClick={next}
                    disabled={pickedAvatar === 0}
                >
                    Далее
                </button>
            </div>
        </Modal>
    );
};
