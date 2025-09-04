import { Subject } from '@/types';

export const subjects: Subject[] = [
  {
    id: 'math',
    name: 'Mathématiques',
    description: 'Algèbre, géométrie, calculs et résolution de problèmes',
    level: 'college',
    icon: '🔢',
    color: 'bg-blue-500'
  },
  {
    id: 'sciences',
    name: 'Sciences',
    description: 'Physique, chimie, biologie et sciences de la terre',
    level: 'college',
    icon: '🔬',
    color: 'bg-green-500'
  },
  {
    id: 'francais',
    name: 'Français',
    description: 'Littérature, grammaire, orthographe et expression écrite',
    level: 'college',
    icon: '📚',
    color: 'bg-purple-500'
  },
  {
    id: 'histoire',
    name: 'Histoire',
    description: 'Événements historiques, civilisations et chronologie',
    level: 'college',
    icon: '🏛️',
    color: 'bg-amber-500'
  },
  {
    id: 'geographie',
    name: 'Géographie',
    description: 'Continents, pays, climat et géographie physique',
    level: 'college',
    icon: '🌍',
    color: 'bg-teal-500'
  },
  {
    id: 'anglais',
    name: 'Anglais',
    description: 'Vocabulaire, grammaire et compréhension anglaise',
    level: 'college',
    icon: '🇬🇧',
    color: 'bg-red-500'
  },
  {
    id: 'art',
    name: 'Arts Plastiques',
    description: 'Dessin, peinture, sculpture et histoire de l\'art',
    level: 'college',
    icon: '🎨',
    color: 'bg-pink-500'
  },
  {
    id: 'sport',
    name: 'Éducation Physique',
    description: 'Sports, santé, nutrition et activité physique',
    level: 'college',
    icon: '⚽',
    color: 'bg-orange-500'
  }
];

export const getLevelSubjects = (level: 'primaire' | 'college' | 'lycee') => {
  return subjects.filter(subject => subject.level === level);
};

export const getSubjectById = (id: string) => {
  return subjects.find(subject => subject.id === id);
};