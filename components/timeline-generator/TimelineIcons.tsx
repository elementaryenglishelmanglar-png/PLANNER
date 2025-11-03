import React from 'react';
import {
  FlagIcon,
  AtomIcon,
  BalanceIcon,
  BuildingIcon,
  WarIcon,
} from '../icons/TimelineMiscIcons';
import { BookOpenIcon } from '../icons/BookOpenIcon';
import { GlobeIcon } from '../icons/GlobeIcon';
import { SparklesIcon } from '../icons/SparklesIcon';


const iconMap: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  default: SparklesIcon,
  politics: FlagIcon,
  war: WarIcon,
  conflict: WarIcon,
  discovery: GlobeIcon,
  science: AtomIcon,
  art: SparklesIcon,
  literature: BookOpenIcon,
  law: BalanceIcon,
  society: BuildingIcon,
  treaty: BalanceIcon,
  atom: AtomIcon,
};

interface TimelineIconMapperProps {
  iconName: string;
  className?: string;
}

export const TimelineIconMapper: React.FC<TimelineIconMapperProps> = ({ iconName, className }) => {
  const key = (iconName || '').toLowerCase();
  const IconComponent = iconMap[key] || iconMap.default;
  return <IconComponent className={className} />;
};