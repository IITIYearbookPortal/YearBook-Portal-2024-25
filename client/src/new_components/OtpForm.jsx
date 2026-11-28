import React, { useEffect, useId, useRef, useState } from "react";
import axios from "axios";
import { loadWidget, widgetRequest } from "./msg91Widget";
import SignupOtpForm from "./SignupOtpForm";

export default function OtpForm({
  purpose,
  initialDestination = "",
  onVerified,
}) {
  const editing = purpose === "edit-profile";
  const phone = purpose === "signup-phone";
  const captchaId = "msg91-captcha-" + useId().replace(/:/g, "");
  const [destination, setDestination] = useState(initialDestination);
  const [sentTo, setSentTo] = useState("");
  const [code, setCode] = useState("");
  const [action, setAction] = useState("");
  const inFlight = useRef(false);
  const lastRequestedTo = useRef("");
  const [message, setMessage] = useState("");
  const [phoneMode, setPhoneMode] = useState(phone ? "loading" : "portal");
  const [requestId, setRequestId] = useState("");
  const [resendAt, setResendAt] = useState(0);
  const [needsNewCode, setNeedsNewCode] = useState(false);
  const [resendExhausted, setResendExhausted] = useState(false);
  const widget = phone && phoneMode === "widget";
  const busy = Boolean(action);
  const codeLength = widget ? 4 : 6;
  const loading = phoneMode === "loading";
  const unavailable = phoneMode === "unavailable";
  const api = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!phone) return;
    let active = true;
    let instance;
    const destroyWidget = () => {
      if (instance?.instanceId) window.destroyOTPWidget?.(instance.instanceId);
    };
    async function setup() {
      try {
        const { status, data } = await axios.get(api + "/otp/widget");
        if (!active) return;
        if (status === 204) {
          setPhoneMode("portal");
          return;
        }
        await loadWidget();
        if (!active) return;
        let initializationFailed = false;
        instance = await window.initSendOTP({
          widgetId: data.widgetId,
          tokenAuth: data.tokenAuth,
          exposeMethods: true,
          captchaRenderId: captchaId,
          success: () => {},
          failure: () => {
            if (active && !window.getWidgetData?.()) {
              initializationFailed = true;
              setPhoneMode("unavailable");
              setMessage("Could not load phone verification. Refresh to retry.");
            }
          },
        });
        if (instance === null) throw new Error("MSG91 initialization failed");
        if (!active) {
          destroyWidget();
          return;
        }
        if (!initializationFailed) setPhoneMode("widget");
      } catch (err) {
        if (!active) return;
        setPhoneMode("unavailable");
        setMessage(
          err.response?.data?.message ||
            "Could not load phone verification. Refresh to retry.",
        );
      }
    }
    setup();
    return () => {
      active = false;
      destroyWidget();
    };
  }, [api, captchaId, phone]);

  function changeDestination(value) {
    setDestination(value);
    setSentTo("");
    setRequestId("");
    setCode("");
    setMessage("");
    setNeedsNewCode(false);
    setResendExhausted(false);
  }

  async function send(retry = false) {
    if (inFlight.current) return;
    const phoneNumber = destination.trim();
    if (widget && lastRequestedTo.current === phoneNumber && Date.now() < resendAt) {
      setMessage("Wait a minute before requesting another SMS to this number.");
      return;
    }
    inFlight.current = true;
    setAction(retry ? "resend" : "send");
    setMessage("");
    try {
      if (widget) {
        if (!/^\+[1-9]\d{6,14}$/.test(phoneNumber))
          throw new Error("Use an international phone number including +.");
        if (retry) {
          await widgetRequest("retryOtp", "11", requestId);
        } else {
          const data = await widgetRequest("sendOtp", phoneNumber.slice(1));
          const id =
            data?.message || data?.data?.request_id ||
            data?.data?.requestId || data?.data?.reqId;
          if (typeof id !== "string" || !id)
            throw new Error("MSG91 did not return a code request. Try again.");
          setRequestId(id);
        }
        setSentTo(phoneNumber);
        lastRequestedTo.current = phoneNumber;
        setCode("");
        setResendAt(Date.now() + 60000);
        setMessage("");
        return;
      }
      const { data } = await axios.post(api + "/otp/send", { purpose, destination });
      setSentTo(data.destination);
      setCode("");
      setResendAt(Date.now() + 60000);
      setMessage(editing ? "Code sent to " + data.destination + ". It expires in five minutes." : "");
    } catch (err) {
      if (widget && (err.code === "timeout" || err.code === "rate-limit")) {
        lastRequestedTo.current = phoneNumber;
        setResendAt(Date.now() + 60000);
      }
      if (widget && retry && err.code === "new-request") setNeedsNewCode(true);
      if (widget && retry && err.code === "retry-limit") setResendExhausted(true);
      setMessage(
        err.response?.data?.message ||
          (widget && err.message) ||
          "Could not send the code.",
      );
    } finally {
      inFlight.current = false;
      setAction("");
    }
  }
  async function confirm(event) {
    event.preventDefault();
    if (inFlight.current || loading || unavailable || needsNewCode) return;
    if (!sentTo) {
      await send();
      return;
    }
    inFlight.current = true;
    setAction("verify");
    setMessage("");
    try {
      if (widget) {
        const data = await widgetRequest("verifyOtp", code, requestId);
        if (typeof data?.message !== "string")
          throw new Error("MSG91 did not return a verification token.");
        await axios.post(api + "/otp/verify", {
          purpose,
          widgetToken: data.message,
          destination: sentTo,
        });
      } else if (!editing) {
        await axios.post(api + "/otp/verify", {
          purpose,
          code,
          destination: sentTo,
        });
      }
      await onVerified(code);
    } catch (err) {
      if (widget && err.code === "new-request") setNeedsNewCode(true);
      setMessage(
        err.response?.data?.message ||
          (widget && err.message) ||
          "Verification failed. Request a new code if needed.",
      );
    } finally {
      inFlight.current = false;
      setAction("");
    }
  }

  const codeInput = {
    required: true,
    autoComplete: "one-time-code",
    inputMode: "numeric",
    pattern: `[0-9]{${codeLength}}`,
    maxLength: codeLength,
    value: code,
    onChange: (event) => setCode(event.target.value.replace(/\D/g, "").slice(0, codeLength)),
  };

  if (editing) {
    return (
      <form onSubmit={confirm} className="grid gap-4 p-6 bg-gray-900 text-white">
        <h2>Confirm profile changes</h2>
        {sentTo && (
          <label>
            Six-digit code{" "}
            <input className="text-black" {...codeInput} />
          </label>
        )}
        <p role="status">{message}</p>
        <button disabled={busy}>{sentTo ? "Verify and save" : "Send code"}</button>
        {sentTo && (
          <button type="button" disabled={busy} onClick={() => send(true)}>
            Resend code
          </button>
        )}
      </form>
    );
  }

  return (
    <SignupOtpForm
      phone={phone}
      destination={destination}
      sentTo={sentTo}
      codeInput={codeInput}
      captchaId={phone && phoneMode !== "portal" ? captchaId : undefined}
      widget={widget}
      busy={busy}
      action={action}
      disabled={busy || loading || unavailable}
      needsNewCode={needsNewCode}
      resendExhausted={resendExhausted}
      status={loading ? "Loading phone verification…" : message}
      resendAt={resendAt}
      onDestinationChange={changeDestination}
      onSubmit={confirm}
      onResend={() => send(true)}
    />
  );
}
