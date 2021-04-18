import React, { PropsWithChildren, useContext, useState } from "react";

export interface User {
  username: string;
}

export interface AuthState {
  user?: User;
  login: () => void;
  logout: () => void;
}

function useProvideAuth(): AuthState {
  const [user, setUser] = useState<User | undefined>(undefined);

  const login = () => {
    // TODO: call backend
    setUser({
      username: "tranquan221b@gmail.com",
    });
  };

  const logout = () => {
    // TODO: call backend
    setUser(undefined);
  };

  return {
    user,
    login,
    logout,
  };
}

const AuthContext = React.createContext<AuthState>({
  user: undefined,
  login: () => {},
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function ProvideAuth(props: PropsWithChildren<{}>) {
  const auth = useProvideAuth();
  return (
    <AuthContext.Provider value={auth}>{props.children}</AuthContext.Provider>
  );
}
