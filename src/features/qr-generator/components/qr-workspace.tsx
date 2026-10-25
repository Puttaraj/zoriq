"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import QRCode from "qrcode";
import {
  QrCode,
  Download,
  Link2,
  Wifi,
  Mail,
  UserPlus,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

type QrType = "url" | "wifi" | "email" | "vcard" | "text";

export function QrWorkspace() {
  const [qrType, setQrType] = useState<QrType>("url");
  const [urlValue, setUrlValue] = useState("https://www.zoriq.co.in");
  const [textValue, setTextValue] = useState("");

  // WiFi state
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [encryption, setEncryption] = useState("WPA");
  const [hidden, setHidden] = useState(false);

  // Email state
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  // vCard state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [vCardEmail, setVCardEmail] = useState("");
  const [org, setOrg] = useState("");
  const [vCardUrl, setVCardUrl] = useState("");

  // Style customization
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [errorCorrection, setErrorCorrection] = useState<"L" | "M" | "Q" | "H">(
    "M",
  );
  const [size, setSize] = useState(256);

  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getPayload = useCallback(() => {
    switch (qrType) {
      case "url":
        return urlValue || "https://www.zoriq.co.in";
      case "text":
        return textValue || "ZORIQ Tools";
      case "wifi":
        return `WIFI:S:${ssid};T:${encryption};P:${password};H:${hidden ? "true" : ""};;`;
      case "email":
        return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      case "vcard":
        return `BEGIN:VCARD\nVERSION:3.0\nN:${lastName};${firstName};;;\nFN:${firstName} ${lastName}\nORG:${org}\nTEL;TYPE=CELL:${phone}\nEMAIL;TYPE=PREF,INTERNET:${vCardEmail}\nURL:${vCardUrl}\nEND:VCARD`;
      default:
        return "";
    }
  }, [
    qrType,
    urlValue,
    textValue,
    ssid,
    password,
    encryption,
    hidden,
    email,
    subject,
    body,
    firstName,
    lastName,
    phone,
    vCardEmail,
    org,
    vCardUrl,
  ]);

  const generateQRCode = useCallback(async () => {
    const payload = getPayload();
    if (!payload) return;

    try {
      // Draw onto hidden canvas to create data URL for preview and download
      const canvas = canvasRef.current;
      if (canvas) {
        await QRCode.toCanvas(canvas, payload, {
          width: size,
          margin: 2,
          color: {
            dark: fgColor,
            light: bgColor,
          },
          errorCorrectionLevel: errorCorrection,
        });
        const dataUrl = canvas.toDataURL("image/png");
        setQrCodeUrl(dataUrl);
      }
    } catch (err) {
      console.error("Failed to generate QR Code", err);
    }
  }, [getPayload, size, fgColor, bgColor, errorCorrection]);

  useEffect(() => {
    generateQRCode();
  }, [generateQRCode]);

  const downloadQR = (format: "png" | "svg") => {
    const payload = getPayload();
    if (!payload) return;

    if (format === "png") {
      const link = document.createElement("a");
      link.href = qrCodeUrl;
      link.download = `zoriq-qrcode.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Generate SVG string using QRCode package
      QRCode.toString(
        payload,
        {
          type: "svg",
          width: size,
          margin: 2,
          color: {
            dark: fgColor,
            light: bgColor,
          },
          errorCorrectionLevel: errorCorrection,
        },
        (err, string) => {
          if (err) return console.error(err);
          const blob = new Blob([string], { type: "image/svg+xml" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "zoriq-qrcode.svg";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
        },
      );
    }
  };

  const tabs = [
    { key: "url", label: "Link/URL", icon: Link2 },
    { key: "wifi", label: "WiFi", icon: Wifi },
    { key: "email", label: "Email", icon: Mail },
    { key: "vcard", label: "vCard", icon: UserPlus },
    { key: "text", label: "Plain Text", icon: FileText },
  ] as const;

  return (
    <div className="border-border/60 bg-card shadow-soft mx-auto max-w-4xl rounded-2xl border p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Side: Controls & Input */}
        <div className="flex flex-col gap-6 lg:col-span-7">
          {/* Tabs */}
          <div className="bg-muted/40 flex flex-wrap gap-1.5 rounded-lg p-1">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setQrType(tab.key)}
                  className={cn(
                    "focus-ring flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-semibold transition-all",
                    qrType === tab.key
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <TabIcon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Form Inputs */}
          <div className="flex flex-col gap-4">
            {qrType === "url" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-foreground text-sm font-semibold">
                  Website URL
                </label>
                <input
                  type="url"
                  value={urlValue}
                  onChange={(e) => setUrlValue(e.target.value)}
                  placeholder="https://example.com"
                  className="border-border bg-background focus:border-primary rounded-lg border px-3 py-2 text-sm outline-none"
                  aria-label="Website URL"
                />
              </div>
            )}

            {qrType === "text" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-foreground text-sm font-semibold">
                  Text Content
                </label>
                <textarea
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  placeholder="Type your message here..."
                  rows={4}
                  className="border-border bg-background focus:border-primary resize-none rounded-lg border px-3 py-2 text-sm outline-none"
                  aria-label="Text Content"
                />
              </div>
            )}

            {qrType === "wifi" && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-foreground text-sm font-semibold">
                    Network Name (SSID)
                  </label>
                  <input
                    type="text"
                    value={ssid}
                    onChange={(e) => setSsid(e.target.value)}
                    placeholder="My WiFi Network"
                    className="border-border bg-background focus:border-primary rounded-lg border px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-foreground text-sm font-semibold">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="border-border bg-background focus:border-primary rounded-lg border px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-foreground text-sm font-semibold">
                    Network Type
                  </label>
                  <select
                    value={encryption}
                    onChange={(e) => setEncryption(e.target.value)}
                    className="border-border bg-background focus:border-primary rounded-lg border px-3 py-2 text-sm outline-none"
                  >
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">Unsecured</option>
                  </select>
                </div>
                <label className="flex cursor-pointer items-center gap-3 p-3 select-none">
                  <input
                    type="checkbox"
                    checked={hidden}
                    onChange={(e) => setHidden(e.target.checked)}
                    className="border-border text-primary focus:ring-primary h-4.5 w-4.5 rounded"
                  />
                  <span className="text-foreground text-sm font-medium">
                    Hidden Network
                  </span>
                </label>
              </div>
            )}

            {qrType === "email" && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-foreground text-sm font-semibold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hello@zoriq.co.in"
                    className="border-border bg-background focus:border-primary rounded-lg border px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-foreground text-sm font-semibold">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Feedback / Inquiry"
                    className="border-border bg-background focus:border-primary rounded-lg border px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-foreground text-sm font-semibold">
                    Body Message
                  </label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write your email body..."
                    rows={3}
                    className="border-border bg-background focus:border-primary resize-none rounded-lg border px-3 py-2 text-sm outline-none"
                  />
                </div>
              </div>
            )}

            {qrType === "vcard" && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-foreground text-sm font-semibold">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="border-border bg-background focus:border-primary rounded-lg border px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-foreground text-sm font-semibold">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="border-border bg-background focus:border-primary rounded-lg border px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-foreground text-sm font-semibold">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="border-border bg-background focus:border-primary rounded-lg border px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-foreground text-sm font-semibold">
                    Email
                  </label>
                  <input
                    type="email"
                    value={vCardEmail}
                    onChange={(e) => setVCardEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="border-border bg-background focus:border-primary rounded-lg border px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-foreground text-sm font-semibold">
                    Organization / Company
                  </label>
                  <input
                    type="text"
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    placeholder="Acme Corp"
                    className="border-border bg-background focus:border-primary rounded-lg border px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-foreground text-sm font-semibold">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={vCardUrl}
                    onChange={(e) => setVCardUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="border-border bg-background focus:border-primary rounded-lg border px-3 py-2 text-sm outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Customize Stylings */}
          <div className="border-border/60 flex flex-col gap-4 border-t pt-4">
            <h3 className="text-foreground text-sm font-semibold">
              Colors & Settings
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-muted-foreground text-xs font-semibold">
                  Foreground Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
                    aria-label="Foreground color"
                  />
                  <span className="font-mono text-xs uppercase">{fgColor}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-muted-foreground text-xs font-semibold">
                  Background Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
                    aria-label="Background color"
                  />
                  <span className="font-mono text-xs uppercase">{bgColor}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-muted-foreground text-xs font-semibold">
                  Correction Level
                </label>
                <select
                  value={errorCorrection}
                  onChange={(e) =>
                    setErrorCorrection(e.target.value as "L" | "M" | "Q" | "H")
                  }
                  className="border-border bg-background focus:border-primary h-8 rounded-lg border px-2.5 py-1 text-xs outline-none"
                  aria-label="Error Correction Level"
                >
                  <option value="L">L (7% Recovery)</option>
                  <option value="M">M (15% Recovery)</option>
                  <option value="Q">Q (25% Recovery)</option>
                  <option value="H">H (30% Recovery)</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-muted-foreground text-xs font-semibold">
                  Image Size (px)
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="border-border bg-background focus:border-primary h-8 rounded-lg border px-2.5 py-1 text-xs outline-none"
                  aria-label="Image Size"
                >
                  <option value="128">128 x 128</option>
                  <option value="256">256 x 256</option>
                  <option value="384">384 x 384</option>
                  <option value="512">512 x 512</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: QR Code Preview & Download */}
        <div className="lg:border-border/60 flex flex-col items-center justify-center gap-6 lg:col-span-5 lg:border-l lg:pl-8">
          <span className="text-foreground self-start text-sm font-semibold lg:self-center">
            Live Preview
          </span>

          <div className="border-border bg-muted/10 flex h-64 w-64 items-center justify-center rounded-xl border p-4 shadow-inner">
            {qrCodeUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrCodeUrl}
                alt="QR Code Preview"
                className="h-full w-full object-contain"
              />
            ) : (
              <QrCode className="text-muted-foreground/30 h-16 w-16 animate-pulse" />
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />

          {/* Download Buttons */}
          <div className="flex w-full flex-col gap-2">
            <button
              type="button"
              onClick={() => downloadQR("png")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 focus-ring inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold shadow-sm transition-all"
            >
              <Download className="h-4 w-4" />
              Download PNG
            </button>
            <button
              type="button"
              onClick={() => downloadQR("svg")}
              className="border-border bg-card hover:bg-muted focus-ring inline-flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-all"
            >
              <Download className="h-4 w-4" />
              Download SVG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
