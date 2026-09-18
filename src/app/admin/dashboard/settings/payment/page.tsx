"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Upload,
  X,
  Plus,
  Trash2,
  QrCode,
  Loader2,
  Save,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";

interface PaymentSettings {
  qrCodeUrl: string | null;
  upiIds: string[];
  instructions: string;
  bankDetails: {
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  } | null;
  enabled: boolean;
}

export default function PaymentSettingsPage() {
  const [settings, setSettings] = useState<PaymentSettings>({
    qrCodeUrl: null,
    upiIds: [],
    instructions: "",
    bankDetails: null,
    enabled: true,
  });
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [qrPreview, setQrPreview] = useState<string | null>(null);
  const [newUpiId, setNewUpiId] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/settings/payment");
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings || settings);
        if (data.settings?.qrCodeUrl) {
          setQrPreview(data.settings.qrCodeUrl);
        }
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setQrFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeQrCode = () => {
    setQrFile(null);
    setQrPreview(null);
    setSettings({ ...settings, qrCodeUrl: null });
  };

  const addUpiId = () => {
    if (!newUpiId.trim()) {
      toast.error("Please enter a UPI ID");
      return;
    }
    if (settings.upiIds.includes(newUpiId.trim())) {
      toast.error("UPI ID already exists");
      return;
    }
    setSettings({
      ...settings,
      upiIds: [...settings.upiIds, newUpiId.trim()],
    });
    setNewUpiId("");
  };

  const removeUpiId = (index: number) => {
    setSettings({
      ...settings,
      upiIds: settings.upiIds.filter((_, i) => i !== index),
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let qrCodeUrl = settings.qrCodeUrl;

      // Upload QR code if new file selected
      if (qrFile) {
        const formData = new FormData();
        formData.append("file", qrFile);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload QR code");
        }

        const uploadData = await uploadResponse.json();
        qrCodeUrl = uploadData.url;
      }

      // Save settings
      const response = await fetch("/api/admin/settings/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...settings,
          qrCodeUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      toast.success("Payment settings saved successfully!");
      fetchSettings();
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Settings</h1>
          <p className="mt-2 text-gray-600">
            Configure payment options for event registrations
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* QR Code Upload */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <QrCode className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Payment QR Code
            </h2>
          </div>

          {qrPreview ? (
            <div className="space-y-4">
              <div className="relative mx-auto w-full max-w-sm">
                <img
                  src={qrPreview}
                  alt="Payment QR Code"
                  className="w-full rounded-lg border-2 border-gray-200"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={removeQrCode}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById("qr-upload")?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Replace QR Code
              </Button>
            </div>
          ) : (
            <div
              className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-blue-500"
              onClick={() => document.getElementById("qr-upload")?.click()}
            >
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Click to upload QR code
              </p>
              <p className="mt-1 text-xs text-gray-500">PNG, JPG up to 5MB</p>
            </div>
          )}

          <input
            id="qr-upload"
            type="file"
            accept="image/*"
            onChange={handleQrUpload}
            className="hidden"
          />
        </Card>

        {/* UPI IDs */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">UPI IDs</h2>

          <div className="mb-4 space-y-3">
            {settings.upiIds.map((upi, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
              >
                <span className="font-mono text-sm text-gray-900">{upi}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeUpiId(index)}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {settings.upiIds.length === 0 && (
              <p className="py-4 text-center text-sm text-gray-500">
                No UPI IDs added yet
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Input
              value={newUpiId}
              onChange={(e) => setNewUpiId(e.target.value)}
              placeholder="username@upi"
              onKeyPress={(e) => e.key === "Enter" && addUpiId()}
            />
            <Button onClick={addUpiId}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Payment Instructions */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Payment Instructions
          </h2>
          <Textarea
            value={settings.instructions}
            onChange={(e) =>
              setSettings({ ...settings, instructions: e.target.value })
            }
            placeholder="Enter payment instructions for users..."
            rows={6}
            className="resize-none"
          />
          <p className="mt-2 text-xs text-gray-500">
            These instructions will be shown to users during payment
          </p>
        </Card>

        {/* Bank Details (Optional) */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Bank Account Details (Optional)
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="accountName">Account Holder Name</Label>
              <Input
                id="accountName"
                value={settings.bankDetails?.accountName || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    bankDetails: {
                      ...settings.bankDetails,
                      accountName: e.target.value,
                      accountNumber: settings.bankDetails?.accountNumber || "",
                      ifscCode: settings.bankDetails?.ifscCode || "",
                      bankName: settings.bankDetails?.bankName || "",
                    },
                  })
                }
                placeholder="John Doe"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={settings.bankDetails?.accountNumber || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    bankDetails: {
                      ...settings.bankDetails,
                      accountNumber: e.target.value,
                      accountName: settings.bankDetails?.accountName || "",
                      ifscCode: settings.bankDetails?.ifscCode || "",
                      bankName: settings.bankDetails?.bankName || "",
                    },
                  })
                }
                placeholder="1234567890"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="ifscCode">IFSC Code</Label>
              <Input
                id="ifscCode"
                value={settings.bankDetails?.ifscCode || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    bankDetails: {
                      ...settings.bankDetails,
                      ifscCode: e.target.value.toUpperCase(),
                      accountName: settings.bankDetails?.accountName || "",
                      accountNumber: settings.bankDetails?.accountNumber || "",
                      bankName: settings.bankDetails?.bankName || "",
                    },
                  })
                }
                placeholder="SBIN0001234"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                value={settings.bankDetails?.bankName || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    bankDetails: {
                      ...settings.bankDetails,
                      bankName: e.target.value,
                      accountName: settings.bankDetails?.accountName || "",
                      accountNumber: settings.bankDetails?.accountNumber || "",
                      ifscCode: settings.bankDetails?.ifscCode || "",
                    },
                  })
                }
                placeholder="State Bank of India"
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        {/* Enable/Disable */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Enable Payment Collection
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Allow users to make payments during registration
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) =>
                  setSettings({ ...settings, enabled: e.target.checked })
                }
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
            </label>
          </div>
        </Card>
      </div>
    </div>
  );
}
