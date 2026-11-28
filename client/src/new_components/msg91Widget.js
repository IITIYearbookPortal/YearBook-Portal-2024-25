const scriptUrls = [
  "https://verify.msg91.com/otp-provider.js",
  "https://verify.phone91.com/otp-provider.js",
];
let loadingScript;

function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    const failed = () => {
      clearTimeout(timeout);
      script.remove();
      reject(new Error("Could not load MSG91 phone verification"));
    };
    const timeout = setTimeout(failed, 10000);
    script.onerror = failed;
    script.onload = () => {
      if (typeof window.initSendOTP !== "function") return failed();
      clearTimeout(timeout);
      resolve();
    };
    document.head.appendChild(script);
  });
}

export function loadWidget() {
  if (!loadingScript) {
    loadingScript = loadScript(scriptUrls[0])
      .catch(() => loadScript(scriptUrls[1]))
      .catch((error) => {
        loadingScript = undefined;
        throw error;
      });
  }
  return loadingScript;
}

export function widgetRequest(method, value, requestId) {
  return new Promise((resolve, reject) => {
    if (typeof window[method] !== "function") {
      reject(new Error("Phone verification is still loading. Try again shortly."));
      return;
    }
    const timeout = setTimeout(() => {
      reject(widgetError(
        "timeout",
        method === "verifyOtp"
          ? "Verification timed out. Try again."
          : "We couldn’t confirm the SMS request. Wait for a text before trying again.",
      ));
    }, 20000);
    const success = (data) => {
      clearTimeout(timeout);
      resolve(data);
    };
    const failure = (data) => {
      clearTimeout(timeout);
      reject(widgetFailure(method, data));
    };
    try {
      Promise.resolve(window[method](value, success, failure, requestId)).catch(failure);
    } catch (error) {
      failure(error);
    }
  });
}

function widgetError(code, message) {
  return Object.assign(new Error(message), { code });
}

function widgetFailure(method, data) {
  const detail = typeof data === "string" ? data : data?.message || data?.error?.message || "";
  if (/captcha/i.test(detail))
    return widgetError("captcha", "Complete the CAPTCHA and try again.");
  if (method === "retryOtp" && /retry (?:count|limit).*exceed|maximum.*retr/i.test(detail))
    return widgetError("retry-limit", "Resend limit reached. You can still enter the latest code if it arrives.");
  if (/expir|otp not found|invalid request id|request (?:id )?(?:not found|invalid)|verification limit/i.test(detail))
    return widgetError("new-request", "This code can no longer be used. Request a new SMS.");
  if (/too many|rate limit|throttl|wait/i.test(detail))
    return widgetError("rate-limit", "Too many requests. Wait before requesting another code.");
  if (method === "verifyOtp")
    return widgetError("verify", "Could not verify that code. Check the latest SMS and try again.");
  return widgetError("send", "MSG91 couldn’t request the SMS. Check the number and try again.");
}
