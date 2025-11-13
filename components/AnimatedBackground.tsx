import React from "react";

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-[40%] -left-[40%] w-[80%] h-[80%] rounded-full bg-college-primary/5 blur-3xl animate-pulse-subtle" />
      <div
        className="absolute -bottom-[30%] -right-[30%] w-[70%] h-[70%] rounded-full bg-college-secondary/5 blur-3xl animate-pulse-subtle"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-[20%] right-[10%] w-[50%] h-[50%] rounded-full bg-college-accent/5 blur-3xl animate-pulse-subtle"
        style={{ animationDelay: "2s" }}
      />
    </div>
  );
};

export default AnimatedBackground;
