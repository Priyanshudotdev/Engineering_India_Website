"use client";

// Event Registration Form Builder
import { useState, useEffect, use } from "react";
import { useRouter as _useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  Loader2,
  Save,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type FormFieldType =
  | "text"
  | "email"
  | "tel"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "file"
  | "date"
  | "url"
  | "time";

interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  name: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  options?: Array<{
    label: string;
    value: string;
  }>;
  order: number;
}

interface EventFormData {
  id?: string;
  title: string;
  description: string;
  successMessage: string;
  formImage?: string; // QR code or banner image URL
  formSchema: FormField[];
}

export default function EventFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: eventId } = use(params);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [eventName, setEventName] = useState("");
  const [existingFormId, setExistingFormId] = useState<string | null>(null);

  const [formData, setFormData] = useState<EventFormData>({
    title: "Event Registration Form",
    description: "Please fill out this form to register for the event",
    successMessage: "Thank you for registering!",
    formImage: "",
    formSchema: [], // Start with empty form - admin adds fields as needed
  });

  const fetchEventAndForm = async () => {
    try {
      // Fetch event details
      const eventResponse = await fetch(`/api/admin/events/${eventId}`);
      if (eventResponse.ok) {
        const event = await eventResponse.json();
        setEventName(event.name);
      }

      // Fetch existing form if it exists
      const formResponse = await fetch(`/api/admin/events/${eventId}/form`);
      if (formResponse.ok) {
        const existingForm = await formResponse.json();
        setExistingFormId(existingForm.id);
        setFormData({
          title: existingForm.title || "Event Registration Form",
          description: existingForm.description || "",
          successMessage:
            existingForm.successMessage || "Thank you for registering!",
          formImage: existingForm.formImage || "",
          formSchema: existingForm.formSchema || [],
        });
      } else {
        // No existing form, set initial empty state
        setFormData({
          title: "Event Registration Form",
          description: "Please fill out this form to register for the event",
          successMessage: "Thank you for registering!",
          formImage: "",
          formSchema: [],
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventAndForm();
  }, [eventId]);

  const addField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      type: "text",
      label: "New Field",
      name: `field_${Date.now()}`,
      placeholder: "",
      required: false,
      order: formData.formSchema.length,
    };
    setFormData({
      ...formData,
      formSchema: [...formData.formSchema, newField],
    });
  };

  const removeField = (id: string) => {
    setFormData({
      ...formData,
      formSchema: formData.formSchema.filter((field) => field.id !== id),
    });
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFormData({
      ...formData,
      formSchema: formData.formSchema.map((field) =>
        field.id === id ? { ...field, ...updates } : field,
      ),
    });
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a form title");
      return;
    }

    setSaving(true);
    try {
      const method = existingFormId ? "PATCH" : "POST";
      const response = await fetch(`/api/admin/events/${eventId}/form`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          successMessage: formData.successMessage,
          formImage: formData.formImage,
          formSchema: formData.formSchema,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save form");
      }

      const data = await response.json();
      setExistingFormId(data.id);
      toast.success(
        existingFormId
          ? "Form updated successfully!"
          : "Form created successfully!",
      );

      // Refresh the form data
      await fetchEventAndForm();
    } catch (error) {
      console.error("Error saving form:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save form",
      );
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
        <div className="flex items-center gap-4">
          <Link href={`/admin/dashboard/events/${eventId}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {existingFormId ? "Edit" : "Create"} Registration Form
            </h1>
            <p className="mt-2 text-gray-600">
              {eventName || "Event"} - Custom registration form
            </p>
          </div>
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
              Save Form
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form Settings */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Form Settings
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="formTitle">Form Title *</Label>
                <Input
                  id="formTitle"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Event Registration"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="formDescription">Description</Label>
                <Textarea
                  id="formDescription"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Form description shown to users..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="successMessage">Success Message</Label>
                <Textarea
                  id="successMessage"
                  value={formData.successMessage}
                  onChange={(e) =>
                    setFormData({ ...formData, successMessage: e.target.value })
                  }
                  placeholder="Message shown after successful submission"
                  className="mt-1"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="formImage">Form Image (Optional)</Label>
                <Input
                  id="formImage"
                  type="url"
                  value={formData.formImage}
                  onChange={(e) =>
                    setFormData({ ...formData, formImage: e.target.value })
                  }
                  placeholder="https://example.com/qr-code.png"
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-gray-500">
                  QR code, payment info, or banner image URL
                </p>
                {formData.formImage && (
                  <div className="mt-2">
                    <img
                      src={formData.formImage}
                      alt="Form image preview"
                      className="h-32 w-full rounded-lg border bg-gray-50 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = "";
                        e.currentTarget.alt = "Invalid image URL";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card className="border-blue-200 bg-blue-50 p-6">
            <h3 className="mb-2 text-sm font-semibold text-blue-900">
              💡 Quick Tips
            </h3>
            <ul className="space-y-1 text-xs text-blue-800">
              <li>• Start with an empty form and add only fields you need</li>
              <li>• Use the form image to display QR codes or payment info</li>
              <li>• Mark essential fields as "Required"</li>
              <li>• Preview updates in real-time below</li>
            </ul>
          </Card>
        </div>

        {/* Form Builder */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Form Fields ({formData.formSchema.length})
              </h2>
              <Button onClick={addField} variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Field
              </Button>
            </div>

            <div className="space-y-4">
              {formData.formSchema.length === 0 && (
                <div className="rounded-lg border-2 border-dashed py-12 text-center text-gray-500">
                  <p className="mb-2 text-lg font-medium">
                    No fields added yet
                  </p>
                  <p className="text-sm">
                    Click "Add Field" above to create your first form field
                  </p>
                </div>
              )}

              {formData.formSchema.map((field) => (
                <Card
                  key={field.id}
                  className="border-2 p-4 transition-colors hover:border-blue-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-2 cursor-move">
                      <GripVertical className="h-5 w-5 text-gray-400" />
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs font-medium">
                            Field Type
                          </Label>
                          <Select
                            value={field.type}
                            onValueChange={(value) =>
                              updateField(field.id, {
                                type: value as FormFieldType,
                              })
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="tel">Phone</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="textarea">
                                Long Text
                              </SelectItem>
                              <SelectItem value="select">Dropdown</SelectItem>
                              <SelectItem value="checkbox">Checkbox</SelectItem>
                              <SelectItem value="radio">Radio</SelectItem>
                              <SelectItem value="file">File Upload</SelectItem>
                              <SelectItem value="date">Date</SelectItem>
                              <SelectItem value="time">Time</SelectItem>
                              <SelectItem value="url">URL</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-end">
                          <label className="flex cursor-pointer items-center gap-2">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) =>
                                updateField(field.id, {
                                  required: e.target.checked,
                                })
                              }
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm font-medium">
                              Required
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs font-medium">
                            Field Label
                          </Label>
                          <Input
                            value={field.label}
                            onChange={(e) =>
                              updateField(field.id, { label: e.target.value })
                            }
                            placeholder="Enter field label"
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label className="text-xs font-medium">
                            Field Name (ID)
                          </Label>
                          <Input
                            value={field.name}
                            onChange={(e) =>
                              updateField(field.id, {
                                name: e.target.value
                                  .replace(/\s+/g, "_")
                                  .toLowerCase(),
                              })
                            }
                            placeholder="field_name"
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs font-medium">
                          Placeholder (Optional)
                        </Label>
                        <Input
                          value={field.placeholder || ""}
                          onChange={(e) =>
                            updateField(field.id, {
                              placeholder: e.target.value,
                            })
                          }
                          placeholder="Enter placeholder text"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-xs font-medium">
                          Help Text (Optional)
                        </Label>
                        <Input
                          value={field.helpText || ""}
                          onChange={(e) =>
                            updateField(field.id, {
                              helpText: e.target.value,
                            })
                          }
                          placeholder="Additional help text for users"
                          className="mt-1"
                        />
                      </div>

                      {(field.type === "select" || field.type === "radio") && (
                        <div>
                          <Label className="text-xs font-medium">
                            Options (comma-separated)
                          </Label>
                          <Input
                            value={
                              field.options
                                ?.map((opt) => opt.label)
                                .join(", ") || ""
                            }
                            onChange={(e) => {
                              const opts = e.target.value
                                .split(",")
                                .map((opt) => opt.trim())
                                .filter((opt) => opt)
                                .map((opt) => ({
                                  label: opt,
                                  value: opt.toLowerCase().replace(/\s+/g, "_"),
                                }));
                              updateField(field.id, { options: opts });
                            }}
                            placeholder="Option 1, Option 2, Option 3"
                            className="mt-1"
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            {field.options?.length || 0} option(s) configured
                          </p>
                        </div>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeField(field.id)}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Form Preview */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Form Preview
            </h2>
            <div className="space-y-4 rounded-lg border bg-gray-50 p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {formData.title}
                </h3>
                {formData.description && (
                  <p className="mt-2 text-sm text-gray-600">
                    {formData.description}
                  </p>
                )}
                {formData.formImage && (
                  <div className="mt-4">
                    <img
                      src={formData.formImage}
                      alt="Form image"
                      className="h-auto max-w-full rounded-lg border-2 border-gray-300"
                      style={{ maxHeight: "300px" }}
                    />
                  </div>
                )}
              </div>

              {formData.formSchema.length === 0 && (
                <div className="py-8 text-center text-gray-400">
                  <p className="text-sm">Your form fields will appear here</p>
                </div>
              )}

              {formData.formSchema.map((field) => (
                <div key={field.id}>
                  <Label className="font-medium">
                    {field.label}
                    {field.required && (
                      <span className="ml-1 text-red-500">*</span>
                    )}
                  </Label>
                  {field.helpText && (
                    <p className="mt-1 text-xs text-gray-500">
                      {field.helpText}
                    </p>
                  )}
                  {field.type === "textarea" ? (
                    <Textarea
                      placeholder={field.placeholder}
                      disabled
                      className="mt-2 bg-white"
                      rows={3}
                    />
                  ) : field.type === "select" ? (
                    <Select disabled>
                      <SelectTrigger className="mt-2 bg-white">
                        <SelectValue
                          placeholder={field.placeholder || "Select an option"}
                        />
                      </SelectTrigger>
                    </Select>
                  ) : field.type === "checkbox" ? (
                    <div className="mt-2 flex items-center gap-2">
                      <input type="checkbox" disabled className="rounded" />
                      <span className="text-sm">
                        {field.placeholder || field.label}
                      </span>
                    </div>
                  ) : field.type === "radio" ? (
                    <div className="mt-2 space-y-2">
                      {field.options?.map((option, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="radio"
                            disabled
                            name={field.name}
                            className="rounded-full"
                          />
                          <span className="text-sm">{option.label}</span>
                        </div>
                      ))}
                    </div>
                  ) : field.type === "file" ? (
                    <div className="mt-2">
                      <Input
                        type="file"
                        disabled
                        className="cursor-not-allowed bg-white"
                      />
                    </div>
                  ) : (
                    <Input
                      type={field.type}
                      placeholder={field.placeholder}
                      disabled
                      className="mt-2 bg-white"
                    />
                  )}
                </div>
              ))}

              {formData.formSchema.length > 0 && (
                <div className="pt-4">
                  <Button disabled className="w-full">
                    Submit Registration
                  </Button>
                  <p className="mt-2 text-center text-xs text-gray-500">
                    {formData.successMessage}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
