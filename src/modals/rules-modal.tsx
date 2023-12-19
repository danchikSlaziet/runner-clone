import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import React from 'react';

import diamonds from '../assets/img/diamonds.png';
import hp from '../assets/img/hp_2.png';
import { Modal } from '../components/modal/modal.tsx';

import { Modals } from './modals.ts';

export const RulesModal: FC = (): JSX.Element => {
    const [disabled, setDisabled] = useState<number>(Date.now() + 1000);
    useEffect(() => {
        setTimeout(() => {
            setDisabled(0);
        }, disabled - Date.now());
    }, [disabled]);
    const navigate = useNavigate();
    const location = useLocation();

    const back = (): void => {
        navigate('/' + Modals.onBoarding, {
            state: {
                modal: location
            }
        });
    };

    const next = (): void => {
        navigate('/' + Modals.pickAvatar, {
            state: {
                modal: location
            }
        });
    };
    return (
        <Modal id={Modals.rules} header={'Правила'}>
            <p>
                У&nbsp;тебя есть 2 жизни для&nbsp;прохождения сложного
                приключения.
                <br />
                <img className="Page__logo Modal__hp" alt="логотип" src={hp} />
                <br />
                Собирай кристаллы, чтобы&nbsp;улучшать свои навыки.
                <img
                    className="Page__logo Modal__diamonds"
                    alt="логотип"
                    src={diamonds}
                />
            </p>
            <div className="Modal__actions">
                <button className="Button--white" onClick={back}>
                    Назад
                </button>
                <button
                    onClick={next}
                    className="Button--blue"
                    disabled={disabled > Date.now()}
                >
                    Далее
                </button>
            </div>
        </Modal>
    );
};
