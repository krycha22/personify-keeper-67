
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Frown, Smile, Brain, Heart, Coffee, AlertTriangle, Activity } from 'lucide-react';

export type TagType = 
  | 'mental-health' 
  | 'physical-health' 
  | 'emotional-support' 
  | 'medical-condition' 
  | 'special-care' 
  | 'allergy'
  | 'energy-level';

interface TagDefinition {
  label: string;
  icon: React.ReactNode;
  className: string;
}

export const tagDefinitions: Record<TagType, TagDefinition> = {
  'mental-health': {
    label: 'Mental Health',
    icon: <Brain className="h-3 w-3 mr-1" />,
    className: 'bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200'
  },
  'physical-health': {
    label: 'Physical Health',
    icon: <Activity className="h-3 w-3 mr-1" />,
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200'
  },
  'emotional-support': {
    label: 'Emotional Support',
    icon: <Heart className="h-3 w-3 mr-1" />,
    className: 'bg-pink-100 text-pink-800 hover:bg-pink-200 border-pink-200'
  },
  'medical-condition': {
    label: 'Medical Condition',
    icon: <AlertTriangle className="h-3 w-3 mr-1" />,
    className: 'bg-red-100 text-red-800 hover:bg-red-200 border-red-200'
  },
  'special-care': {
    label: 'Special Care',
    icon: <Smile className="h-3 w-3 mr-1" />,
    className: 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200'
  },
  'allergy': {
    label: 'Allergy',
    icon: <Frown className="h-3 w-3 mr-1" />,
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200'
  },
  'energy-level': {
    label: 'Energy Level',
    icon: <Coffee className="h-3 w-3 mr-1" />,
    className: 'bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200'
  }
};

interface PersonTagProps {
  type: TagType;
  customLabel?: string;
  onClick?: () => void;
}

const PersonTag: React.FC<PersonTagProps> = ({ 
  type, 
  customLabel,
  onClick 
}) => {
  const tagDefinition = tagDefinitions[type];
  
  return (
    <Badge 
      variant="outline" 
      className={cn("flex items-center text-xs px-2 py-1 rounded-full font-medium", tagDefinition.className)}
      onClick={onClick}
    >
      {tagDefinition.icon}
      <span>{customLabel || tagDefinition.label}</span>
    </Badge>
  );
};

export default PersonTag;
