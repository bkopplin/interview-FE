import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { DEFAULT_DWELLING_TYPE, DWELLING_TYPES } from '../constants/dwellingTypeConstants';
import { DwellingTypeIndex, DwellingTypeLabel, DwellingTypesIndex2Label } from '../types/DwellingType';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const dwellingTypesIndex2Label: DwellingTypesIndex2Label = {};
DWELLING_TYPES.forEach(dwellingType => {
  dwellingTypesIndex2Label[dwellingType.index] = dwellingType.label;
});

const getDwellingTypeLabel = (dwellingTypeIndex: DwellingTypeIndex): DwellingTypeLabel => {
  return dwellingTypesIndex2Label[dwellingTypeIndex] || "Unknown dwelling type";
};

interface SelectTypeOfDwellingProps {
  handleUpdateCallback: (newVal: DwellingTypeIndex[]) => void;
}

export default function SelectTypeOfDwelling({ handleUpdateCallback }: SelectTypeOfDwellingProps) {
  const [selectedTypeOfDwelling, setSelectedTypeOfDwelling] = React.useState<string[]>(DEFAULT_DWELLING_TYPE);

  const handleChange = (event: SelectChangeEvent<typeof selectedTypeOfDwelling>) => {
    const {
      target: { value },
    } = event;
    setSelectedTypeOfDwelling(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleClose = () => handleUpdateCallback(selectedTypeOfDwelling)

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="select-quarters-label">Type of Dwelling</InputLabel>
        <Select
          labelId="select-quarter-label"
          id="select-quarter-checkbox"
          multiple
          value={selectedTypeOfDwelling}
          onChange={handleChange}
          onClose={handleClose}
          input={<OutlinedInput label="type-of-dwelling" />}
          renderValue={(selected) => selected.map(getDwellingTypeLabel).join(', ')}
          MenuProps={MenuProps}
        >
          {DWELLING_TYPES.map((dwelling) => (
            <MenuItem key={dwelling.index} value={dwelling.index}>
              <Checkbox checked={selectedTypeOfDwelling.indexOf(dwelling.index) > -1} />
              <ListItemText primary={ dwelling.label }  />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}