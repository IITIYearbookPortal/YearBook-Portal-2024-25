import React, { useContext } from "react";
import { LoginContext } from "../../helpers/Context";
import OtpForm from "../OtpForm";
export default function Verification() {
  const { profile, user } = useContext(LoginContext);
  return (
    <OtpForm
      purpose="signup-phone"
      initialDestination={profile.pendingPhone}
      onVerified={() => window.location.replace("/emailverification/" + encodeURIComponent(user.jti))}
    />
  );
}
