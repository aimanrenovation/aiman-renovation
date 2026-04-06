import type {
  DevisState,
  DevisAction,
  ZoneId,
  BudgetRange,
} from "./devis-types";

const ALL_ZONES: ZoneId[] = [
  "salon",
  "sam",
  "cuisine",
  "vestibule",
  "wc",
  "sdb",
  "chambre1",
  "chambre2",
  "garage",
  "terrasse",
  "jardin",
  "haie",
  "facades",
  "toiture",
];

function createEmptyWorks(): Record<ZoneId, string[]> {
  return {
    cuisine: [],
    salon: [],
    sam: [],
    vestibule: [],
    wc: [],
    sdb: [],
    chambre1: [],
    chambre2: [],
    garage: [],
    terrasse: [],
    jardin: [],
    haie: [],
    facades: [],
    toiture: [],
  };
}

function createEmptyNotes(): Record<ZoneId, string> {
  return {
    cuisine: "", salon: "", sam: "", vestibule: "", wc: "", sdb: "",
    chambre1: "", chambre2: "", garage: "",
    terrasse: "", jardin: "", haie: "", facades: "", toiture: "",
  };
}

function createEmptyPhotos(): Record<ZoneId, File[]> {
  return {
    cuisine: [], salon: [], sam: [], vestibule: [], wc: [], sdb: [],
    chambre1: [], chambre2: [], garage: [],
    terrasse: [], jardin: [], haie: [], facades: [], toiture: [],
  };
}

export const initialDevisState: DevisState = {
  view: "global",
  activeZone: null,
  selectedWorks: createEmptyWorks(),
  zoneNotes: createEmptyNotes(),
  zonePhotos: createEmptyPhotos(),
  budget: null,
  magicplanLink: "",
  message: "",
  contact: {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
  },
  isSubmitting: false,
  error: null,
};

export function devisReducer(
  state: DevisState,
  action: DevisAction,
): DevisState {
  switch (action.type) {
    case "ZOOM_ZONE":
      return { ...state, view: "zoomed", activeZone: action.zone, error: null };

    case "ZOOM_OUT":
      return { ...state, view: "global", activeZone: null, error: null };

    case "SHOW_RECAP":
      return { ...state, view: "recap", activeZone: null, error: null };

    case "TOGGLE_WORK": {
      const current = state.selectedWorks[action.zone];
      const updated = current.includes(action.workId)
        ? current.filter((w) => w !== action.workId)
        : [...current, action.workId];
      return {
        ...state,
        selectedWorks: { ...state.selectedWorks, [action.zone]: updated },
      };
    }

    case "SET_ZONE_NOTE":
      return { ...state, zoneNotes: { ...state.zoneNotes, [action.zone]: action.note } };

    case "ADD_ZONE_PHOTOS":
      return { ...state, zonePhotos: { ...state.zonePhotos, [action.zone]: [...state.zonePhotos[action.zone], ...action.files] } };

    case "REMOVE_ZONE_PHOTO":
      return { ...state, zonePhotos: { ...state.zonePhotos, [action.zone]: state.zonePhotos[action.zone].filter((_, i) => i !== action.index) } };

    case "SET_BUDGET":
      return { ...state, budget: action.budget };

    case "SET_MESSAGE":
      return { ...state, message: action.message };

    case "SET_MAGICPLAN_LINK":
      return { ...state, magicplanLink: action.link };

    case "SET_CONTACT":
      return {
        ...state,
        contact: { ...state.contact, [action.field]: action.value },
      };

    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.isSubmitting, error: null };

    case "SET_SUCCESS":
      return { ...state, view: "success", isSubmitting: false, error: null };

    case "SET_ERROR":
      return { ...state, error: action.error, isSubmitting: false };

    case "RESET":
      if (typeof window !== "undefined") localStorage.removeItem("devis-state");
      return initialDevisState;

    default:
      return state;
  }
}
