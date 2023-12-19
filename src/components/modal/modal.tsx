import type { FC } from 'react';
import React from 'react';

import { getClassNames } from '../../utils/get-class-names.ts';

import './style.scss';

type ModalProps = {
    id: string;
    closeAction?: () => void;
    header: string;
};

export const Modal: FC<ModalProps> = ({
    children,
    id,
    header
}): JSX.Element => {
    return (
        <div className={getClassNames('Modal', 'Modal--' + id)}>
            <div className="Modal__content">
                <div className="Modal__header">
                    <p dangerouslySetInnerHTML={{ __html: header }} />
                    <p dangerouslySetInnerHTML={{ __html: header }} />
                    <p dangerouslySetInnerHTML={{ __html: header }} />
                </div>
                {children}
            </div>
        </div>
    );
};
