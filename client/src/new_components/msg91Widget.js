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
      reject(new Error("MSG91 did not respond. Try again shortly."));
    }, 20000);
    const success = (data) => {
      clearTimeout(timeout);
      resolve(data);
    };
    const failure = (data) => {
      clearTimeout(timeout);
      const message = typeof data === "string" ? data : data?.message;
      reject(new Error(
        /captcha/i.test(message)
          ? "Complete the CAPTCHA to continue."
          : "MSG91 could not complete the request. Check your details and try again.",
      ));
    };
    try {
      window[method](value, success, failure, requestId);
    } catch {
      failure();
    }
  });
}
