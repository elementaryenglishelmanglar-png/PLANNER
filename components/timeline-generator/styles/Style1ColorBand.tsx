import React from 'react';
import { TimelineEvent } from '../../../types';
import { TimelineIconMapper } from '../TimelineIcons';

interface Style1ColorBandProps {
    data: TimelineEvent[];
}

const colors = [
    'bg-blue-500', 'bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-purple-500',
    'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-orange-500'
];

export const Style1ColorBand: React.FC<Style1ColorBandProps> = ({ data }) => {
    return (
        <div className="flex overflow-x-auto p-4 space-x-4">
            {data.map((event, index) => (
                <div key={index} className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md overflow-hidden">
                    <div className={`p-4 text-white ${colors[index % colors.length]}`}>
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold">{event.title}</h3>
                            <TimelineIconMapper iconName={event.icon} className="w-6 h-6" />
                        </div>
                        <p className="text-2xl font-black mt-2">{event.date}</p>
                    </div>
                    <div className="p-4">
                        <p className="text-sm text-gray-600">{event.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};
