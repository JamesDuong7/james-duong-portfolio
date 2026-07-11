export const MIN_MESSAGE_LENGTH = 30;
export const MIN_SUBMIT_MS = 3000;
export const WEB3FORMS_HCAPTCHA_SITE_KEY = "50b2fe65-b00b-4b9e-ad62-3ba471098be2";

export type ContactFormPayload = {
  name: string;
  email: string;
  message: string;
  captchaToken: string;
  botcheck: FormDataEntryValue | null;
  formReadyAt: number;
};

export type ContactSubmitResult =
  | { ok: true; message: string }
  | { ok: false; message: string };

export function validateContactForm({
  name,
  email,
  message,
  captchaToken,
  botcheck,
  formReadyAt,
}: ContactFormPayload): string | null {
  if (botcheck) {
    return "Unable to send message. Please try again.";
  }

  if (!name || !email || !message) {
    return "All fields are required.";
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return "Invalid email format.";
  }

  if (message.length < MIN_MESSAGE_LENGTH) {
    return `Please write at least ${MIN_MESSAGE_LENGTH} characters in your message.`;
  }

  if (Date.now() - formReadyAt < MIN_SUBMIT_MS) {
    return "Please take a moment to review your message before sending.";
  }

  if (!captchaToken) {
    return "Please complete the verification check below.";
  }

  return null;
}

export async function submitContactForm(
  payload: ContactFormPayload,
): Promise<ContactSubmitResult> {
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    return { ok: false, message: "Contact form is temporarily unavailable." };
  }

  const validationError = validateContactForm(payload);
  if (validationError) {
    return { ok: false, message: validationError };
  }

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_key: accessKey,
        name: payload.name,
        email: payload.email,
        message: payload.message,
        subject: `New Portfolio Message from ${payload.name}`,
        "h-captcha-response": payload.captchaToken,
      }),
    });

    const result = (await response.json()) as { success?: boolean; message?: string };

    if (!response.ok || result.success !== true) {
      return {
        ok: false,
        message: result.message || "Failed to send message. Please try again later.",
      };
    }

    return {
      ok: true,
      message: "Message sent successfully! I will get back to you soon.",
    };
  } catch (error: unknown) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "An error occurred. Please try again.",
    };
  }
}
