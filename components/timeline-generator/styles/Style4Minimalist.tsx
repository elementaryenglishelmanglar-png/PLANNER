import React from 'react';
import { TimelineEvent } from '../../../types';

interface Style4MinimalistProps {
    data: TimelineEvent[];
}

export const Style4Minimalist: React.FC<Style4MinimalistProps> = ({ data }) => {
    return (
        <div className="p-10">
            <div className="relative">
                {/* Horizontal line */}
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-300"></div>
                
                <div className="flex justify-between">
                    {data.map((event, index) => (
                        <div key={index} className="relative flex-1 px-2 text-center">
                            {/* Dot on the line */}
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-500 rounded-full border-2 border-white"></div>
                            <div className="mt-8">
                                <p className="text-xs font-bold text-gray-500">{event.date}</p>
                                <h3 className="text-sm font-semibold mt-1">{event.title}</h3>
                                <p className="text-xs text-gray-500 mt-1 hidden md:block">{event.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
