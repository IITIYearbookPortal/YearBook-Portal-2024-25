import React, { useEffect, useId, useState } from "react";
import { Link } from "react-router-dom";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import phoneImage from "./not_verified_otp/th.png";
import styles from "./SignupOtpForm.module.css";

export default function SignupOtpForm({
  phone,
  destination,
  sentTo,
  codeInput,
  captchaId,
  widget,
  busy,
  action,
  disabled,
  needsNewCode,
  resendExhausted,
  status,
  resendAt,
  onDestinationChange,
  onSubmit,
  onResend,
}) {
  const inputId = useId();
  const deliveryId = useId();
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
              {widget && (
                <p id={deliveryId} className={styles.delivery}>
                  SMS requested for <strong>{sentTo}</strong>. It may take a moment to arrive.
                </p>
              )}
              {!needsNewCode && (
                <>
                  <label htmlFor={inputId} className={styles.instructions}>
                    {widget ? "Four-digit SMS code" : (
                      <>Enter the six-digit code sent to <strong>{sentTo}</strong>.</>
                    )}
                  </label>
                  <input
                    id={inputId}
                    className={`${styles.input} ${styles.code}`}
                    disabled={busy}
                    autoFocus
                    aria-describedby={widget ? deliveryId : undefined}
                    {...codeInput}
                  />
                </>
              )}
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
          {needsNewCode ? (
            <button
              type="button"
              className={styles.continue}
              disabled={busy}
              onClick={() => onDestinationChange(destination)}
            >
              Request a new SMS
            </button>
          ) : (
            <button type="submit" className={styles.continue} disabled={disabled}>
              {action === "verify" ? "Verifying…" : action === "send" ? "Requesting…" :
                sentTo ? "Verify code" : phone ? "Send SMS code" : "Send email code"}
            </button>
          )}
        </div>

        {sentTo && (
          <div className={styles.recovery}>
            {widget && !needsNewCode && <p>Didn’t get a text?</p>}
            <div className={styles.actions}>
              {resendExhausted && !needsNewCode && (
                <button
                  type="button"
                  className={styles.resend}
                  disabled={busy}
                  onClick={() => onDestinationChange(destination)}
                >
                  Request a new SMS
                </button>
              )}
              {!needsNewCode && !resendExhausted && (
                <button
                  type="button"
                  className={styles.resend}
                  disabled={busy || seconds > 0}
                  onClick={onResend}
                >
                  {action === "resend" ? "Requesting another code…" :
                    seconds > 0 ? `Resend in ${seconds}s` : widget ? "Resend SMS" : "Resend code"}
                </button>
              )}
              <button
                type="button"
                className={styles.change}
                disabled={busy}
                onClick={() => onDestinationChange(destination)}
              >
                {phone ? "Change phone number" : "Change email address"}
              </button>
            </div>
          </div>
        )}
        {phone && <Link to="/logout" className={styles.change}>Sign out</Link>}
      </form>
      {phone && !sentTo && <img className={styles.illustration} src={phoneImage} alt="" />}
    </main>
  );
}
