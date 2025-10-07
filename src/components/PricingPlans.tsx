import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    name: "1:1 Session",
    subtitle: "1:1 Session with Top Mentor",
    price: "139",
    originalPrice: "399",
    discount: "65% OFF",
    features: [
      { icon: "🎓", text: "Best Mentor in Your Domain" },
      { icon: "👤", text: "1:1 Mentorship" },
      { icon: "🕒", text: "20 - 30 min Call" },
      { icon: "💬", text: "Personalized Session" },
      { icon: "🧑‍🏫", text: "Personalized Guidance" },
      { icon: "🎯", text: "Target Planner" },
      { icon: "📝", text: "Proper Strategy" },
      { icon: "📊", text: "Performance Analysis" },
      { icon: "🔍", text: "Weakness Identification" },
    ],
    popular: false,
  },
  {
    name: "Premium",
    subtitle: "Mentorship Program",
    price: "3499",
    originalPrice: "6999",
    discount: "50% OFF",
    features: [
      { icon: "🎓", text: "Top Mentor Across Your Domain" },
      { icon: "🤝", text: "Peer Mentoring" },
      { icon: "👤", text: "Weekly 2 Sessions" },
      { icon: "💡", text: "Motivational Sessions" },
      { icon: "🧑‍🏫", text: "Expert Guidance" },
      { icon: "🗓️", text: "Proper Schedule" },
      { icon: "📝", text: "Short Notes" },
      { icon: "📚", text: "Selected PYQ's Set" },
      { icon: "💬", text: "Discussion with Groups" },
      { icon: "📊", text: "Weekly Progress Reports" },
      { icon: "🎯", text: "Mock Test Analysis" },
      { icon: "📱", text: "Mobile App Access" },
      { icon: "⏳", text: "Validity - till JEE Adv'26" },
    ],
    popular: true,
  },
  {
    name: "Premium Plus",
    subtitle: "Complete Mentorship Package",
    price: "10499",
    originalPrice: "29999",
    discount: "65% OFF",
    features: [
      { icon: "🎓", text: "Premium Top-Ranked Mentor" },
      { icon: "👤", text: "1:1 Mentorship" },
      { icon: "🕒", text: "24x7 Personalized Support" },
      { icon: "📆", text: "Weekly 2 Sessions" },
      { icon: "💬", text: "Personalized Sessions" },
      { icon: "🧑‍🏫", text: "Personalized Guidance" },
      { icon: "🎯", text: "Target Planner" },
      { icon: "📝", text: "Topper's Notes" },
      { icon: "📚", text: "Selected PYQ's Set" },
      { icon: "📊", text: "Daily Progress Tracking" },
      { icon: "🎥", text: "Video Lectures Access" },
      { icon: "🏆", text: "Priority Doubt Solving" },
      { icon: "📱", text: "Premium Mobile Features" },
      { icon: "⏳", text: "Validity - till JEE Adv'26" },
    ],
    popular: false,
  },
];

const PricingPlans = () => {
  const { toast } = useToast();

  const handleJoinNow = (planName: string) => {
    toast({
      title: "Plan Selected!",
      description: `You've selected the ${planName} plan. Redirecting to checkout...`,
    });
  };

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <div className="inline-block bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-2 rounded-full mb-4">
            <span className="text-sm font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              💎 LIMITED TIME OFFER
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Mentorship Plan
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Get personalized guidance from IIT rankers and ace your exams with up to 65% OFF
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden hover:shadow-premium transition-all duration-500 hover:-translate-y-3 group ${
                plan.popular
                  ? "border-primary shadow-premium scale-105 bg-gradient-to-br from-card via-card to-primary/5"
                  : "border-border/50 bg-card/50 backdrop-blur"
              } animate-fade-in-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Glow effect for popular plan */}
              {plan.popular && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              )}
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs font-bold px-4 py-1 rounded-bl-lg shadow-glow">
                  MOST POPULAR
                </div>
              )}
              <div className="absolute top-4 left-4 bg-gradient-to-r from-secondary to-secondary-glow text-white text-xs font-bold px-3 py-1 rounded-full shadow-elegant">
                {plan.discount}
              </div>

              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl font-bold mb-2">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-sm">
                  {plan.subtitle}
                </CardDescription>
                <div className="mt-6">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl font-bold text-foreground">
                      ₹{plan.price}
                    </span>
                  </div>
                  <div className="text-muted-foreground line-through text-sm mt-1">
                    ₹{plan.originalPrice}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div
                    key={featureIndex}
                    className="flex items-start gap-3 text-sm"
                  >
                    <span className="text-lg flex-shrink-0">{feature.icon}</span>
                    <span className="text-muted-foreground">{feature.text}</span>
                  </div>
                ))}
              </CardContent>

              <CardFooter className="relative z-10">
                <Button
                  variant={plan.popular ? "hero" : "default"}
                  size="lg"
                  className="w-full shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => handleJoinNow(plan.name)}
                >
                  {plan.popular ? "🚀 Get Started Now" : "Join Now"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
