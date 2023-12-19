import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import React from 'react';

import { Modal } from '../components/modal/modal.tsx';

import { Modals } from './modals.ts';

import '../styles/rating.scss';

export type User = {
    isFirst: boolean;
    time: number;
    user: {
        id: number;
        firstName: string;
        lastName: string;
        username?: string;
    };
};

export const RatingModal: FC = (): JSX.Element => {
    const [userList, setUserList] = useState<User[]>();
    const navigate = useNavigate();
    const location = useLocation();
    const next = (): void => {
        navigate('/' + Modals.onBoarding, {
            state: {
                modal: location
            }
        });
    };

    useEffect(() => {
        fetch('https://avito-tg-game.trendsurfers.ru/api/leaderboard', {
            headers: {
                Authorization:
                    window.Telegram.WebApp.initData ||
                    'query_id=AAFhOC5QAAAAAGE4LlBrJyec&user=%7B%22id%22%3A1345206369%2C%22first_name%22%3A%22%D0%94%D0%B0%D0%BD%D1%8F%22%2C%22last_name%22%3A%22%D0%A0%D1%83%D0%B1%D1%86%D0%BE%D0%B2%22%2C%22username%22%3A%22danyarubtsov%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%7D&auth_date=1661875476&hash=671d585234f2ffd92379a4a54dd66a05c9608f445e98fced0fba9ed225d4035d'
            }
        }).then(async (result) => {
            const { data } = await result.json();
            setUserList(data as User[]);
        });
    }, []);

    return (
        <Modal id={Modals.rating} header={'Рейтинг'}>
            <div className="Rating__userList">
                {!userList ? (
                    <p>Загрузка...</p>
                ) : (
                    userList.map((item, index) => {
                        if (item.isFirst)
                            return (
                                <div
                                    key={item.user.id}
                                    className="Rating__user Rating__firstUser"
                                >
                                    <div className="User__images">
                                        <div className="User__star">
                                            {index}
                                        </div>
                                        <div className="User__avatar" />
                                    </div>
                                    <div className="User__info">
                                        <p className="FirstUser__header">
                                            Первопроходец
                                        </p>
                                        <p className="User__firstName">
                                            {item.user.firstName}
                                        </p>
                                    </div>
                                </div>
                            );
                        else
                            return (
                                <div
                                    className="Rating__user"
                                    key={item.user.id}
                                >
                                    <div className="User__images">
                                        <div className="User__star">
                                            {index}
                                        </div>
                                        <div className="User__avatar" />
                                    </div>
                                    <div className="User__info">
                                        <p className="User__firstName">
                                            {item.user.firstName}
                                        </p>
                                        <p className="User__time">
                                            {Math.floor(item.time / 3600)}:
                                            {Math.floor(
                                                Math.floor(item.time % 3600) /
                                                    60
                                            )}
                                        </p>
                                    </div>
                                </div>
                            );
                    })
                )}
            </div>
            <div className="Modal__actions">
                <button className="Button--blue" onClick={next}>
                    Играть
                </button>
            </div>
        </Modal>
    );
};
