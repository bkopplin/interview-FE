export type DwellingTypeIndex = string
export type DwellingTypeLabel = string

export interface DwellingType {
    index: DwellingTypeIndex;
    label: DwellingTypeLabel;
  }

export interface DwellingTypesIndex2Label {
    [key: DwellingTypeIndex]: DwellingTypeLabel
}