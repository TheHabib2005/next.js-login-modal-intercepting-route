import React from "react";

const layout = ({ children, users, notifatcion }) => {
  return (
    <div>
      {children}
      {users}
      {notifatcion}
    </div>
  );
};

export default layout;
