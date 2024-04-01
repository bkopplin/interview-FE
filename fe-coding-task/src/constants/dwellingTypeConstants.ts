import { DwellingType, DwellingTypeIndex } from "../types/DwellingType";

export const DWELLING_TYPES: DwellingType[] = [
    { index: "00", label: "total" },
    { index: "02", label: "Row houses" },
    { index: "03", label: "Multi-dwelling" }
  ];

export const DEFAULT_DWELLING_TYPE: DwellingTypeIndex[] = ["00"]