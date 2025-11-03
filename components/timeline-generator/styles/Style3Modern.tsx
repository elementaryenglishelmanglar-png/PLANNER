import React from 'react';
import { TimelineEvent } from '../../../types';
import { TimelineIconMapper } from '../TimelineIcons';

interface Style3ModernProps {
    data: TimelineEvent[];
}

export const Style3Modern: React.FC<Style3ModernProps> = ({ data }) => {
    return (
        <div className="relative p-10">
            {/* Central line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            {data.map((event, index) => (
                <div key={index} className="relative mb-10">
                    <div className={`flex items-center ${index % 2 === 0 ? 'flex-row-reverse justify-end' : 'justify-end'}`}>
                        <div className="w-1/2">
                            <div className={`p-5 ${index % 2 === 0 ? 'mr-12' : 'ml-12'}`}>
                                <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
                                    <p className="text-xs font-bold text-gray-500">{event.date}</p>
                                    <h3 className="text-md font-bold text-gray-800 my-1">{event.title}</h3>
                                    <p className="text-sm text-gray-600">{event.description}</p>
                                    <div className="mt-2 flex justify-between items-center">
                                       <span className="text-xs font-semibold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">{event.category}</span>
                                       <a href="#" className="text-xs text-purple-600 hover:underline">Detalle</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Icon on the line */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-purple-500 text-white rounded-full z-10">
                        <TimelineIconMapper iconName={event.icon} className="w-5 h-5" />
                    </div>
                </div>
            ))}
        </div>
    );
};
