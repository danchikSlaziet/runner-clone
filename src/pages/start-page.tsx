import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import React from 'react';

import loading from '../assets/gif/loading.gif';
import logo from '../assets/img/logo.png';
import npc from '../assets/img/pers_start.png';
import { Page } from '../components/page/page.tsx';
import {pixi, loader} from '../engine/pixi.ts';
import { Modals } from '../modals/modals.ts';

import { Pages } from './pages.ts';

export const StartPage: FC = (): JSX.Element => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoaded, setLoaded] = useState<boolean>(loader.progress === 100);
    const isMobile = window.matchMedia('(orientation: portrait)').matches;

    useEffect(() => {
        pixi.stop();
        window.addEventListener('loaded', () => {
            setTimeout(() => {
                setLoaded(true);
            }, 500);
        });
    }, []);

    const startGame = (): void => {
        navigate('/' + Modals.onBoarding, {
            state: {
                modal: location
            }
        });
    };

    const openRating = (): void => {
        navigate('/' + Modals.ratingOnBoarding, {
            state: {
                modal: location
            }
        });
    };

    return (
        <Page id={Pages.start}>
            <img
                className="Page__logo"
                alt="логотип"
                src={logo}
            />
            {isLoaded ? (
                <div className="Page__actions">
                    <button onClick={startGame} className="Button--blue">
                        Играть
                    </button>
                    <button onClick={openRating} className="Button--white">
                        Рейтинг
                    </button>
                </div>
            ) : (
                <img
                    className="Page__loading"
                    alt="прогресс загрузки"
                    src={loading}
                />
            )}
            <img
                className="Page__npc"
                alt="персонажи"
                src={npc}
            />
        </Page>
    );
};
