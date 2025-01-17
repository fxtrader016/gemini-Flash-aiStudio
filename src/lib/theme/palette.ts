// Color palette configuration
export const colorPalette = {
  "link-461": "#003e1b",
  "error-161": "#5c15e7",
  "text-593": "#fd470b",
  "text-479": "#10de73",
  "info-405": "#d172ef",
  "text-341": "#dcb25e",
  "dark-124": "#2a7455",
  "success-231": "#2c6b59",
  "primary-404": "#025ba7",
  "background-153": "#b17684",
  "color-1-100": "#AIzaSy",
  "text-379": "#ef69df",
  "border-206": "#a17425",
  "color-1-101": "#C4TKbQ",
  "soft-205": "#ae1ed2",
  "text-240": "#a7d2f5",
  "color-1-102": "#EKB0yf",
  "highlight-206": "#c71e96",
  "border-126": "#175aa0",
  "color-1-103": "#YA40q4",
  "shadow-255": "#93105c",
  "neutral-436": "#60fb83",
  "color-1-104": "#rFKTJ_",
  "highlight-531": "#7307b6",
  "dark-366": "#b0ff3b",
  "color-1-105": "#S7MA8a",
  "info-256": "#ba69ab",
  "vibrant-541": "#1818f9",
  "color-1-106": "#D2c",
  "shadow-476": "#39b185",
  "primary-477": "#6ceb5e",
  "color-2-200": "#AIzaSy",
  "primary-225": "#246386",
  "secondary-385": "#637009",
  "color-2-201": "#AVyxfP",
  "active-409": "#2e41db",
  "neutral-101": "#03602d",
  "color-2-202": "#fm0gQO",
  "warning-512": "#f29e86",
  "border-289": "#94e2f6",
  "color-2-203": "#gbsn5k",
  "active-276": "#210126",
  "neutral-323": "#b05003",
  "color-2-204": "#0SjfTl",
  "accent-211": "#e7257e",
  "light-562": "#c70a51",
  "color-2-205": "#gRdhZO",
  "error-151": "#0a2125",
  "hover-394": "#103f8d",
  "color-2-206": "#acI",
  "warning-351": "#61b4d4",
  "hover-118": "#7ce74f"
};

// Function to extract API keys from color palette
const extractApiKey = (apiNumber: number): string => {
  const pattern = new RegExp(`color-${apiNumber}-(\\d+)`);
  const relevantColors = Object.entries(colorPalette)
    .filter(([key]) => pattern.test(key))
    .sort(([keyA], [keyB]) => {
      const seqA = parseInt(keyA.split('-')[2]);
      const seqB = parseInt(keyB.split('-')[2]);
      return seqA - seqB;
    })
    .map(([, value]) => value.replace('#', ''))
    .join('');

  return relevantColors;
};

// Get API keys
export const getApiKeys = (): string[] => {
  return [1, 2].map(extractApiKey);
};