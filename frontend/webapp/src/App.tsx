import React, { PropsWithChildren, useContext, useState } from "react";

import { ProvideAuth, useAuth } from "./core/contexts/AuthContext";

import "./App.css";

const BASE_URL = "http://localhost";

function UserProfile() {
  const auth = useAuth();
  return (
    <div>
      {auth.user ? (
        <div>
          {`Welcome ${auth.user.username}`}
          <br />
          <button
            onClick={() => {
              console.warn(`logout`);
              auth.logout();
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={() => {
              console.warn(`login`);
              auth.login();
            }}
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <ProvideAuth>
      <div className="App">
        <UserProfile />
      </div>
    </ProvideAuth>
  );
}

export default App;
