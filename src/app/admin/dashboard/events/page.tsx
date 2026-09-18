"use client";

import Link from "next/link";
import { Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/context/eventContext";

export default function EventsPage() {
  const { events, loading } = useEvents();

  if (loading) {
    return (
      <div className="p-8">
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Events Management
          </h1>

          <p className="mt-2 text-gray-600">
            Create and manage your events
          </p>
        </div>

        <Link href="/admin/dashboard/events/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        </Link>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        {events.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Event
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Date
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Location
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {events.map((evt) => (
                  <tr key={evt.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {evt.bannerImage ? (
                          <img
                            src={evt.bannerImage}
                            alt={evt.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                            <Calendar className="h-5 w-5 text-blue-600" />
                          </div>
                        )}

                        <div>
                          <div className="font-medium text-gray-900">
                            {evt.name}
                          </div>

                          <div className="text-sm text-gray-500">
                            {evt.category || "General"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      {evt.startDate
                        ? new Date(evt.startDate).toLocaleDateString("en-GB")
                        : "TBA"}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      {evt.location || "Online"}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/events/${evt.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Event
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />

            <h3 className="mt-2 font-medium text-gray-900">
              No events yet
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Create your first event.
            </p>

            <div className="mt-6">
              <Link href="/admin/dashboard/events/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Event
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}