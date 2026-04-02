import { ComponentType } from 'react';
import KitchenScene from './KitchenScene';
import BathroomScene from './BathroomScene';
import ElectricityScene from './ElectricityScene';
import PlumbingScene from './PlumbingScene';
import TilingScene from './TilingScene';
import FacadeScene from './FacadeScene';
import LandscapeScene from './LandscapeScene';
import PaintScene from './PaintScene';
import ChargingScene from './ChargingScene';
import SolarScene from './SolarScene';

export interface SceneConfig {
  component: ComponentType<{ progress: number }>;
  title: string;
  ruinLabel: string;
  renovatedLabel: string;
  fallbackImage: string;
}

export const SCENE_MAP: Record<string, SceneConfig> = {
  cuisine: {
    component: KitchenScene,
    title: 'Cuisine',
    ruinLabel: 'Vieille cuisine',
    renovatedLabel: 'Cuisine moderne',
    fallbackImage: '/images/fallback/cuisine.svg',
  },
  'salle-de-bain': {
    component: BathroomScene,
    title: 'Salle de bain',
    ruinLabel: 'Carrelage cassé',
    renovatedLabel: 'Salle de bain design',
    fallbackImage: '/images/fallback/salle-de-bain.svg',
  },
  electricite: {
    component: ElectricityScene,
    title: 'Électricité',
    ruinLabel: 'Fils apparents',
    renovatedLabel: 'Installation aux normes',
    fallbackImage: '/images/fallback/electricite.svg',
  },
  plomberie: {
    component: PlumbingScene,
    title: 'Plomberie',
    ruinLabel: 'Tuyaux rouillés',
    renovatedLabel: 'Tuyauterie neuve',
    fallbackImage: '/images/fallback/plomberie.svg',
  },
  carrelage: {
    component: TilingScene,
    title: 'Carrelage',
    ruinLabel: 'Sol abîmé',
    renovatedLabel: 'Carrelage posé',
    fallbackImage: '/images/fallback/carrelage.svg',
  },
  'facade-isolation': {
    component: FacadeScene,
    title: 'Façade & Isolation',
    ruinLabel: 'Mur décrépi',
    renovatedLabel: 'Façade isolée',
    fallbackImage: '/images/fallback/facade-isolation.svg',
  },
  paysager: {
    component: LandscapeScene,
    title: 'Aménagement paysager',
    ruinLabel: 'Terrain en friche',
    renovatedLabel: 'Jardin aménagé',
    fallbackImage: '/images/fallback/paysager.svg',
  },
  peinture: {
    component: PaintScene,
    title: 'Peinture',
    ruinLabel: 'Murs bruts',
    renovatedLabel: 'Finitions parfaites',
    fallbackImage: '/images/fallback/peinture.svg',
  },
  'borne-recharge': {
    component: ChargingScene,
    title: 'Borne de recharge',
    ruinLabel: 'Garage vide',
    renovatedLabel: 'Borne installée',
    fallbackImage: '/images/fallback/borne-recharge.svg',
  },
  photovoltaique: {
    component: SolarScene,
    title: 'Photovoltaïque',
    ruinLabel: 'Toit nu',
    renovatedLabel: 'Panneaux solaires',
    fallbackImage: '/images/fallback/photovoltaique.svg',
  },
};

/** Les 3 scènes phares pour la page d'accueil */
export const HERO_SCENES = ['cuisine', 'facade-isolation', 'paysager'] as const;
