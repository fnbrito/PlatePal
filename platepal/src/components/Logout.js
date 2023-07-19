import React from "react";

function Logout() {
  // Clear user token.
  localStorage.removeItem("token");

  return (
    <div className="light-text">
      <h1>You have been logged out.</h1>
    </div>
  );
}

export default Logout;
