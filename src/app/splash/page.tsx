import type { Metadata } from "next";
import SplashScreen from "@/components/splash/SplashScreen";

export const metadata: Metadata = {
  title: "Welcome",
};

export default function SplashPage() {
  return <SplashScreen />;
}
