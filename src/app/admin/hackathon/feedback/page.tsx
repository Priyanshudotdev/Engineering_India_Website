"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Loader2,
  AlertCircle,
  Star,
  TrendingUp,
  Users,
  ThumbsUp,
} from "lucide-react";

interface FeedbackData {
  id: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  branch: string;
  year: string;
  overallRating: number;
  experienceRating: number;
  organizationRating: number;
  venueRating: number | null;
  foodRating: number | null;
  mentorshipRating: number | null;
  whatYouLiked: string | null;
  improvements: string | null;
  suggestions: string | null;
  wouldRecommend: boolean;
  createdAt: string;
}

interface FeedbackResponse {
  success?: boolean;
  count?: number;
  feedback?: FeedbackData[];
  error?: string;
  details?: string;
}

function StarDisplay({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-gray-400">N/A</span>;

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
      <span className="ml-1 text-sm font-medium">{rating}</span>
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon: Icon,
  subtitle,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  subtitle?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<FeedbackData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedback = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/hackathon/feedback");
      const data: FeedbackResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch feedback");
      }

      setFeedback(data.feedback || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const response = await fetch("/api/admin/hackathon/export-feedback");

      if (!response.ok) {
        throw new Error("Failed to export feedback");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `hackathon-feedback-${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  // Calculate statistics
  const stats = feedback.length
    ? {
        totalResponses: feedback.length,
        averageOverall:
          feedback.reduce((sum, f) => sum + f.overallRating, 0) /
          feedback.length,
        averageExperience:
          feedback.reduce((sum, f) => sum + f.experienceRating, 0) /
          feedback.length,
        averageOrganization:
          feedback.reduce((sum, f) => sum + f.organizationRating, 0) /
          feedback.length,
        recommendCount: feedback.filter((f) => f.wouldRecommend).length,
        recommendPercentage:
          (feedback.filter((f) => f.wouldRecommend).length / feedback.length) *
          100,
      }
    : null;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-gray-900" />
          <p className="mt-4 text-gray-600">Loading feedback data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md border-red-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900">
                  Error Loading Data
                </h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <Button
                  onClick={fetchFeedback}
                  variant="outline"
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Hackathon Feedback
            </h1>
            <p className="mt-2 text-gray-600">
              View and analyze participant feedback
            </p>
          </div>
          <Button
            onClick={handleExport}
            disabled={isExporting || feedback.length === 0}
            className="bg-black text-white hover:bg-gray-900"
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export to Excel
              </>
            )}
          </Button>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Responses"
              value={stats.totalResponses}
              icon={Users}
              subtitle="Feedback submissions"
            />
            <StatsCard
              title="Average Rating"
              value={stats.averageOverall.toFixed(1)}
              icon={Star}
              subtitle="Overall experience"
            />
            <StatsCard
              title="Would Recommend"
              value={`${stats.recommendPercentage.toFixed(0)}%`}
              icon={ThumbsUp}
              subtitle={`${stats.recommendCount} out of ${stats.totalResponses}`}
            />
            <StatsCard
              title="Organization"
              value={stats.averageOrganization.toFixed(1)}
              icon={TrendingUp}
              subtitle="Average rating"
            />
          </div>
        )}

        {/* Feedback Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Feedback Submissions</CardTitle>
            <CardDescription>
              {feedback.length === 0
                ? "No feedback submissions yet"
                : `${feedback.length} total submissions`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {feedback.length === 0 ? (
              <div className="py-12 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-600">
                  No feedback submissions yet. Share the feedback form with
                  participants!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">S.No</TableHead>
                      <TableHead className="min-w-[150px]">Name</TableHead>
                      <TableHead className="min-w-[200px]">Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead className="min-w-[200px]">College</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead className="text-center">Overall</TableHead>
                      <TableHead className="text-center">Experience</TableHead>
                      <TableHead className="text-center">
                        Organization
                      </TableHead>
                      <TableHead className="text-center">Venue</TableHead>
                      <TableHead className="text-center">Food</TableHead>
                      <TableHead className="text-center">Mentorship</TableHead>
                      <TableHead className="min-w-[250px]">
                        What You Liked
                      </TableHead>
                      <TableHead className="min-w-[250px]">
                        Improvements
                      </TableHead>
                      <TableHead className="min-w-[250px]">
                        Suggestions
                      </TableHead>
                      <TableHead className="text-center">Recommend</TableHead>
                      <TableHead className="min-w-[150px]">
                        Submitted At
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feedback.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell className="text-sm">{item.email}</TableCell>
                        <TableCell>{item.phone}</TableCell>
                        <TableCell className="text-sm">
                          {item.college}
                        </TableCell>
                        <TableCell className="text-sm">{item.branch}</TableCell>
                        <TableCell>{item.year}</TableCell>
                        <TableCell>
                          <StarDisplay rating={item.overallRating} />
                        </TableCell>
                        <TableCell>
                          <StarDisplay rating={item.experienceRating} />
                        </TableCell>
                        <TableCell>
                          <StarDisplay rating={item.organizationRating} />
                        </TableCell>
                        <TableCell>
                          <StarDisplay rating={item.venueRating} />
                        </TableCell>
                        <TableCell>
                          <StarDisplay rating={item.foodRating} />
                        </TableCell>
                        <TableCell>
                          <StarDisplay rating={item.mentorshipRating} />
                        </TableCell>
                        <TableCell className="max-w-[300px] text-sm">
                          {item.whatYouLiked || (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[300px] text-sm">
                          {item.improvements || (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[300px] text-sm">
                          {item.suggestions || (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              item.wouldRecommend ? "default" : "secondary"
                            }
                            className={
                              item.wouldRecommend
                                ? "bg-green-600 hover:bg-green-700"
                                : ""
                            }
                          >
                            {item.wouldRecommend ? "Yes" : "No"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(item.createdAt).toLocaleString("en-IN", {
                            timeZone: "Asia/Kolkata",
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
