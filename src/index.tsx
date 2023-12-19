import { Telegram } from '@twa-dev/types';
import { createRoot } from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';

import { App } from './App.tsx';

import './styles/normalize.scss';
import './styles/game.scss';

import 'core-js/actual/array/from';
import 'core-js/actual/array/group';
import 'core-js/actual/set';
import 'core-js/actual/promise';
import 'core-js/actual/structured-clone';
import 'core-js/actual/queue-microtask';
import 'core-js/actual/array/at';
import React from 'react';

createRoot(document.getElementById('root') as HTMLDivElement).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);

declare global {
    interface Window {
        Telegram: Telegram;
    }
}