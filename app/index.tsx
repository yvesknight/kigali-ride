/**
 * Entry point — redirects to splash on first load.
 */
import { Redirect } from "expo-router";

export default function Entry() {
  return <Redirect href="/(onboarding)/splash" />;
}
