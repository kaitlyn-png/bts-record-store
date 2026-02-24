class BtsWindow extends HTMLElement {
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
    this.style.width = width;
    this.style.position = computedPosition;
    this.style.left = left || "";
    this.style.top = top || "";

    const buttonMarkup = buttonText
      ? buttonHref
        ? `<a class="window-button" href="${buttonHref}">${buttonText}</a>`
        : `<button class="window-button" type="button">${buttonText}</button>`
      : "";

    const contentMarkup = imageSrc
      ? `<img class="window-image" src="${imageSrc}" alt="${imageAlt}" />${buttonMarkup}`
      : `<p class="message">${message}</p>${buttonMarkup}`;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        .window {
          border: ${borderSize} solid #0f0018;
          background: #ffffff;
          color: #1a0026;
          font-family: "Courier New", Courier, monospace;
        }

        .title-bar {
          background: #cdbcde;
          border-bottom: ${borderSize} solid #0f0018;
          padding: ${titlePadding};
        }

        .title {
          margin: 0;
          font-size: ${titleFontSize};
          font-weight: 700;
          line-height: 1.05;
        }

        .content {
          min-height: ${contentMinHeight};
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          text-align: center;
          padding: ${contentPadding};
        }

        .message {
          margin: 0;
          font-size: ${messageFontSize};
          font-weight: 700;
          line-height: 1.08;
        }

        .window-image {
          display: block;
          width: min(100%, ${imageMaxWidth});
          height: auto;
        }

        .window-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: ${borderSize} solid #0f0018;
          background: #ffffff;
          color: #1a0026;
          font-family: "Courier New", Courier, monospace;
          font-weight: 700;
          font-size: ${buttonFontSize};
          line-height: 1;
          text-decoration: none;
          padding: ${buttonPadding};
          cursor: pointer;
        }

        .window-button:hover {
          background: #f2f2f2;
        }
      </style>

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