import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../../login';

// Mock Firebase auth methods
jest.mock('../../firebaseConfig', () => ({
  auth: {},
}));
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));

import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

describe('Login component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form inputs and buttons', () => {
    render(<Login />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('calls signInWithEmailAndPassword on form submit', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({});

    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'pw123' } });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'a@b.com', 'pw123');
    });
  });

  it('shows error message when login fails', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce({ message: 'Invalid credentials' });

    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'fail@b.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'badpass' } });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('calls signOut on logout button click', async () => {
    (signOut as jest.Mock).mockResolvedValueOnce({});

    render(<Login />);
    fireEvent.click(screen.getByRole('button', { name: /logout/i }));

    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
    });
  });
});
