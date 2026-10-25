export const seoContent = `
## EXIF Metadata Remover (Zero-Retention Privacy)
Remove hidden EXIF metadata from photos and images before sharing on social media, job applications, or forums. Strip GPS coordinates, device models, camera serial numbers, and capture timestamps in 1 click.

## What is EXIF Data?
Exchangeable Image File Format (EXIF) metadata is automatically embedded into every photo taken by smartphones, DSLR cameras, and drones. It often contains sensitive personal privacy details:
* **Exact GPS Location:** Latitude, longitude, altitude, and physical address.
* **Camera & Device Information:** Smartphone model, serial number, lens parameters.
* **Personal Timestamps:** Exact date, time, and timezone of image capture.

## Key Features
* **100% In-Browser Privacy:** Image sanitization runs client-side. Your photos never leave your device.
* **Instant EXIF Inspector:** View all detected camera and GPS tags before cleaning.
* **Preserves Visual Resolution:** Strips binary metadata chunks without degrading visual clarity.
`;

export const faqs = [
  {
    question: "Why should I remove EXIF metadata?",
    answer:
      "Photos taken on modern smartphones contain your exact GPS home or work coordinates and camera identifiers. Removing EXIF data protects your privacy and prevents third parties from tracking your physical whereabouts.",
  },
  {
    question: "Does removing EXIF reduce photo quality?",
    answer:
      "No. EXIF data consists only of textual metadata headers stored inside the image file structure. Stripping it leaves the pixel data intact while reducing file size.",
  },
  {
    question: "Do my photos get uploaded to a server?",
    answer:
      "No. All image processing happens locally within your browser tab using the HTML5 Canvas API. ZORIQ never accesses, saves, or transmits your photos.",
  },
];

export { ExifWorkspace } from "./components/exif-workspace";
