'use client';

import { useUser } from "@/firebase";

export default function WelcomeHeader() {
  const { user } = useUser();

  const getFirstName = () => {
    if (user?.displayName) {
      return user.displayName.split(' ')[0];
    }
    return "there";
  }

  return (
    <div>
      <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        Welcome back, {getFirstName()}!
      </h1>
      <p className="mt-2 text-muted-foreground">
        Here's your progress. Keep up the great work and make today count!
      </p>
    </div>
  );
}
