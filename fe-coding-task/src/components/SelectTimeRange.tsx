import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { DEFAULT_TIME_RANGE, QUARTERS } from '../constants/timeRangeConstants';
import { FormHelperText } from '@mui/material';

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

interface SelectTimeRangeProps {
  handleUpdateCallback: (newVal: string[]) => void;
}

export default function SelectTimeRange({ handleUpdateCallback }: SelectTimeRangeProps) {
  const [selectedTimeRange, setSelectedTimeRange] = React.useState<string[]>(DEFAULT_TIME_RANGE);
  const [error, setError] = React.useState<string>('')

  const validateAndSetError = (): boolean => {
    if (selectedTimeRange.length < 2) {
      setError('You must select at least two entries')
      return true;
    } else {
      setError('')
      return false;
    }
  }
 

  const handleChange = (event: SelectChangeEvent<typeof selectedTimeRange>) => {
    const {
      target: { value },
    } = event;
    setSelectedTimeRange(
      typeof value === 'string' ? value.split(',') : value
    );
  };
  const handleClose = () => {
    if (!validateAndSetError()) {
      handleUpdateCallback(selectedTimeRange)
    }    
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="select-time-range-label">Time Range</InputLabel>
        <Select
          labelId="select-time-range-label"
          // inputProps={{ id: 'timerangeid', 'data-testid': "time-range-select" }}
          inputProps={{
            SelectDisplayProps: {
                ['data-testid']: 'time-range-select',
            },
        }}
          multiple
          value={selectedTimeRange}
          onChange={handleChange}
          onClose={handleClose}
          input={<OutlinedInput label="Quarter" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
          error={!!error}
        >
          {QUARTERS.map((quarter) => (
            <MenuItem key={quarter} value={quarter}>
              <Checkbox checked={selectedTimeRange.indexOf(quarter) > -1} />
              <ListItemText primary={ quarter } />
            </MenuItem>
          ))}
        </Select>
        <FormHelperText error>{error}</FormHelperText>
      </FormControl>
    </div>
  );
}