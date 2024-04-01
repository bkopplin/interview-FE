import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import SelectTimeRange from './SelectTimeRange';
import { DEFAULT_TIME_RANGE } from '../constants/timeRangeConstants';

describe('SelectTimeRange Component', () => {
  it('renders without crashing', () => {
    render(<SelectTimeRange handleUpdateCallback={() => {}} />);
  });

  it('initializes with default state', async () => {
    render(<SelectTimeRange handleUpdateCallback={() => {}} />);
    const inputElem = screen.getByDisplayValue(DEFAULT_TIME_RANGE.join(','))
    expect(inputElem).toBeInTheDocument()
  });

  it('displays error message for invalid selection', async () => {
    const { getByText } = render(<SelectTimeRange handleUpdateCallback={() => {}} />);
    const select = screen.getByTestId('time-range-select');    
    fireEvent.mouseDown(select)
    const dropdownList = screen.getByRole('listbox')
    fireEvent.click(
        within(dropdownList).getByText('2023K4')
    );
    fireEvent.click(
       within(dropdownList).getByText('2023K3')
    );
    fireEvent.click(
       within(dropdownList).getByText('2023K2')
    );

    waitFor(() => {
        expect(getByText('You must select at least two entries')).toBeInTheDocument();
    })
  });
});
