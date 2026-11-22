import React, { useState } from "react";
import axios from "axios";

export default function OtpForm({
  purpose,
  initialDestination = "",
  onVerified,
}) {
  const editing = purpose === "edit-profile";
  const phone = purpose === "signup-phone";
  const [destination, setDestination] = useState(initialDestination);
  const [sentTo, setSentTo] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function send() {
    setBusy(true);
    try {
      const { data } = await axios.post(
        process.env.REACT_APP_API_URL + "/otp/send",
        { purpose, destination },
      );
      setSentTo(data.destination);
      setCode("");
      setMessage(
        "Code sent to " + data.destination + ". It expires in five minutes.",
      );
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not send the code.");
    } finally {
      setBusy(false);
    }
  }
  async function confirm(event) {
    event.preventDefault();
    if (!sentTo) {
      await send();
      return;
    }
    setBusy(true);
    try {
      if (!editing)
        await axios.post(process.env.REACT_APP_API_URL + "/otp/verify", {
          purpose,
          code,
          destination: sentTo,
        });
      await onVerified(code);
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Verification failed. Request a new code if needed.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={confirm} className="grid gap-4 p-6 bg-gray-900 text-white">
      <h2>
        {editing
          ? "Confirm profile changes"
          : phone
            ? "Verify your phone"
            : "Verify your personal email"}
      </h2>
      {!editing && (
        <label>
          {phone ? "Mobile number with country code" : "Personal email"}{" "}
          <input
            className="text-black"
            required
            type={phone ? "tel" : "email"}
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              setSentTo("");
              setCode("");
              setMessage("");
            }}
          />
        </label>
      )}
      {sentTo && (
        <label>
          Six-digit code{" "}
          <input
            className="text-black"
            required
            autoComplete="one-time-code"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </label>
      )}
      <p role="status">{message}</p>
      <button disabled={busy}>
        {sentTo ? (editing ? "Verify and save" : "Verify code") : "Send code"}
      </button>
      {sentTo && (
        <button type="button" disabled={busy} onClick={send}>
          Resend code
        </button>
      )}
    </form>
  );
}
