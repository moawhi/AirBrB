// This file can be deleted if you'd like
import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

// Test if the app renders without crashing:
test('renders without crashing', () => {
  render(<App />);
  // If the test reaches here without throwing an error, it passes
});

// Test for the absence of a non-existing element:
