import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";

export interface CropBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WatermarkOptions {
  text: string;
  color?: string; // hex
  opacity?: number;
  fontSize?: number;
  rotation?: number; // degrees
}

export interface PageNumberOptions {
  position:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  fontSize?: number;
  startFrom?: number;
}

// Utility to convert Uint8Array safely to Blob avoiding strict array buffer type issues
function uint8ArrayToBlob(
  arr: Uint8Array,
  mimeType: string = "application/pdf",
): Blob {
  return new Blob([arr.buffer as BlobPart], { type: mimeType });
}

export interface PDFProcessingEngine {
  // Phase 1 (Functional client-side)
  merge(files: File[]): Promise<Blob>;
  split(file: File, ranges: string): Promise<Blob[]>;
  compress(file: File, quality: number): Promise<Blob>;
  removePages(file: File, pages: number[]): Promise<Blob>;
  extractPages(file: File, pages: number[]): Promise<Blob>;
  rotate(file: File, rotation: number): Promise<Blob>; // rotation in degrees e.g. 90, 180, 270
  crop(file: File, cropBox: CropBox): Promise<Blob>;
  watermark(file: File, options: WatermarkOptions): Promise<Blob>;
  addPageNumbers(file: File, options: PageNumberOptions): Promise<Blob>;
  protect(file: File, password: string): Promise<Blob>;
  unlock(file: File, password: string): Promise<Blob>;
  sign(
    file: File,
    signatureDataUrl: string,
    pageNumber: number,
    position: { x: number; y: number },
  ): Promise<Blob>;
  imageToPdf(images: File[]): Promise<Blob>;
  pdfToImages(file: File): Promise<string[]>; // Returns array of PNG base64/object URLs
  pdfPageToImage(file: File, pageNum?: number): Promise<string>;

  // Phase 2 (Abstract stubs for API conversions)
  convertToPdf(file: File, fromFormat: string): Promise<Blob>;
  convertFromPdf(file: File, toFormat: string): Promise<Blob>;
  ocr(file: File): Promise<string>;
  repair(file: File): Promise<Blob>;
}

// Browser Implementation of PDF Engine
export class BrowserPDFEngine implements PDFProcessingEngine {
  async merge(files: File[]): Promise<Blob> {
    const mergedDoc = await PDFDocument.create();
    for (const file of files) {
      const fileBytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(fileBytes);
      const copiedPages = await mergedDoc.copyPages(doc, doc.getPageIndices());
      copiedPages.forEach((page) => mergedDoc.addPage(page));
    }
    const pdfBytes = await mergedDoc.save();
    return uint8ArrayToBlob(pdfBytes);
  }

  async split(file: File, ranges: string): Promise<Blob[]> {
    const fileBytes = await file.arrayBuffer();
    const sourceDoc = await PDFDocument.load(fileBytes);
    const totalPages = sourceDoc.getPageCount();
    const blobs: Blob[] = [];

    // Parse ranges like "1-3, 5, 8-10"
    const pageGroups = ranges.split(",").map((r) => r.trim());

    for (const group of pageGroups) {
      const parts = group.split("-").map(Number);
      let start = parts[0];
      let end = parts[1] || start;

      if (!start || isNaN(start) || start < 1) continue;
      start = Math.min(start, totalPages);
      end = Math.min(end, totalPages);

      const subDoc = await PDFDocument.create();
      const pageIndices = [];
      for (let i = start - 1; i < end; i++) {
        pageIndices.push(i);
      }
      const copied = await subDoc.copyPages(sourceDoc, pageIndices);
      copied.forEach((p) => subDoc.addPage(p));

      const pdfBytes = await subDoc.save();
      blobs.push(uint8ArrayToBlob(pdfBytes));
    }

    return blobs;
  }

  async compress(file: File, quality: number): Promise<Blob> {
    if (typeof window === "undefined") {
      const fileBytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(fileBytes);
      const pdfBytes = await doc.save();
      return uint8ArrayToBlob(pdfBytes);
    }

    // Lazy load pdfjs inside browser context
    const pdfjs = await import("pdfjs-dist");
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

    const fileBytes = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: fileBytes });
    const pdf = await loadingTask.promise;

    const compressedDoc = await PDFDocument.create();

    // Scale viewport and recompress images based on quality selection
    const scale = 0.6 + (quality / 100) * 0.9;
    const imgQuality = quality / 100;

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) continue;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: context,
        viewport,
        canvas,
      }).promise;

      // Render canvas as highly compressed JPEG
      const imgDataUrl = canvas.toDataURL("image/jpeg", imgQuality);
      const imgBytes = await fetch(imgDataUrl).then((res) => res.arrayBuffer());

      const newPage = compressedDoc.addPage([viewport.width, viewport.height]);
      const embeddedImg = await compressedDoc.embedJpg(imgBytes);

      newPage.drawImage(embeddedImg, {
        x: 0,
        y: 0,
        width: viewport.width,
        height: viewport.height,
      });
    }

    const pdfBytes = await compressedDoc.save({ useObjectStreams: true });
    return uint8ArrayToBlob(pdfBytes);
  }

  async removePages(file: File, pages: number[]): Promise<Blob> {
    const fileBytes = await file.arrayBuffer();
    const doc = await PDFDocument.load(fileBytes);

    // Create new document excluding selected page numbers (1-indexed)
    const newDoc = await PDFDocument.create();
    const totalPages = doc.getPageCount();
    const pageIndices = [];

    for (let i = 0; i < totalPages; i++) {
      if (!pages.includes(i + 1)) {
        pageIndices.push(i);
      }
    }

    if (pageIndices.length > 0) {
      const copied = await newDoc.copyPages(doc, pageIndices);
      copied.forEach((p) => newDoc.addPage(p));
    }

    const pdfBytes = await newDoc.save();
    return uint8ArrayToBlob(pdfBytes);
  }

  async extractPages(file: File, pages: number[]): Promise<Blob> {
    const fileBytes = await file.arrayBuffer();
    const doc = await PDFDocument.load(fileBytes);
    const newDoc = await PDFDocument.create();

    const pageIndices = pages
      .map((p) => p - 1)
      .filter((idx) => idx >= 0 && idx < doc.getPageCount());

    if (pageIndices.length > 0) {
      const copied = await newDoc.copyPages(doc, pageIndices);
      copied.forEach((p) => newDoc.addPage(p));
    }

    const pdfBytes = await newDoc.save();
    return uint8ArrayToBlob(pdfBytes);
  }

  async rotate(file: File, rotation: number): Promise<Blob> {
    const fileBytes = await file.arrayBuffer();
    const doc = await PDFDocument.load(fileBytes);

    doc.getPages().forEach((page) => {
      const current = page.getRotation().angle;
      page.setRotation(degrees((current + rotation) % 360));
    });

    const pdfBytes = await doc.save();
    return uint8ArrayToBlob(pdfBytes);
  }

  async crop(file: File, cropBox: CropBox): Promise<Blob> {
    const fileBytes = await file.arrayBuffer();
    const doc = await PDFDocument.load(fileBytes);

    doc.getPages().forEach((page) => {
      // Modify page CropBox boundary values (1-indexed)
      page.setCropBox(cropBox.x, cropBox.y, cropBox.width, cropBox.height);
    });

    const pdfBytes = await doc.save();
    return uint8ArrayToBlob(pdfBytes);
  }

  async watermark(file: File, options: WatermarkOptions): Promise<Blob> {
    const fileBytes = await file.arrayBuffer();
    const doc = await PDFDocument.load(fileBytes);
    const font = await doc.embedFont(StandardFonts.HelveticaBold);

    const colorHex = options.color || "#6C3AED";
    const opacity = options.opacity !== undefined ? options.opacity : 0.3;
    const size = options.fontSize || 40;
    const rotateAngle = options.rotation !== undefined ? options.rotation : 45;

    // Parse hex color to rgb percentage
    const r = parseInt(colorHex.substring(1, 3), 16) / 255;
    const g = parseInt(colorHex.substring(3, 5), 16) / 255;
    const b = parseInt(colorHex.substring(5, 7), 16) / 255;

    doc.getPages().forEach((page) => {
      const { width, height } = page.getSize();
      page.drawText(options.text, {
        x: width / 4,
        y: height / 2,
        size,
        font,
        color: rgb(r, g, b),
        opacity,
        rotate: degrees(rotateAngle),
      });
    });

    const pdfBytes = await doc.save();
    return uint8ArrayToBlob(pdfBytes);
  }

  async addPageNumbers(file: File, options: PageNumberOptions): Promise<Blob> {
    const fileBytes = await file.arrayBuffer();
    const doc = await PDFDocument.load(fileBytes);
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const size = options.fontSize || 10;
    const start = options.startFrom || 1;
    const totalPages = doc.getPageCount();

    for (let i = 0; i < totalPages; i++) {
      const page = doc.getPage(i);
      const { width, height } = page.getSize();
      const pageText = `${start + i} of ${totalPages + start - 1}`;

      let x = width / 2;
      let y = 30;

      // Position logic mapping
      switch (options.position) {
        case "top-left":
          x = 30;
          y = height - 30;
          break;
        case "top-center":
          x = width / 2 - 15;
          y = height - 30;
          break;
        case "top-right":
          x = width - 60;
          y = height - 30;
          break;
        case "bottom-left":
          x = 30;
          y = 30;
          break;
        case "bottom-center":
          x = width / 2 - 15;
          y = 30;
          break;
        case "bottom-right":
          x = width - 60;
          y = 30;
          break;
      }

      page.drawText(pageText, {
        x,
        y,
        size,
        font,
        color: rgb(0.5, 0.5, 0.5),
      });
    }

    const pdfBytes = await doc.save();
    return uint8ArrayToBlob(pdfBytes);
  }

  async protect(file: File, _password: string): Promise<Blob> {
    // Note: Pure client-side PDF encryption/protection is not natively supported by pdf-lib.
    // It will be fully integrated via serverless execution in Phase 2.
    // For now, we return the original document back as a stub.
    const fileBytes = await file.arrayBuffer();
    const doc = await PDFDocument.load(fileBytes);
    const pdfBytes = await doc.save();
    return uint8ArrayToBlob(pdfBytes);
  }

  async unlock(file: File, _password: string): Promise<Blob> {
    // Note: Pure client-side PDF decryption is not natively supported by pdf-lib.
    // It will be fully integrated via serverless execution in Phase 2.
    // For now, we return the original document back as a stub.
    const fileBytes = await file.arrayBuffer();
    const doc = await PDFDocument.load(fileBytes);
    const pdfBytes = await doc.save();
    return uint8ArrayToBlob(pdfBytes);
  }

  async sign(
    file: File,
    signatureDataUrl: string,
    pageNumber: number,
    position: { x: number; y: number },
  ): Promise<Blob> {
    const fileBytes = await file.arrayBuffer();
    const doc = await PDFDocument.load(fileBytes);

    const pages = doc.getPages();
    const idx = Math.min(Math.max(pageNumber - 1, 0), pages.length - 1);
    const page = pages[idx];

    if (page) {
      // Embed transparent PNG signature overlay
      const signatureImageBytes = await fetch(signatureDataUrl).then((res) =>
        res.arrayBuffer(),
      );
      const signatureImage = await doc.embedPng(signatureImageBytes);

      const width = 150;
      const height = (signatureImage.height / signatureImage.width) * width;

      page.drawImage(signatureImage, {
        x: position.x,
        y: position.y,
        width,
        height,
      });
    }

    const pdfBytes = await doc.save();
    return uint8ArrayToBlob(pdfBytes);
  }

  async imageToPdf(images: File[]): Promise<Blob> {
    const doc = await PDFDocument.create();

    for (const image of images) {
      const imgBytes = await image.arrayBuffer();
      const page = doc.addPage();
      const { width: pageWidth, height: pageHeight } = page.getSize();

      let embeddedImage;
      const ext = image.name.split(".").pop()?.toLowerCase();

      if (ext === "png") {
        embeddedImage = await doc.embedPng(imgBytes);
      } else {
        embeddedImage = await doc.embedJpg(imgBytes);
      }

      // Resize logic to fit page margins
      const scale = Math.min(
        pageWidth / embeddedImage.width,
        pageHeight / embeddedImage.height,
      );
      const imgWidth = embeddedImage.width * scale;
      const imgHeight = embeddedImage.height * scale;

      page.drawImage(embeddedImage, {
        x: (pageWidth - imgWidth) / 2,
        y: (pageHeight - imgHeight) / 2,
        width: imgWidth,
        height: imgHeight,
      });
    }

    const pdfBytes = await doc.save();
    return uint8ArrayToBlob(pdfBytes);
  }

  async pdfToImages(file: File): Promise<string[]> {
    if (typeof window === "undefined") return [];

    // Lazy load pdfjs inside browser context
    const pdfjs = await import("pdfjs-dist");

    // Set worker unpkg URL based on current version
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

    const fileBytes = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: fileBytes });
    const pdf = await loadingTask.promise;
    const imageUrls: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) continue;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: context,
        viewport,
        canvas,
      }).promise;

      imageUrls.push(canvas.toDataURL("image/png"));
    }

    return imageUrls;
  }

  async pdfPageToImage(file: File, pageNum: number = 1): Promise<string> {
    if (typeof window === "undefined") return "";

    const pdfjs = await import("pdfjs-dist");
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

    const fileBytes = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: fileBytes });
    const pdf = await loadingTask.promise;

    const pageIndex = Math.min(Math.max(pageNum, 1), pdf.numPages);
    const page = await pdf.getPage(pageIndex);
    const viewport = page.getViewport({ scale: 1.0 });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return "";

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport,
      canvas,
    }).promise;

    return canvas.toDataURL("image/png");
  }

  // Phase 2 / API conversions - Expose processing stubs to plug API/AI models without UI revisions
  async convertToPdf(_file: File, fromFormat: string): Promise<Blob> {
    throw new Error(
      `Converting ${fromFormat.toUpperCase()} to PDF requires API integration (Phase 2).`,
    );
  }

  async convertFromPdf(_file: File, toFormat: string): Promise<Blob> {
    throw new Error(
      `Converting PDF to ${toFormat.toUpperCase()} requires API integration (Phase 2).`,
    );
  }

  async ocr(_file: File): Promise<string> {
    throw new Error(
      "Optical Character Recognition (OCR) requires API integration (Phase 2).",
    );
  }

  async repair(_file: File): Promise<Blob> {
    throw new Error(
      "Repairing corrupted PDF documents requires API integration (Phase 2).",
    );
  }
}

// Global Exported Service Wrapper
export const pdfEngineService = new BrowserPDFEngine();
