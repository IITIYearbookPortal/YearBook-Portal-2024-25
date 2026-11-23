import React, { useEffect, useId, useState } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import phoneImage from "./not_verified_otp/th.png";
import backArrow from "./not_verified_otp/arrowBtn.png";
import styles from "./SignupOtpForm.module.css";

export default function SignupOtpForm({
  phone,
  destination,
  sentTo,
  codeInput,
  captchaId,
  busy,
  disabled,
  status,
  resendAt,
  onDestinationChange,
  onSubmit,
  onResend,
}) {
  const inputId = useId();
  const headingId = useId();
  const [now, setNow] = useState(Date.now);
  const seconds = Math.max(0, Math.ceil((resendAt - now) / 1000));

  useEffect(() => {
    if (!sentTo || !resendAt) return;
    setNow(Date.now());
    const timer = setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= resendAt) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendAt, sentTo]);

  return (
    <main className={styles.screen} aria-labelledby={headingId}>
      <form onSubmit={onSubmit} className={styles.form} aria-busy={busy}>
        <div className={styles.heading} key={sentTo ? "code" : "destination"}>
          {phone && !sentTo && <p>We want to remember you forever 🤞</p>}
          <h1 id={headingId}>
            {sentTo ? (
              phone ? (
                <>Let’s verify your <span>phone number</span></>
              ) : (
                <>Check your <span>inbox.</span></>
              )
            ) : phone ? (
              <>Do tell us your <span>phone number</span></>
            ) : (
              <>And your <span>personal email</span>?</>
            )}
          </h1>
        </div>

        <div className={styles.controls}>
          {sentTo ? (
            <>
              <label htmlFor={inputId} className={styles.instructions}>
                Enter the {codeInput.maxLength === 4 ? "four" : "six"}-digit code sent to{" "}
                <strong>{sentTo}</strong>.
              </label>
              <input
                id={inputId}
                className={`${styles.input} ${styles.code}`}
                disabled={busy}
                autoFocus
                {...codeInput}
              />
            </>
          ) : phone ? (
            <PhoneInput
              className={styles.phone}
              defaultCountry="in"
              value={destination}
              onChange={onDestinationChange}
              disabled={disabled}
              inputProps={{ required: true, autoComplete: "tel", "aria-label": "Phone number" }}
            />
          ) : (
            <input
              className={styles.input}
              type="email"
              autoComplete="email"
              aria-label="Personal email address"
              placeholder="Personal Email ID"
              required
              disabled={busy}
              value={destination}
              onChange={(event) => onDestinationChange(event.target.value)}
            />
          )}
          {captchaId && <div className={styles.captcha} id={captchaId} hidden={Boolean(sentTo)} />}
          <p className={styles.status} role="status">{status}</p>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.continue} disabled={disabled}>
            {busy ? (sentTo ? "Verifying…" : "Sending…") : "Continue"}
          </button>
          {sentTo && (
            <button
              type="button"
              className={styles.resend}
              disabled={busy || seconds > 0}
              onClick={onResend}
            >
              {seconds > 0 ? `Resend in ${seconds}s` : "Resend OTP"}
            </button>
          )}
        </div>

        {sentTo && (
          <button
            type="button"
            className={styles.back}
            aria-label={phone ? "Change phone number" : "Change email address"}
            disabled={busy}
            onClick={() => onDestinationChange(destination)}
          >
            <img src={backArrow} alt="" />
          </button>
        )}
      </form>
      {phone && !sentTo && <img className={styles.illustration} src={phoneImage} alt="" />}
    </main>
  );
}
