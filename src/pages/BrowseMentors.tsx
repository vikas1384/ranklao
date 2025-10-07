import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, Award, BookOpen, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";

interface MentorProfile {
  id: string;
  user_id: string;
  air_rank: number;
  exam_type: string;
  exam_year: number;
  current_institution: string;
  specialization: string | null;
  bio: string | null;
  hourly_rate: number | null;
  average_rating: number;
  total_sessions: number;
  profiles: {
    full_name: string;
    avatar_url: string | null;
  } | null;
}

export default function BrowseMentors() {
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const { data, error } = await supabase
        .from("mentor_profiles")
        .select("*, profiles!mentor_profiles_user_id_fkey(full_name, avatar_url)")
        .eq("verification_status", "verified")
        .order("average_rating", { ascending: false });

      if (error) throw error;
      setMentors((data || []) as any);
    } catch (error) {
      console.error("Error fetching mentors:", error);
      toast({
        title: "Error",
        description: "Failed to load mentors. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookSession = (mentorId: string) => {
    navigate(`/book-session/${mentorId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="text-center">Loading mentors...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <BackButton className="mb-6" aria-label="Go back from Browse Mentors" />
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Browse <span className="text-primary">Top Mentors</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Connect with verified top rankers and get personalized guidance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((mentor) => (
            <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Award className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">
                        {mentor.profiles?.full_name || "Mentor"}
                      </CardTitle>
                      <CardDescription>AIR {mentor.air_rank}</CardDescription>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">
                    {mentor.exam_type} {mentor.exam_year}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{mentor.average_rating}</span>
                    <span className="text-muted-foreground">
                      ({mentor.total_sessions} sessions)
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span className="font-medium">{mentor.current_institution}</span>
                  </div>
                  {mentor.specialization && (
                    <div className="text-sm text-muted-foreground">
                      Specialization: {mentor.specialization}
                    </div>
                  )}
                  {mentor.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {mentor.bio}
                    </p>
                  )}
                  <div className="pt-4 flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        ₹{mentor.hourly_rate || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">per session</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="secondary" onClick={() => navigate(`/messages/${mentor.user_id}`)}>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                      <Button onClick={() => handleBookSession(mentor.user_id)}>
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Session
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {mentors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No verified mentors available at the moment. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
