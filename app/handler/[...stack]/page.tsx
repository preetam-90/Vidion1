import { StackHandler, AccountSettings } from "@stackframe/stack";
import { stackServerApp } from "../../../stack";
import StackAuthAvatarFixer from "./StackAuthAvatarFixer";

export default function Handler(props: unknown) {
  // Check if this is an account-settings route
  const isAccountSettings = typeof props === 'object' && props !== null && 
    'params' in props && 
    Array.isArray((props as any).params?.stack) && 
    (props as any).params?.stack?.includes('account-settings');

  if (isAccountSettings) {
    return (
      <div>
        <AccountSettings fullPage />
        <StackAuthAvatarFixer />
      </div>
    );
  }

  return <StackHandler fullPage app={stackServerApp} routeProps={props} />;
}
