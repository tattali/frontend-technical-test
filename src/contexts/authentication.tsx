import { jwtDecode } from "jwt-decode";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type AuthenticationState =
  | {
      isAuthenticated: true;
      token: string;
      userId: string;
    }
  | {
      isAuthenticated: false;
    };

export type Authentication = {
  state: AuthenticationState;
  authenticate: (token: string) => void;
  signout: () => void;
  isValidToken: (token: string) => boolean;
};

export const AuthenticationContext = createContext<Authentication | undefined>(
  undefined,
);

export const AuthenticationProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [state, setState] = useState<AuthenticationState>({
    isAuthenticated: false,
  });

  const authenticate = useCallback(
    (token: string) => {
      localStorage.setItem('jwt_token', token);
      setState({
        isAuthenticated: true,
        token,
        userId: jwtDecode<{ id: string }>(token).id,
      });
    },
    [setState],
  );

  const signout = useCallback(() => {
    localStorage.removeItem('jwt_token');
    setState({ isAuthenticated: false });
  }, [setState]);

  const isValidToken = useCallback((token: string) => {
    const exp = jwtDecode(token).exp;
    if (exp && new Date() < new Date(exp * 1000)) {
      return true;
    }

    return false;
  }, [setState, authenticate]);

  const contextValue = useMemo(
    () => {
      const token = localStorage.getItem('jwt_token');
      if (token && isValidToken(token)) {
        if (!state.isAuthenticated) {
          authenticate(token);
        }
      }
      return { state, authenticate, signout, isValidToken };
    },
    [state, authenticate, signout, isValidToken],
  );

  return (
    <AuthenticationContext.Provider value={contextValue}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export function useAuthentication() {
  const context = useContext(AuthenticationContext);
  if (!context) {
    throw new Error(
      "useAuthentication must be used within an AuthenticationProvider",
    );
  }
  return context;
}

export function useAuthToken() {
  const { state } = useAuthentication();
  if (!state.isAuthenticated) {
    throw new Error("User is not authenticated");
  }
  return state.token;
}
