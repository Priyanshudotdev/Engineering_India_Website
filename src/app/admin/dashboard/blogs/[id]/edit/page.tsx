"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    author: "",
    category: "",
    tags: "",
    isPublished: false,
  });

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/admin/blogs/${resolvedParams.id}`);
      if (!response.ok) throw new Error("Failed to fetch blog");

      const blogData = await response.json();

      // Parse tags if they exist
      const tags = blogData.tags ? JSON.parse(blogData.tags).join(", ") : "";

      setFormData({
        title: blogData.title || "",
        slug: blogData.slug || "",
        excerpt: blogData.excerpt || "",
        content: blogData.content || "",
        coverImage: blogData.coverImage || "",
        author: blogData.author || "",
        category: blogData.category || "",
        tags,
        isPublished: blogData.isPublished || false,
      });
    } catch (error) {
      console.error("Error fetching blog:", error);
      toast.error("Failed to load blog post");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [resolvedParams.id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/blogs/${resolvedParams.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags
            ? formData.tags.split(",").map((t) => t.trim())
            : [],
        }),
      });

      if (!response.ok) throw new Error("Failed to update blog");

      toast.success("Blog post updated successfully!");
      router.push("/admin/dashboard/blogs");
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("Failed to update blog post");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this blog post? This action cannot be undone.",
      )
    ) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(`/api/admin/blogs/${resolvedParams.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete blog");

      toast.success("Blog post deleted successfully!");
      router.push("/admin/dashboard/blogs");
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete blog post");
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard/blogs">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
            <p className="mt-2 text-gray-600">Update blog post details</p>
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
              Delete Post
            </>
          )}
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Slug */}
            <div>
              <label
                htmlFor="slug"
                className="block text-sm font-medium text-gray-700"
              >
                Slug (URL)
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label
                htmlFor="excerpt"
                className="block text-sm font-medium text-gray-700"
              >
                Excerpt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={3}
                value={formData.excerpt}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Content */}
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700"
              >
                Content *
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows={15}
                value={formData.content}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Cover Image */}
            <div>
              <label
                htmlFor="coverImage"
                className="block text-sm font-medium text-gray-700"
              >
                Cover Image URL
              </label>
              <input
                type="url"
                id="coverImage"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {formData.coverImage && (
                <div className="mt-2">
                  <img
                    src={formData.coverImage}
                    alt="Cover preview"
                    className="h-48 w-full rounded-lg object-cover"
                  />
                </div>
              )}
            </div>

            {/* Author, Category, Tags */}
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <label
                  htmlFor="author"
                  className="block text-sm font-medium text-gray-700"
                >
                  Author
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
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
                  <option value="">Select category</option>
                  <option value="technology">Technology</option>
                  <option value="events">Events</option>
                  <option value="tutorials">Tutorials</option>
                  <option value="announcements">Announcements</option>
                  <option value="news">News</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Publish */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublished"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="isPublished"
                className="ml-2 text-sm font-medium text-gray-700"
              >
                Published
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href="/admin/dashboard/blogs">
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
      </form>
    </div>
  );
}
