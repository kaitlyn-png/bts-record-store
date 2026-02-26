class BtsWindow extends HTMLElement {
  static stylesheetHref = "";

  static get observedAttributes() {
    return [
      "heading",
      "message",
      "width",
      "left",
      "top",
      "position",
      "size",
      "z-index",
      "image-src",
      "image-alt",
      "button-text",
      "button-href",
    ];
  }

  static getStylesheetHref() {
    if (BtsWindow.stylesheetHref) {
      return BtsWindow.stylesheetHref;
    }

    const scriptElement = document.querySelector('script[src$="script.js"]');
    const scriptUrl = scriptElement
      ? new URL(scriptElement.getAttribute("src"), document.baseURI)
      : new URL("script.js", document.baseURI);

    BtsWindow.stylesheetHref = new URL("styles/bts-window.css", scriptUrl).href;
    return BtsWindow.stylesheetHref;
  }

  connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
    }

    this.render();
  }

  attributeChangedCallback() {
    if (this.shadowRoot) {
      this.render();
    }
  }

  getCssValue(value, fallback = "") {
    if (!value) return fallback;

    if (/^\d+(\.\d+)?$/.test(value.trim())) {
      return `${value.trim()}px`;
    }

    return value;
  }

  render() {
    const heading = this.getAttribute("heading") || "Welcome";
    const message = this.getAttribute("message") || 'Click “Open” to Enter!';
    const imageSrc = this.getAttribute("image-src") || "";
    const imageAlt = this.getAttribute("image-alt") || heading;
    const buttonText = this.getAttribute("button-text") || "";
    const buttonHref = this.getAttribute("button-href") || "";
    const hasCustomContent = this.childElementCount > 0;
    const width = this.getCssValue(this.getAttribute("width"), "min(680px, 96vw)");
    const left = this.getCssValue(this.getAttribute("left"));
    const top = this.getCssValue(this.getAttribute("top"));
    const positionAttr = this.getAttribute("position");
    const rawSize = this.getAttribute("size");
    const size = rawSize === "small" || rawSize === "large" ? rawSize : "default";
    const zIndex = this.getAttribute("z-index") || "1";

    const sizeStyles = {
      small: {
        borderSize: "4px",
        titlePadding: "8px 12px",
        titleFontSize: "clamp(22px, 3.4vw, 34px)",
        contentMinHeight: "96px",
        contentPadding: "14px 12px",
        messageFontSize: "clamp(18px, 3.2vw, 32px)",
        buttonFontSize: "16px",
        buttonPadding: "7px 16px",
        imageMaxWidth: "700px",
      },
      default: {
        borderSize: "5px",
        titlePadding: "10px 16px",
        titleFontSize: "clamp(30px, 5vw, 52px)",
        contentMinHeight: "140px",
        contentPadding: "22px 20px",
        messageFontSize: "clamp(24px, 4.8vw, 56px)",
        buttonFontSize: "18px",
        buttonPadding: "8px 18px",
        imageMaxWidth: "980px",
      },
      large: {
        borderSize: "6px",
        titlePadding: "12px 20px",
        titleFontSize: "clamp(36px, 5.8vw, 64px)",
        contentMinHeight: "180px",
        contentPadding: "30px 26px",
        messageFontSize: "clamp(30px, 5.4vw, 66px)",
        buttonFontSize: "20px",
        buttonPadding: "10px 22px",
        imageMaxWidth: "1200px",
      },
    };

    const {
      borderSize,
      titlePadding,
      titleFontSize,
      contentMinHeight,
      contentPadding,
      messageFontSize,
      buttonFontSize,
      buttonPadding,
      imageMaxWidth,
    } = sizeStyles[size];

    this.style.zIndex = zIndex;

    const computedPosition = positionAttr || (left || top ? "absolute" : "static");
    this.style.width = hasCustomContent ? "fit-content" : width;
    this.style.maxWidth = "100%";
    this.toggleAttribute("content-fit", hasCustomContent);
    this.style.position = computedPosition;
    this.style.left = left || "";
    this.style.top = top || "";

    const contentMinHeightValue = hasCustomContent ? "0" : contentMinHeight;
    const contentAlignValue = hasCustomContent ? "stretch" : "center";
    const contentJustifyValue = hasCustomContent ? "flex-start" : "center";
    const contentTextAlignValue = hasCustomContent ? "left" : "center";

    this.style.setProperty("--bw-border-size", borderSize);
    this.style.setProperty("--bw-title-padding", titlePadding);
    this.style.setProperty("--bw-title-font-size", titleFontSize);
    this.style.setProperty("--bw-content-min-height", contentMinHeightValue);
    this.style.setProperty("--bw-content-padding", contentPadding);
    this.style.setProperty("--bw-content-align", contentAlignValue);
    this.style.setProperty("--bw-content-justify", contentJustifyValue);
    this.style.setProperty("--bw-content-text-align", contentTextAlignValue);
    this.style.setProperty("--bw-message-font-size", messageFontSize);
    this.style.setProperty("--bw-button-font-size", buttonFontSize);
    this.style.setProperty("--bw-button-padding", buttonPadding);
    this.style.setProperty("--bw-image-max-width", imageMaxWidth);

    const buttonMarkup = buttonText
      ? buttonHref
        ? `<a class="window-button" href="${buttonHref}">${buttonText}</a>`
        : `<button class="window-button" type="button">${buttonText}</button>`
      : "";

    const contentMarkup = hasCustomContent
      ? `<slot></slot>${buttonMarkup}`
      : imageSrc
        ? `<img class="window-image" src="${imageSrc}" alt="${imageAlt}" />${buttonMarkup}`
        : `<p class="message">${message}</p>${buttonMarkup}`;

    const stylesheetHref = BtsWindow.getStylesheetHref();

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${stylesheetHref}" />

      <section class="window" role="region" aria-label="${heading} Window">
        <header class="title-bar">
          <h2 class="title">${heading}</h2>
        </header>
        <div class="content">
          ${contentMarkup}
        </div>
      </section>
    `;
  }
}

customElements.define("bts-window", BtsWindow);