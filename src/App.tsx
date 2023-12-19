import type { FC } from 'react';
import React from 'react';

import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { loadPixiEngine } from './engine/pixi.ts';
import {BossModal} from './modals/boss-modal.tsx';
import {DamageModal} from './modals/damage-modal.tsx';
import {DiamondsModal} from './modals/diamonds-modal.tsx';
import {FeatureModal} from './modals/feature-modal.tsx';
import {Modals} from './modals/modals.ts';
import {OnboardingEndModal} from './modals/onboarding-end-modal.tsx';
import {OnboardingModal} from './modals/onboarding-modal.tsx';
import {PickModal} from './modals/avatar-modal.tsx';
import {RatingModal} from './modals/rating-modal.tsx';
import {RatingOnboardingModal} from './modals/rating-onboarding-modal.tsx';
import {RulesModal} from './modals/rules-modal.tsx';
import {Pages} from './pages/pages.ts';
import {StartPage} from './pages/start-page.tsx';

export const App: FC = (): JSX.Element => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        navigate(Pages.start, {
            state: {
                page: location
            }
        });

        window.addEventListener('modal', (event) => {
            navigate((event as CustomEvent).detail as Modals, {
                state: {
                    modal: location
                }
            });
        });

        loadPixiEngine();
    }, []);

    const state = location.state as { modal?: Location; page?: Location };
    return (
        <>
            <Routes location={state?.modal || state?.page || location}>
                <Route path="*" element={<div className="Game" id="Game" />} />
            </Routes>
            {state?.modal && (
                <Routes>
                    <Route
                        path={'/' + Modals.onBoarding}
                        element={<OnboardingModal />}
                    />
                    <Route path={'/' + Modals.rules} element={<RulesModal />} />
                    <Route
                        path={'/' + Modals.pickAvatar}
                        element={<PickModal />}
                    />
                    <Route
                        path={'/' + Modals.feature}
                        element={<FeatureModal />}
                    />
                    <Route path={'/' + Modals.boss} element={<BossModal />} />
                    <Route
                        path={'/' + Modals.damage}
                        element={<DamageModal />}
                    />
                    <Route
                        path={'/' + Modals.ratingOnBoarding}
                        element={<RatingOnboardingModal />}
                    />
                    <Route
                        path={'/' + Modals.rating}
                        element={<RatingModal />}
                    />
                    <Route
                        path={'/' + Modals.onBoardingEnd}
                        element={<OnboardingEndModal />}
                    />
                    <Route
                        path={'/' + Modals.diamonds}
                        element={<DiamondsModal />}
                    />
                </Routes>
            )}
            {state?.page && (
                <Routes>
                    <Route path={'/' + Pages.start} element={<StartPage />} />
                </Routes>
            )}
        </>
    );
};
