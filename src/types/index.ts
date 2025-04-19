
export type Plan = 'free' | 'monthly' | 'yearly';

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  parkingSpaces: number;
  type: 'apartment' | 'house' | 'commercial' | 'land';
  status: 'forSale' | 'forRent' | 'sold' | 'rented';
  images: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  budget: number;
  preferredLocation: string;
  propertyType: string[];
  leadScore: number;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted';
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  companyName?: string;
  companyLogo?: string;
  plan: Plan;
  properties: Property[];
  leads: Lead[];
  createdAt: string;
  updatedAt: string;
}

export interface PlanFeature {
  id: string;
  title: string;
  description: string;
  includedIn: Plan[];
}

export interface PlanDetails {
  id: Plan;
  name: string;
  price: number;
  period: 'monthly' | 'yearly' | 'free';
  features: PlanFeature[];
  highlightedFeature?: string;
  maxProperties: number;
  maxProposals: number;
  supportsLeadScoring: boolean;
  supportsPdfExport: boolean;
}
