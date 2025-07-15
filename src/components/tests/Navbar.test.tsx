import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import Navbar from '../Navbar/Navbar';
import type { User } from 'firebase/auth';

// Create a minimal mock Firebase User
const fakeUser = {
  uid: '123',
  displayName: 'Test User',
  email: 'test@example.com',
  emailVerified: true,
  isAnonymous: false,
  providerData: [],
  refreshToken: '',
  getIdToken: jest.fn(),
  getIdTokenResult: jest.fn(),
  reload: jest.fn(),
  delete: jest.fn(),
  metadata: {} as any,
  phoneNumber: null,
  photoURL: null,
  providerId: '',
  tenantId: null
} as unknown as User;

const renderWithProviders = (ui: React.ReactElement, {user = null}: { user?: User | null } = {}) => {
  return render(
    <AuthContext.Provider value={{ user, setUser: jest.fn() }}>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('Navbar', () => {
  it('renders Home and Cart links', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByText(/home/i)).toBeInTheDocument();
    expect(screen.getByText(/cart/i)).toBeInTheDocument();
  });

  it('shows Register/Login if not logged in', () => {
    renderWithProviders(<Navbar />, { user: null });
    expect(screen.getByText(/register/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it('shows Profile/Logout/Manage Products if logged in', () => {
    renderWithProviders(<Navbar />, { user: fakeUser });
    expect(screen.getByText(/profile/i)).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
    expect(screen.getByText(/manage products/i)).toBeInTheDocument();
  });
});
