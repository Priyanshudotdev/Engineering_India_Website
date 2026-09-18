"use client";

import { useState } from "react";

import { useEvents } from "@/context/eventContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CreateEventPage() {
  const router = useRouter();
  const eventContext = useEvents() as ReturnType<typeof useEvents> & {
    addEvent?: (event: {
      id: string;
      name: string;
      description?: string | null;
      startDate?: number | null;
      endDate?: number | null;
      location?: string | null;
      category?: string | null;
      googleFormLink?: string | null;
      bannerImage?: string | null;
      createdAt: number;
      updatedAt: number;
    }) => void;
  };
  const { addEvent } = eventContext;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    category: "",
    googleFormLink: "",
    bannerImage: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!addEvent) {
      toast.error("Event creation is unavailable right now.");
      return;
    }

    setLoading(true);

    try {
      const id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `event-${Date.now()}`;
      const now = Date.now();

      addEvent({
        id,
        name: formData.name,
        description: formData.description || null,
        startDate: formData.startDate
          ? new Date(formData.startDate).getTime()
          : null,
        endDate: formData.endDate
          ? new Date(formData.endDate).getTime()
          : null,
        location: formData.location || null,
        category: formData.category || null,
        googleFormLink: formData.googleFormLink || null,
        bannerImage: formData.bannerImage || null,
        createdAt: now,
        updatedAt: now,
      });

      toast.success("Event created successfully!");

      router.push(`/events/${id}`);
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/dashboard/events">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
          <p className="mt-2 text-gray-600">
            Fill in the details to create a new event
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Event Information
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Event Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Event Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter event name"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter event description"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date *
              </label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter location or 'Online'"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select category</option>
                <option value="workshop">Workshop</option>
                <option value="seminar">Seminar</option>
                <option value="conference">Conference</option>
                <option value="webinar">Webinar</option>
                <option value="competition">Competition</option>
                <option value="hackathon">Hackathon</option>
                <option value="meetup">Meetup</option>
                <option value="other">Other</option>
              </select>
            </div>
            {/* Google Form Link */}
<div className="md:col-span-2">
  <label className="block text-sm font-medium text-gray-700">
    Google Form Link
  </label>
  <input
    type="url"
    name="googleFormLink"
    value={formData.googleFormLink}
    onChange={handleChange}
    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
    placeholder="https://forms.google.com/..."
  />
</div>
            {/* Banner Image URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Banner Image URL
              </label>
              <input
                type="url"
                name="bannerImage"
                value={formData.bannerImage}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
              {formData.bannerImage && (
                <div className="mt-2">
                  <img
                    src={formData.bannerImage}
                    alt="Preview"
                    className="h-32 w-full rounded-lg object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href="/admin/dashboard/events">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Event"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
