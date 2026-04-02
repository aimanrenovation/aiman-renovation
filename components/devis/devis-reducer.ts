import type { DevisFormState, DevisAction, ZoneId } from "./devis-types";

function createEmptyProblems(): Record<ZoneId, string[]> {
  return {
    cuisine: [],
    "salle-de-bain": [],
    facade: [],
    toit: [],
    garage: [],
    exterieur: [],
  };
}

function createEmptyOptions(): Record<ZoneId, string[]> {
  return {
    cuisine: [],
    "salle-de-bain": [],
    facade: [],
    toit: [],
    garage: [],
    exterieur: [],
  };
}

export const initialDevisState: DevisFormState = {
  currentStep: 0,
  selectedZones: [],
  activeZone: null,
  problems: createEmptyProblems(),
  renovationOptions: createEmptyOptions(),
  surface: null,
  budget: null,
  message: "",
  photos: [],
  contact: {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
  },
  isSubmitting: false,
  isSubmitted: false,
  error: null,
};

export function devisReducer(
  state: DevisFormState,
  action: DevisAction
): DevisFormState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.step, error: null };

    case "NEXT_STEP":
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, 5),
        error: null,
      };

    case "PREV_STEP":
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 0),
        error: null,
      };

    case "TOGGLE_ZONE": {
      const zones = state.selectedZones.includes(action.zone)
        ? state.selectedZones.filter((z) => z !== action.zone)
        : [...state.selectedZones, action.zone];
      return {
        ...state,
        selectedZones: zones,
        activeZone: zones.includes(action.zone) ? action.zone : zones[0] || null,
      };
    }

    case "SET_ACTIVE_ZONE":
      return { ...state, activeZone: action.zone };

    case "TOGGLE_PROBLEM": {
      const current = state.problems[action.zone];
      const updated = current.includes(action.problemId)
        ? current.filter((p) => p !== action.problemId)
        : [...current, action.problemId];
      return {
        ...state,
        problems: { ...state.problems, [action.zone]: updated },
      };
    }

    case "TOGGLE_RENOVATION_OPTION": {
      const current = state.renovationOptions[action.zone];
      const updated = current.includes(action.optionId)
        ? current.filter((o) => o !== action.optionId)
        : [...current, action.optionId];
      return {
        ...state,
        renovationOptions: { ...state.renovationOptions, [action.zone]: updated },
      };
    }

    case "SET_SURFACE":
      return { ...state, surface: action.surface };

    case "SET_BUDGET":
      return { ...state, budget: action.budget };

    case "SET_MESSAGE":
      return { ...state, message: action.message };

    case "ADD_PHOTOS":
      return { ...state, photos: [...state.photos, ...action.files] };

    case "REMOVE_PHOTO":
      return {
        ...state,
        photos: state.photos.filter((_, i) => i !== action.index),
      };

    case "SET_CONTACT":
      return {
        ...state,
        contact: { ...state.contact, [action.field]: action.value },
      };

    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.isSubmitting, error: null };

    case "SET_SUBMITTED":
      return { ...state, isSubmitted: true, isSubmitting: false };

    case "SET_ERROR":
      return { ...state, error: action.error, isSubmitting: false };

    case "RESET":
      return initialDevisState;

    default:
      return state;
  }
}
