import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  mentor_id: string;
  student_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export default function Messages() {
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [allowed, setAllowed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    checkAccessAndLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, mentorId]);

  const checkAccessAndLoad = async () => {
    try {
      // Fetch sessions between this student and mentor
      const { data: sessions, error: sessionsError } = await supabase
        .from("sessions")
        .select("id")
        .eq("student_id", user!.id)
        .eq("mentor_id", mentorId);

      if (sessionsError) throw sessionsError;
      const sessionIds = (sessions || []).map((s: any) => s.id);

      if (sessionIds.length === 0) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      // Fetch payments for the user and see if any reference these sessions
      const { data: payments, error: paymentsError } = await supabase
        .from("payments")
        .select("session_id, payment_status")
        .eq("user_id", user!.id)
        .eq("payment_status", "completed");

      if (paymentsError) throw paymentsError;
      const paidSessionIds = new Set((payments || []).map((p: any) => p.session_id).filter(Boolean));

      const hasAccess = sessionIds.some((id: string) => paidSessionIds.has(id));
      setAllowed(hasAccess);

      if (hasAccess) {
        await loadMessages();
      }
    } catch (err) {
      console.error("Access check error:", err);
      toast({ title: "Error", description: "Failed to verify access.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("mentor_id", mentorId)
        .eq("student_id", user!.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      setMessages((data || []) as any);
    } catch (err) {
      console.error("Load messages error:", err);
      toast({ title: "Error", description: "Could not load messages.", variant: "destructive" });
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    setSending(true);
    try {
      const { error } = await supabase.from("messages").insert({
        mentor_id: mentorId,
        student_id: user.id,
        sender_id: user.id,
        content: newMessage.trim(),
      });
      if (error) throw error;
      setNewMessage("");
      await loadMessages();
    } catch (err) {
      console.error("Send message error:", err);
      toast({ title: "Error", description: "Failed to send message.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <BackButton className="mb-4" aria-label="Go back from Messages" />
          Loading...
        </div>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <BackButton className="mb-4" aria-label="Go back from Messages" />
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Messaging Locked</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                To message this mentor, please book and complete payment for a session.
              </p>
              <Button onClick={() => navigate(`/book-session/${mentorId}`)}>Book a Session</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <BackButton className="mb-4" aria-label="Go back from Messages" />
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Chat with Mentor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-96 overflow-y-auto rounded border p-4 bg-muted/20">
                {messages.length === 0 ? (
                  <div className="text-muted-foreground">No messages yet. Say hello!</div>
                ) : (
                  messages.map((m) => (
                    <div key={m.id} className={`flex ${m.sender_id === user!.id ? "justify-end" : "justify-start"} mb-2`}>
                      <div className={`px-3 py-2 rounded-lg text-sm ${m.sender_id === user!.id ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                        {m.content}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                />
                <Button onClick={sendMessage} disabled={sending}>
                  {sending ? "Sending..." : "Send"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}