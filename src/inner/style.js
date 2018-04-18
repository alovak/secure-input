export default function generateStyle(styles) {
  const WHITE_LISTED_PROPERTIES = [
    "::placeholder",
    "::selection",
    ":active",
    ":focus",
    ":hover",
    "backgroundColor",
    "color",
    "fontFamily",
    "fontSize",
    "fontSmoothing",
    "fontStyle",
    "fontVariant",
    "fontWeight",
    "letterSpacing",
    "lineHeight",
    "textDecoration",
    "textShadow",
    "textTransform"
  ];

  const selectors = {
    base: '.PowerInput',
    invalid: '.PowerInput--invalid'
  }

  const styleEl = document.createElement("style");

  document.head.appendChild(styleEl);

  const styleSheet = styleEl.sheet;

  const applyStyle = function(selector, properties) {
    let baseIndex = styleSheet.insertRule(selector + " {}");

    Object.keys(properties).forEach(function(property) {
      if (WHITE_LISTED_PROPERTIES.indexOf(property) == -1) return;

      if (property.charAt() == ':') applyStyle(selector + property, properties[property]);

      styleSheet.cssRules[baseIndex].style[property] = properties[property];
    });
  }

  Object.keys(styles).forEach((variant) => {
    if (selectors[variant]) {
      applyStyle(selectors[variant], styles[variant]);
    }
  });
  
  // console.log(styleSheet);
}
