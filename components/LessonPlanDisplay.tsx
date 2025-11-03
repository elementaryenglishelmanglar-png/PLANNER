import React, { useMemo } from 'react';

interface LessonPlanDisplayProps {
  plan: string;
}

const renderInlineFormatting = (text: string): React.ReactNode => {
    // This function handles **bold** text within a line.
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        return part;
    });
};

const H2_KEYWORDS = ["objetivos", "materiales", "procedimiento", "actividades", "recursos", "evaluación"];

export const LessonPlanDisplay: React.FC<LessonPlanDisplayProps> = ({ plan }) => {
    
    const formattedPlan = useMemo(() => {
        const elements: React.ReactNode[] = [];
        const cleanedPlan = plan.replace(/\uFEFF/g, '').replace(/\r\n/g, '\n');
        const lines = cleanedPlan.split('\n');
        
        let listItems: string[] = [];
        let inList = false;
        let hasEncounteredH1 = false;

        const closeList = () => {
            if (inList && listItems.length > 0) {
                elements.push(
                    <ul key={`ul-${elements.length}`} className="list-disc pl-6 md:pl-8 space-y-2 mb-4">
                        {listItems.map((item, i) => (
                            <li key={i}>{renderInlineFormatting(item)}</li>
                        ))}
                    </ul>
                );
            }
            listItems = [];
            inList = false;
        };

        lines.forEach((line, index) => {
            const trimmedLine = line.trim();

            if (trimmedLine.startsWith('* ')) {
                if (!inList) {
                    inList = true;
                }
                listItems.push(trimmedLine.substring(2));
            } else {
                closeList();
                
                const h1Class = "text-3xl font-extrabold mt-8 mb-4 pb-2 border-b-2 border-manglar-green/20";
                const h2Class = "text-2xl font-bold mt-6 mb-3 text-manglar-green";
                const h3Class = "text-xl font-semibold mt-4 mb-2";
                const h4Class = "text-lg font-semibold mt-4 mb-2 text-gray-800";

                if (trimmedLine.startsWith('# ')) {
                    elements.push(<h1 key={index} className={h1Class}>{renderInlineFormatting(trimmedLine.substring(2))}</h1>);
                    hasEncounteredH1 = true;
                } else if (trimmedLine.startsWith('## ')) {
                    elements.push(<h2 key={index} className={h2Class}>{renderInlineFormatting(trimmedLine.substring(3))}</h2>);
                } else if (trimmedLine.startsWith('### ')) {
                    elements.push(<h3 key={index} className={h3Class}>{renderInlineFormatting(trimmedLine.substring(4))}</h3>);
                } else if (trimmedLine.startsWith('#### ')) {
                    elements.push(<h4 key={index} className={h4Class}>{renderInlineFormatting(trimmedLine.substring(5))}</h4>);
                } else if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
                    const content = trimmedLine.slice(2, -2).trim();
                    const lowerContent = content.toLowerCase();
                    
                    if (!hasEncounteredH1) {
                         elements.push(<h1 key={index} className={h1Class}>{renderInlineFormatting(content)}</h1>);
                         hasEncounteredH1 = true;
                    } else if (H2_KEYWORDS.some(keyword => lowerContent.includes(keyword))) {
                        elements.push(<h2 key={index} className={h2Class}>{renderInlineFormatting(content)}</h2>);
                    } else if (lowerContent.startsWith('lección')) {
                         elements.push(<h3 key={index} className={h3Class}>{renderInlineFormatting(content)}</h3>);
                    } else {
                         elements.push(<h2 key={index} className={h2Class}>{renderInlineFormatting(content)}</h2>);
                    }
                } else if (trimmedLine.startsWith('##') && trimmedLine.endsWith('##')) {
                    const content = trimmedLine.slice(2, -2).trim();
                    elements.push(<h2 key={index} className={h2Class}>{renderInlineFormatting(content)}</h2>);
                }
                else if (trimmedLine.match(/^-{3,}$/)) {
                     elements.push(<hr key={index} className="my-6 border-gray-200" />);
                }
                else if (trimmedLine !== '') {
                    elements.push(<p key={index} className="mb-4 leading-relaxed">{renderInlineFormatting(line)}</p>);
                }
            }
        });

        closeList(); 
        
        return elements;

    }, [plan]);

    return (
        <div className="bg-white rounded-2xl p-6 md:p-8 animate-fade-in">
            <div className="prose prose-lg max-w-none">
                {formattedPlan}
            </div>
        </div>
    );
};