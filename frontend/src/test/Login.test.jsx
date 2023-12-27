import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Login from '../components/Login';
import { BrowserRouter as Router } from 'react-router-dom';

describe('Login Component', () => {
  const mockNavigate = jest.fn();
  const mockSetToken = jest.fn();

  beforeEach(() => {
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));
  });

  test('renders Login component', () => {
    render(
      <Router>
        <Login />
      </Router>,
    );
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('updates email input value on change', () => {
    render(
      <Router>
        <Login />
      </Router>,
    );
    const emailInput = screen.getByLabelText(/email/i);
    userEvent.type(emailInput, 'test@example.com');
    expect(emailInput).toHaveValue('test@example.com');
  });

  test('updates password input value on change', () => {
    render(
      <Router>
        <Login />
      </Router>,
    );
    const passwordInput = screen.getByLabelText(/password/i);
    userEvent.type(passwordInput, 'password123');
    expect(passwordInput).toHaveValue('password123');
  });

  test('clicking login button triggers login function', () => {
    render(
      <Router>
        <Login setToken={mockSetToken} />
      </Router>,
    );
    const loginButton = screen.getByRole('button', { name: /login/i });
    userEvent.click(loginButton);
    // Note: Additional logic may be required to mock the fetch call
  });

  test('displays error message when error is set', () => {
    render(
      <Router>
        <Login />
      </Router>,
    );
    // Simulate setting an error and check if it is displayed
    // This might require adjusting the component to allow setting an error for testing
  });
});
