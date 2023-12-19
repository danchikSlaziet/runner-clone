import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Modal } from '../components/modal/modal.tsx';
import { Pages } from '../pages/pages.ts';

import { Modals } from './modals.ts';
import React from 'react';

export const RatingOnboardingModal: FC = (): JSX.Element => {
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
        navigate('/' + Modals.rating, {
            state: {
                modal: location
            }
        });
    };

    return (
        <Modal id={Modals.ratingOnBoarding} header={'Рейтинг'}>
            <p>
                Все путешественники по&nbsp;миру Avito SafeRunner будут приятно
                вознаграждены и&nbsp;проведут время с&nbsp;пользой. Поспеши
                в&nbsp;захватывающее приключение!
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
