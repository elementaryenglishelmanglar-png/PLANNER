import React from 'react';
import { TimelineEvent } from '../../../types';

interface Style5ColorCardsProps {
    data: TimelineEvent[];
}

const colors = [
    'bg-yellow-100 border-yellow-300', 'bg-blue-100 border-blue-300', 'bg-green-100 border-green-300',
    'bg-red-100 border-red-300', 'bg-indigo-100 border-indigo-300', 'bg-pink-100 border-pink-300',
    'bg-purple-100 border-purple-300', 'bg-teal-100 border-teal-300', 'bg-orange-100 border-orange-300'
];

export const Style5ColorCards: React.FC<Style5ColorCardsProps> = ({ data }) => {
    return (
        <div className="flex overflow-x-auto p-4 space-x-4">
            {data.map((event, index) => (
                <div key={index} className={`relative flex-shrink-0 w-60 p-4 rounded-lg border-t-4 ${colors[index % colors.length]}`}>
                    <div className="absolute -top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-white border-2 border-gray-300 font-bold text-gray-600">
                        {index + 1}
                    </div>
                    <div className="mt-4">
                        <p className="text-sm font-bold text-gray-800">{event.date}</p>
                        <h3 className="text-md font-semibold my-1">{event.title}</h3>
                        <p className="text-xs text-gray-600">{event.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};
