"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface EventFormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  category: string;
  bannerImage: string;
  timeline: string;
  prizes: string;
  registrationFee: string;
  faqs: string;
  organizerContact: string;
  coOrganizerContact: string;
  discordLink: string;
  whatsappLink: string;
  gallery: string;
  details: string;
  rules: string;
}

export default function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState<EventFormData>({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    category: "WORKSHOP",
    bannerImage: "",
    timeline: "",
    prizes: "",
    registrationFee: "",
    faqs: "",
    organizerContact: "",
    coOrganizerContact: "",
    discordLink: "",
    whatsappLink: "",
    gallery: "",
    details: "",
    rules: "",
  });

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/admin/events/${id}`);
      if (!response.ok) throw new Error("Failed to fetch event");

      const event = await response.json();

      // Format dates for datetime-local input
      const startDate = event.startDate
        ? new Date(event.startDate).toISOString().slice(0, 16)
        : "";
      const endDate = event.endDate
        ? new Date(event.endDate).toISOString().slice(0, 16)
        : "";

      setFormData({
        name: event.name || "",
        description: event.description || "",
        startDate,
        endDate,
        location: event.location || "",
        category: event.category || "WORKSHOP",
        bannerImage: event.bannerImage || "",
        timeline: event.timeline || "",
        prizes: event.prizes || "",
        registrationFee: event.registrationFee || "",
        faqs: event.faqs || "",
        organizerContact: event.organizerContact || "",
        coOrganizerContact: event.coOrganizerContact || "",
        discordLink: event.discordLink || "",
        whatsappLink: event.whatsappLink || "",
        gallery: event.gallery || "",
        details: event.details || "",
        rules: event.rules || "",
      });
    } catch (error) {
      console.error("Error fetching event:", error);
      toast.error("Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Validate prizes JSON format
      if (formData.prizes) {
        try {
          // Clean up the JSON string before parsing
          const cleanedPrizes = formData.prizes
            .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control characters
            .replace(/\\n/g, "\\\\n") // Fix escaped newlines
            .trim();

          const parsedPrizes = JSON.parse(cleanedPrizes);
          if (Array.isArray(parsedPrizes)) {
            parsedPrizes.forEach((prize: any, index: number) => {
              if (typeof prize !== "object" || prize === null) {
                throw new Error(`Prize ${index + 1} must be an object`);
              }
              if (!prize.position) {
                throw new Error(`Prize ${index + 1} missing 'position' field`);
              }
              if (!prize.description) {
                throw new Error(
                  `Prize ${index + 1} missing 'description' field`,
                );
              }
              if (prize.amount && typeof prize.amount !== "string") {
                throw new Error(`Prize ${index + 1} 'amount' must be a string`);
              }
            });
          }
        } catch (parseError) {
          throw new Error(
            `Invalid prizes format: ${parseError instanceof Error ? parseError.message : "Unknown error"}`,
          );
        }
      }

      // Validate gallery JSON format
      if (formData.gallery) {
        try {
          JSON.parse(formData.gallery);
        } catch (galleryError) {
          throw new Error(
            `Invalid gallery format: ${galleryError instanceof Error ? galleryError.message : "Unknown error"}`,
          );
        }
      }

      // Helper function to convert gallery data to correct format
      const normalizeGalleryData = (gallery: string): string => {
        if (!gallery) return "[]";
        try {
          const parsed = JSON.parse(gallery);
          // If it's a simple array of strings, convert to objects
          if (
            Array.isArray(parsed) &&
            parsed.length > 0 &&
            typeof parsed[0] === "string"
          ) {
            return JSON.stringify(
              parsed.map((src, index) => ({
                src,
                alt: `Gallery image ${index + 1}`,
              })),
            );
          }
          // If it's already in correct format, return as is
          return gallery;
        } catch (_e) {
          return "[]";
        }
      };

      const response = await fetch(`/api/admin/events/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          gallery: normalizeGalleryData(formData.gallery),
          startDate: formData.startDate ? new Date(formData.startDate) : null,
          endDate: formData.endDate ? new Date(formData.endDate) : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update event");
      }

      toast.success("Event updated successfully!");
      router.push(`/admin/dashboard/events/${id}`);
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update event",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this event? This action cannot be undone.",
      )
    ) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(`/api/admin/events/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete event");

      toast.success("Event deleted successfully!");
      router.push("/admin/dashboard/events");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    } finally {
      setDeleting(false);
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
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/admin/dashboard/events/${id}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
            <p className="mt-2 text-gray-600">Update event details</p>
          </div>
        </div>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-2"
        >
          {deleting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              Delete Event
            </>
          )}
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Basic Info */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Basic Information
              </h3>

              {/* Event Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Event Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Dates */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start Date *
                  </label>
                  <input
                    type="datetime-local"
                    id="startDate"
                    name="startDate"
                    required
                    value={formData.startDate}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End Date
                  </label>
                  <input
                    type="datetime-local"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Location and Category */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="WORKSHOP">Workshop</option>
                    <option value="SEMINAR">Seminar</option>
                    <option value="CONFERENCE">Conference</option>
                    <option value="MEETUP">Meetup</option>
                    <option value="HACKATHON">Hackathon</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Banner Image */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Images & Media
              </h3>
              <ImageUpload
                value={formData.bannerImage}
                onChange={(url) =>
                  setFormData((prev) => ({ ...prev, bannerImage: url }))
                }
                label="Banner Image"
                placeholder="Enter banner image URL or upload new image"
              />
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Registration Fee */}
            <div>
              <label
                htmlFor="registrationFee"
                className="block text-sm font-medium text-gray-700"
              >
                Registration Fee
              </label>
              <input
                type="text"
                id="registrationFee"
                name="registrationFee"
                value={formData.registrationFee}
                onChange={handleChange}
                placeholder="0 (free), 100, 250, etc."
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="mt-2 text-xs text-gray-500">
                Enter amount (leave empty for free events)
              </p>
            </div>

            {/* Timeline */}
            <div>
              <label
                htmlFor="timeline"
                className="block text-sm font-medium text-gray-700"
              >
                Timeline
              </label>
              <textarea
                id="timeline"
                name="timeline"
                rows={2}
                value={formData.timeline}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Prizes */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label
                htmlFor="prizes"
                className="block text-sm font-medium text-gray-700"
              >
                Prizes (JSON array)
              </label>
              <textarea
                id="prizes"
                name="prizes"
                rows={4}
                value={formData.prizes}
                onChange={handleChange}
                placeholder='[
  {"position": "1st Prize", "amount": "₹5000", "description": "महात्मा ज्योतिबा फुले (Mahatma Jyotiba Phule)"},
  {"position": "2nd Prize", "amount": "₹3000", "description": "डॉ. एम. एस. स्वामीनाथन (Dr. M. S. Swaminathan)"},
  {"position": "3rd Prize", "amount": "₹1000", "description": "कैप्टन विक्रम बत्रा (Captain Vikram Batra)"}
]'
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="mt-2 text-xs text-gray-500">
                Format: JSON array with position, amount, and description
                properties
              </p>

              {/* Prizes Preview */}
              {formData.prizes && (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium text-gray-700">
                    Prizes Preview:
                  </p>
                  <div className="space-y-2">
                    {(() => {
                      try {
                        const parsed = JSON.parse(formData.prizes);
                        const prizes = Array.isArray(parsed)
                          ? parsed.slice(0, 3)
                          : [];
                        return prizes.map((prize: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">
                                {prize?.position || `Prize ${index + 1}`}
                              </p>
                              {prize?.description && (
                                <p className="text-sm text-gray-600">
                                  {prize.description}
                                </p>
                              )}
                            </div>
                            {prize?.amount && (
                              <div className="ml-4 text-right">
                                <p className="font-bold text-green-600">
                                  {prize.amount}
                                </p>
                              </div>
                            )}
                          </div>
                        ));
                      } catch (_e) {
                        return (
                          <p className="text-sm text-red-500">
                            Invalid JSON format
                          </p>
                        );
                      }
                    })()}
                  </div>
                  {(() => {
                    try {
                      const parsed = JSON.parse(formData.prizes);
                      const prizes = Array.isArray(parsed) ? parsed : [];
                      if (prizes.length > 3) {
                        return (
                          <p className="mt-2 text-xs text-gray-500">
                            Showing first 3 of {prizes.length} prizes
                          </p>
                        );
                      }
                    } catch (_e) {
                      return null;
                    }
                  })()}
                </div>
              )}
            </div>
          </div>

          {/* FAQs */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="faqs"
                className="block text-sm font-medium text-gray-700"
              >
                FAQs (JSON array)
              </label>
              <textarea
                id="faqs"
                name="faqs"
                rows={4}
                value={formData.faqs}
                onChange={handleChange}
                placeholder='[{"question": "What is the event?", "answer": "Event description"}]'
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Gallery */}
            <div>
              <label
                htmlFor="gallery"
                className="block text-sm font-medium text-gray-700"
              >
                Gallery Images (JSON array)
              </label>
              <textarea
                id="gallery"
                name="gallery"
                rows={3}
                value={formData.gallery}
                onChange={handleChange}
                placeholder='[{"src": "image1.jpg", "alt": "Description 1"}, {"src": "image2.jpg", "alt": "Description 2"}]'
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="mt-2 text-xs text-gray-500">
                Format: JSON array with objects containing "src" and optional
                "alt" properties
              </p>

              {/* Gallery Preview */}
              {formData.gallery && (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium text-gray-700">
                    Gallery Preview:
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {(() => {
                      try {
                        const parsed = JSON.parse(formData.gallery);
                        const images = Array.isArray(parsed)
                          ? parsed.slice(0, 6)
                          : [];
                        return images.map((img: any, index: number) => (
                          <div
                            key={index}
                            className="relative aspect-video overflow-hidden rounded-lg border border-gray-200"
                          >
                            <img
                              src={
                                typeof img === "string" ? img : img?.src || ""
                              }
                              alt={
                                typeof img === "string"
                                  ? `Gallery image ${index + 1}`
                                  : img?.alt || `Gallery image ${index + 1}`
                              }
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ));
                      } catch (_e) {
                        return (
                          <p className="col-span-3 text-sm text-red-500">
                            Invalid JSON format
                          </p>
                        );
                      }
                    })()}
                  </div>
                  {(() => {
                    try {
                      const parsed = JSON.parse(formData.gallery);
                      const images = Array.isArray(parsed) ? parsed : [];
                      if (images.length > 6) {
                        return (
                          <p className="mt-2 text-xs text-gray-500">
                            Showing first 6 of {images.length} images
                          </p>
                        );
                      }
                    } catch (_e) {
                      return null;
                    }
                  })()}
                </div>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid gap-6 md:grid-cols-2">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 md:col-span-2">
              Contact Information
            </h3>

            <div>
              <label
                htmlFor="organizerContact"
                className="block text-sm font-medium text-gray-700"
              >
                Organizer Contact
              </label>
              <input
                type="text"
                id="organizerContact"
                name="organizerContact"
                value={formData.organizerContact}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="coOrganizerContact"
                className="block text-sm font-medium text-gray-700"
              >
                Co-organizer Contact
              </label>
              <input
                type="text"
                id="coOrganizerContact"
                name="coOrganizerContact"
                value={formData.coOrganizerContact}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="grid gap-6 md:grid-cols-2">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 md:col-span-2">
              Social Links
            </h3>

            <div>
              <label
                htmlFor="discordLink"
                className="block text-sm font-medium text-gray-700"
              >
                Discord Link
              </label>
              <input
                type="url"
                id="discordLink"
                name="discordLink"
                value={formData.discordLink}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="whatsappLink"
                className="block text-sm font-medium text-gray-700"
              >
                WhatsApp Link
              </label>
              <input
                type="url"
                id="whatsappLink"
                name="whatsappLink"
                value={formData.whatsappLink}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Event Details */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="details"
                className="block text-sm font-medium text-gray-700"
              >
                Event Details
              </label>
              <textarea
                id="details"
                name="details"
                rows={4}
                value={formData.details}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="rules"
                className="block text-sm font-medium text-gray-700"
              >
                Event Rules
              </label>
              <textarea
                id="rules"
                name="rules"
                rows={4}
                value={formData.rules}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6">
            <Link href={`/admin/dashboard/events/${id}`}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
