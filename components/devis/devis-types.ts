export type ZoneId =
  | "salon" | "sam" | "cuisine" | "vestibule" | "wc" | "sdb"
  | "chambre1" | "chambre2" | "garage"
  | "terrasse" | "jardin" | "haie" | "facades" | "toiture";

export interface WorkItem {
  id: string;
  label: string;
}

export interface ZoneConfig {
  id: ZoneId;
  label: string;
  category: "interieur" | "exterieur";
  workItems: WorkItem[];
  bounds: { x: number; y: number; w: number; h: number };
  camera3D: { position: [number, number, number]; target: [number, number, number] };
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
}

export type BudgetRange = "< 5000" | "5000-15000" | "15000-30000" | "30000-50000" | "> 50000";

export type DevisView = "global" | "zoomed" | "recap" | "success";

export interface DevisState {
  view: DevisView;
  activeZone: ZoneId | null;
  selectedWorks: Record<ZoneId, string[]>;
  budget: BudgetRange | null;
  message: string;
  contact: ContactInfo;
  isSubmitting: boolean;
  error: string | null;
}

export type DevisAction =
  | { type: "ZOOM_ZONE"; zone: ZoneId }
  | { type: "ZOOM_OUT" }
  | { type: "SHOW_RECAP" }
  | { type: "TOGGLE_WORK"; zone: ZoneId; workId: string }
  | { type: "SET_BUDGET"; budget: BudgetRange | null }
  | { type: "SET_MESSAGE"; message: string }
  | { type: "SET_CONTACT"; field: keyof ContactInfo; value: string }
  | { type: "SET_SUBMITTING"; isSubmitting: boolean }
  | { type: "SET_SUCCESS" }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "RESET" };
