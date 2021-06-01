import React, { PropsWithChildren, useContext, useState } from "react";

import { useAuth } from "src/core/contexts/AuthContext";

const UserProfile = () => {
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
};

export default UserProfile;
