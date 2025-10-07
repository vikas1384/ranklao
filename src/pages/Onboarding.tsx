import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import RoleSelection from "@/components/onboarding/RoleSelection";
import StudentOnboarding from "@/components/onboarding/StudentOnboarding";
import MentorOnboarding from "@/components/onboarding/MentorOnboarding";
import { Loader2 } from "lucide-react";

const Onboarding = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<"student" | "mentor" | null>(null);
  const [hasExistingProfile, setHasExistingProfile] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      checkOnboardingStatus();
    }
  }, [user, authLoading, navigate]);

  const checkOnboardingStatus = async () => {
    if (!user) return;

    try {
      // Check if user has already completed onboarding
      const { data: onboardingData } = await supabase
        .from("onboarding_progress")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (onboardingData?.is_completed) {
        // User has completed onboarding, redirect to appropriate dashboard
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .maybeSingle();

        if (roleData) {
          navigate(`/dashboard/${roleData.role}`);
          return;
        }
      }

      if (onboardingData?.role_selected) {
        setSelectedRole(onboardingData.role_selected as "student" | "mentor");
        setHasExistingProfile(true);
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = async (role: "student" | "mentor") => {
    if (!user) return;

    try {
      // Insert user role
      await supabase.from("user_roles").insert({
        user_id: user.id,
        role: role,
      });

      // Initialize onboarding progress
      await supabase.from("onboarding_progress").insert({
        user_id: user.id,
        current_step: 1,
        total_steps: role === "student" ? 4 : 5,
        role_selected: role,
      });

      setSelectedRole(role);
    } catch (error) {
      console.error("Error setting role:", error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!selectedRole) {
    return <RoleSelection onSelectRole={handleRoleSelect} />;
  }

  return (
    <>
      {selectedRole === "student" ? (
        <StudentOnboarding />
      ) : (
        <MentorOnboarding />
      )}
    </>
  );
};

export default Onboarding;
