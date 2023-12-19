import React from 'react';
import type { FC } from 'react';
import './style.scss';
import { getClassNames } from '../../utils/get-class-names.ts';

type PageProps = {
    id: string;
};

export const Page: FC<PageProps> = ({ children, id }): JSX.Element => {
    return (
        <div className={getClassNames('Page', 'Page--' + id)}>
            <div className="Page__content">{children}</div>
        </div>
    );
};
