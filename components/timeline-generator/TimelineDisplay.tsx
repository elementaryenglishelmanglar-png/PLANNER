import React from 'react';
import { TimelineEvent } from '../../types';
import { Style1ColorBand } from './styles/Style1ColorBand';
import { Style2Classic } from './styles/Style2Classic';
import { Style3Modern } from './styles/Style3Modern';
import { Style4Minimalist } from './styles/Style4Minimalist';
import { Style5ColorCards } from './styles/Style5ColorCards';
import { Style6Circular } from './styles/Style6Circular';

interface TimelineDisplayProps {
    data: TimelineEvent[];
    style: string;
}

export const TimelineDisplay: React.FC<TimelineDisplayProps> = ({ data, style }) => {
    switch (style) {
        case 'Estilo 1 (Banda de Color)':
            return <Style1ColorBand data={data} />;
        case 'Estilo 2 (Clásico)':
            return <Style2Classic data={data} />;
        case 'Estilo 3 (Moderno)':
            return <Style3Modern data={data} />;
        case 'Estilo 4 (Minimalista)':
            return <Style4Minimalist data={data} />;
        case 'Estilo 5 (Tarjetas Coloridas)':
            return <Style5ColorCards data={data} />;
        case 'Estilo 6 (Circular Alternado)':
            return <Style6Circular data={data} />;
        default:
            return <Style1ColorBand data={data} />;
    }
};
