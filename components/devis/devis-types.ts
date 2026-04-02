export type ZoneId =
  | "cuisine"
  | "salle-de-bain"
  | "facade"
  | "toit"
  | "garage"
  | "exterieur";

export interface ZoneConfig {
  id: ZoneId;
  label: string;
  icon: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  problems: ProblemOption[];
  renovationOptions: RenovationOption[];
}

export interface ProblemOption {
  id: string;
  label: string;
  position3D: [number, number, number];
}

export interface RenovationOption {
  id: string;
  label: string;
  description: string;
}

export type BudgetRange =
  | "< 5000"
  | "5000-15000"
  | "15000-30000"
  | "30000-50000"
  | "> 50000";

export interface ContactInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
}

export interface DevisFormState {
  currentStep: number;
  selectedZones: ZoneId[];
  activeZone: ZoneId | null;
  problems: Record<ZoneId, string[]>;
  renovationOptions: Record<ZoneId, string[]>;
  surface: number | null;
  budget: BudgetRange | null;
  message: string;
  photos: File[];
  contact: ContactInfo;
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
}

export type DevisAction =
  | { type: "SET_STEP"; step: number }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "TOGGLE_ZONE"; zone: ZoneId }
  | { type: "SET_ACTIVE_ZONE"; zone: ZoneId | null }
  | { type: "TOGGLE_PROBLEM"; zone: ZoneId; problemId: string }
  | { type: "TOGGLE_RENOVATION_OPTION"; zone: ZoneId; optionId: string }
  | { type: "SET_SURFACE"; surface: number | null }
  | { type: "SET_BUDGET"; budget: BudgetRange | null }
  | { type: "SET_MESSAGE"; message: string }
  | { type: "ADD_PHOTOS"; files: File[] }
  | { type: "REMOVE_PHOTO"; index: number }
  | { type: "SET_CONTACT"; field: keyof ContactInfo; value: string }
  | { type: "SET_SUBMITTING"; isSubmitting: boolean }
  | { type: "SET_SUBMITTED" }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "RESET" };

export const TOTAL_STEPS = 6;
