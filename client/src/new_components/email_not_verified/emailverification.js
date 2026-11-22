import React, { useContext } from "react";
import { LoginContext } from "../../helpers/Context";
import OtpForm from "../OtpForm";
export default function Verification() {
  const { profile } = useContext(LoginContext);
  return (
    <main className="min-h-screen bg-gray-900 grid place-items-center">
      <OtpForm
        purpose="signup-email"
        initialDestination={profile.pendingEmail}
        onVerified={() => window.location.replace("/")}
      />
    </main>
  );
}
