export type ZoneId =
  | "salon" | "sam" | "cuisine" | "vestibule" | "wc" | "sdb"
  | "chambre1" | "chambre2" | "garage"
  | "terrasse" | "jardin" | "haie" | "facades" | "toiture";

export interface WorkItem {
  id: string;
  labelKey: string;
}

export interface ZoneConfig {
  id: ZoneId;
  labelKey: string;
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
  zoneNotes: Record<ZoneId, string>;
  zonePhotos: Record<ZoneId, File[]>;
  budget: BudgetRange | null;
  magicplanLink: string;
  magicplanProjectId: string | null;
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
  | { type: "SET_MAGICPLAN_LINK"; link: string }
  | { type: "SET_MAGICPLAN_PROJECT"; projectId: string }
  | { type: "SET_CONTACT"; field: keyof ContactInfo; value: string }
  | { type: "SET_ZONE_NOTE"; zone: ZoneId; note: string }
  | { type: "ADD_ZONE_PHOTOS"; zone: ZoneId; files: File[] }
  | { type: "REMOVE_ZONE_PHOTO"; zone: ZoneId; index: number }
  | { type: "SET_SUBMITTING"; isSubmitting: boolean }
  | { type: "SET_SUCCESS" }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "RESET" };
