/* DCAST_PREMIUM_CONTACT_JS_20260804 */
(function () {
  "use strict";

  const apiEndpoint = "/api/contact";
  const whatsappNumber = "263783612474";

  function statusMessage(form, type, message) {
    const status = form.querySelector(
      ".dcast-contact-status"
    );

    if (!status) {
      return;
    }

    status.className =
      "dcast-contact-status visible " + type;

    status.textContent = message;
  }

  function createPayload(form) {
    const data = Object.fromEntries(
      new FormData(form).entries()
    );

    const messageParts = [];

    if (data.company) {
      messageParts.push("Company: " + data.company);
    }

    if (data.subject) {
      messageParts.push("Subject: " + data.subject);
    }

    if (data.message) {
      messageParts.push("Message: " + data.message);
    }

    return {
      fullName: data.fullName || "",
      phone: data.phone || "",
      email: data.email || "",
      service: data.service || "Guarding or security enquiry",
      message: messageParts.join("\n"),
      companyWebsite: data.companyWebsite || "",
      source:
        form.dataset.source || "website_contact"
    };
  }

  function openWhatsApp(payload) {
    const text = [
      "DCAST Security and Guarding Enquiry",
      "",
      "Name: " + payload.fullName,
      "Phone: " + payload.phone,
      "Email: " + payload.email,
      "Service: " + payload.service,
      payload.message
    ].join("\n");

    window.open(
      "https://wa.me/"
      + whatsappNumber
      + "?text="
      + encodeURIComponent(text),
      "_blank",
      "noopener"
    );
  }

  async function submitForm(form) {
    const button = form.querySelector(
      '[data-dcast-submit]'
    );

    const originalText =
      button
        ? button.textContent.trim()
        : "Send Message";

    form
      .querySelectorAll('[aria-invalid="true"]')
      .forEach(function (field) {
        field.removeAttribute("aria-invalid");
      });

    if (!form.checkValidity()) {
      form
        .querySelectorAll("input, select, textarea")
        .forEach(function (field) {
          if (!field.checkValidity()) {
            field.setAttribute(
              "aria-invalid",
              "true"
            );
          }
        });

      form.reportValidity();

      statusMessage(
        form,
        "error",
        "Please complete all required fields correctly."
      );

      return;
    }

    const payload = createPayload(form);

    if (button) {
      button.disabled = true;
      button.textContent = "Sending...";
    }

    try {
      const controller = new AbortController();

      const timeout = window.setTimeout(
        function () {
          controller.abort();
        },
        12000
      );

      const response = await fetch(
        apiEndpoint,
        {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        }
      );

      window.clearTimeout(timeout);

      const result = await response
        .json()
        .catch(function () {
          return {};
        });

      if (!response.ok || !result.ok) {
        throw new Error(
          result.error || "Submission unavailable"
        );
      }

      form.reset();

      statusMessage(
        form,
        "success",
        "Thank you. Your security enquiry has been received. "
        + "A DCAST Security representative will contact you "
        + "to discuss your guarding or security requirements."
      );
    } catch (error) {
      statusMessage(
        form,
        "error",
        "The online form is temporarily unavailable. "
        + "WhatsApp will open so you can send your security "
        + "requirements directly to DCAST."
      );

      openWhatsApp(payload);
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = originalText;
      }
    }
  }

  document.addEventListener(
    "DOMContentLoaded",
    function () {
      document.body.classList.add(
        "dcast-premium-contact-ready"
      );

      document
        .querySelectorAll(
          "[data-dcast-premium-form]"
        )
        .forEach(function (form) {
          form.addEventListener(
            "submit",
            function (event) {
              event.preventDefault();
              submitForm(form);
            }
          );

          form
            .querySelectorAll(
              "input, select, textarea"
            )
            .forEach(function (field) {
              field.addEventListener(
                "input",
                function () {
                  field.removeAttribute(
                    "aria-invalid"
                  );
                }
              );
            });
        });

      document
        .querySelectorAll(
          "[data-dcast-plane-submit]"
        )
        .forEach(function (button) {
          button.addEventListener(
            "click",
            function () {
              const formId =
                button.getAttribute(
                  "data-dcast-plane-submit"
                );

              const form =
                document.getElementById(formId);

              if (form) {
                form.requestSubmit();
              }
            }
          );
        });
    }
  );
})();
