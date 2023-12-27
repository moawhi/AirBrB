import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Register from '../components/Register';
import { BrowserRouter as Router } from 'react-router-dom';

describe('Register Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));
  });

  // ... Previous test cases ...

  test('validates form fields correctly', () => {
    render(
      <Router>
        <Register />
      </Router>,
    );
    const registerButton = screen.getByRole('button', { name: /register/i });
    userEvent.click(registerButton);
    expect(screen.getByText(/all fields are required/i)).toBeInTheDocument();

    // Add more validation checks here as needed
  });

  test('displays error message when there is an error', () => {
    render(
      <Router>
        <Register />
      </Router>,
    );
    // Trigger an error condition and check for error message
    // This might require you to mock a function or adjust the component for testability
  });
});
