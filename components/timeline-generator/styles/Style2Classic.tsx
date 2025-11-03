import React from 'react';
import { TimelineEvent } from '../../../types';

interface Style2ClassicProps {
    data: TimelineEvent[];
}

export const Style2Classic: React.FC<Style2ClassicProps> = ({ data }) => {
    return (
        <div className="relative p-10">
            {/* Central line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-300"></div>

            {data.map((event, index) => (
                <div key={index} className={`flex items-center w-full mb-8 ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                    <div className="w-1/2"></div>
                    <div className="relative w-1/2 px-8">
                        {/* Dot on the line */}
                        <div className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-blue-500 border-4 border-white" style={index % 2 === 0 ? { right: '-8px' } : { left: '-8px' }}></div>
                        
                        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                            <p className="text-sm font-semibold text-blue-600">{event.date}</p>
                            <h3 className="text-md font-bold my-1">{event.title}</h3>
                            <p className="text-xs text-gray-600 mb-2">{event.description}</p>
                            <span className="text-xs font-semibold bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{event.category}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
