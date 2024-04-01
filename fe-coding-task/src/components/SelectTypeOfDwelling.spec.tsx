import React from 'react';
import { render, screen } from '@testing-library/react';
import SelectTypeOfDwelling from './SelectTypeOfDwelling';
import { DEFAULT_DWELLING_TYPE } from '../constants/dwellingTypeConstants';


describe('SelectTypeOfDwelling Component', () => {
  it('renders without crashing', () => {
    render(<SelectTypeOfDwelling handleUpdateCallback={() => {}} />);
  });

  it('initializes with default state', async () => {
    render(<SelectTypeOfDwelling handleUpdateCallback={() => {}} />);
    const inputElem = screen.getByDisplayValue(DEFAULT_DWELLING_TYPE.join(','))
    expect(inputElem).toBeInTheDocument()
  });
});
