import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import React from 'react';

import logo from '../assets/img/logo.png';
import { Modal } from '../components/modal/modal.tsx';
import { Pages } from '../pages/pages.ts';

import { Modals } from './modals.ts';

export const OnboardingModal: FC = (): JSX.Element => {
    const [disabled, setDisabled] = useState<number>(Date.now() + 1000);
    useEffect(() => {
        setTimeout(() => {
            setDisabled(0);
        }, disabled - Date.now());
    }, [disabled]);
    const navigate = useNavigate();
    const location = useLocation();

    const back = (): void => {
        navigate('/' + Pages.start, {
            state: {
                page: location
            }
        });
    };

    const next = (): void => {
        navigate('/' + Modals.rules, {
            state: {
                modal: location
            }
        });
    };

    return (
        <Modal id={Modals.onBoarding} header={'Об игре'}>
            <p>
                Добро пожаловать в<br />
                <img className="Page__logo" alt="логотип" src={logo} />
                <br />
                Ты&nbsp;готов освободить местных жителей от&nbsp;гнёта
                пронырливого Агрозвона, терпеливого Бедождуна и&nbsp;других
                злодеев? Мы&nbsp;рассчитываем на&nbsp;тебя!
            </p>
            <div className="Modal__actions">
                <button className="Button--white" onClick={back}>
                    Назад
                </button>
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
