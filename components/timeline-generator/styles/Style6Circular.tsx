import React from 'react';
import { TimelineEvent } from '../../../types';
import { TimelineIconMapper } from '../TimelineIcons';

interface Style6CircularProps {
    data: TimelineEvent[];
}

const colors = [
    'bg-blue-400', 'bg-green-400', 'bg-red-400', 'bg-gray-400', 'bg-yellow-400', 
    'bg-indigo-400', 'bg-pink-400', 'bg-purple-400'
];

export const Style6Circular: React.FC<Style6CircularProps> = ({ data }) => {
    return (
        <div className="flex items-center justify-center p-10 overflow-x-auto">
            <div className="flex items-center space-x-8">
                {data.map((event, index) => (
                    <React.Fragment key={index}>
                        <div className="text-center flex flex-col items-center">
                            <div className={`relative w-48 h-48 rounded-full flex flex-col justify-center items-center p-4 text-white shadow-lg ${colors[index % colors.length]}`}>
                                <TimelineIconMapper iconName={event.icon} className="w-10 h-10 mb-2 opacity-80" />
                                <p className="text-xl font-black">{event.date}</p>
                                <h3 className="text-sm font-bold">{event.title}</h3>
                            </div>
                            <p className="mt-4 text-xs text-gray-600 w-48">{event.description}</p>
                        </div>
                        {index < data.length - 1 && (
                            <div className="self-center border-t-2 border-dashed border-gray-300 w-20"></div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};
