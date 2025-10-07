import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, TrendingUp, DollarSign, Loader2, Calendar, Video, LogOut } from "lucide-react";
import BackButton from "@/components/BackButton";

interface Session {
  id: string;
  session_type: string;
  duration_minutes: number;
  scheduled_at: string;
  status: string;
  meeting_link: string | null;
  mentor_id?: string;
  student_id?: string;
  mentor_profiles?: {
    profiles: {
      full_name: string;
    };
  };
  profiles?: {
    full_name: string;
  };
}

export default function Dashboard() {
  const { role } = useParams();
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    } else if (user) {
      fetchSessions();
    }
  }, [user, loading, navigate]);

  const fetchSessions = async () => {
    if (!user) return;

    try {
      const isStudent = role === "student";
      const query = supabase
        .from("sessions")
        .select(
          isStudent
            ? `
          *,
          mentor_profiles!sessions_mentor_id_fkey (
            profiles!mentor_profiles_user_id_fkey (
              full_name
            )
          )
        `
            : `
          *,
          profiles!sessions_student_id_fkey (
            full_name
          )
        `
        )
        .order("scheduled_at", { ascending: true });

      if (isStudent) {
        query.eq("student_id", user.id);
      } else {
        query.eq("mentor_id", user.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSessions((data || []) as any);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoadingSessions(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <header className="relative z-10 border-b border-border bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/images/logo.png"
              alt="Ranklao logo"
              className="w-10 h-10 rounded-lg object-contain"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Ranklao
            </span>
          </div>

          <Button variant="outline" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <BackButton className="mb-6" aria-label="Go back from Dashboard" />
          <Card className="shadow-premium border-border/50 mb-8">
            <CardHeader>
              <CardTitle className="text-3xl">
                Welcome to Your {role === "student" ? "Student" : "Mentor"} Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                {role === "student"
                  ? "Start connecting with top rankers and transform your exam preparation."
                  : "Your profile has been submitted for verification. We'll notify you once it's approved."}
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-card/50 backdrop-blur border-primary/20 hover:border-primary/40 transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      {role === "student" ? "Find Mentors" : "My Sessions"}
                    </CardTitle>
                    <CardDescription>
                      {role === "student"
                        ? "Connect with top rankers and get personalized guidance"
                        : "Manage your mentoring sessions and help students succeed"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      onClick={() =>
                        navigate(role === "student" ? "/browse-mentors" : "/sessions")
                      }
                    >
                      {role === "student" ? "Browse Mentors" : "View Sessions"}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur border-primary/20 hover:border-primary/40 transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {role === "student" ? (
                        <>
                          <BookOpen className="w-5 h-5 text-primary" />
                          My Progress
                        </>
                      ) : (
                        <>
                          <DollarSign className="w-5 h-5 text-primary" />
                          Earnings
                        </>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {role === "student"
                        ? "Track your learning journey and achievements"
                        : "View your earnings and session statistics"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        navigate(role === "student" ? "/progress" : "/earnings")
                      }
                    >
                      {role === "student" ? "View Progress" : "View Earnings"}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Sessions Section */}
              <Card className="bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    {role === "student" ? "My Upcoming Sessions" : "Upcoming Sessions"}
                  </CardTitle>
                  <CardDescription>
                    {loadingSessions
                      ? "Loading sessions..."
                      : sessions.length === 0
                      ? "No sessions scheduled yet"
                      : `You have ${sessions.length} upcoming session(s)`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingSessions ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  ) : sessions.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        {role === "student"
                          ? "Book your first session with a mentor to get started!"
                          : "No sessions scheduled yet. Students will book sessions with you."}
                      </p>
                      {role === "student" && (
                        <Button onClick={() => navigate("/browse-mentors")}>
                          Browse Mentors
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sessions.map((session) => (
                        <Card key={session.id}>
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary" className="capitalize">
                                    {session.session_type}
                                  </Badge>
                                  <Badge
                                    variant={
                                      session.status === "scheduled"
                                        ? "default"
                                        : session.status === "completed"
                                        ? "outline"
                                        : "destructive"
                                    }
                                  >
                                    {session.status}
                                  </Badge>
                                </div>
                                <p className="font-semibold">
                                  {role === "student"
                                    ? `Mentor: ${
                                        session.mentor_profiles?.profiles?.full_name ||
                                        "Unknown"
                                      }`
                                    : `Student: ${session.profiles?.full_name || "Unknown"}`}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(session.scheduled_at).toLocaleString("en-IN", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                  })}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Duration: {session.duration_minutes} minutes
                                </p>
                              </div>
                              {session.meeting_link && session.status === "scheduled" && (
                                <Button
                                  size="sm"
                                  onClick={() => window.open(session.meeting_link!, "_blank")}
                                >
                                  <Video className="w-4 h-4 mr-2" />
                                  Join
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
