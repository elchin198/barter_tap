import { useAuth } from "@/context/AuthContext";
import { Route, Redirect } from "wouter";
import { Loader2 } from "lucide-react";

interface GuestRouteProps {
  path: string;
  component: React.ComponentType;
}

/**
 * GuestRoute komponenti yalnız giriş etməmiş istifadəçilər üçün nəzərdə tutulub.
 * Əgər istifadəçi artıq giriş edibsə, ana səhifəyə yönləndirilir.
 */
export const GuestRoute: React.FC<GuestRouteProps> = ({
  path,
  component: Component,
}) => {
  const { user, isLoading } = useAuth();

  // Əgər hələ yükləmə gedərsə, loading spinner göstər
  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  // Əgər istifadəçi giriş edibsə, ana səhifəyə yönləndir
  if (user) {
    return (
      <Route path={path}>
        <Redirect to="/" />
      </Route>
    );
  }

  // Əgər istifadəçi giriş etməyibsə, komponenti göstər
  return (
    <Route path={path}>
      <Component />
    </Route>
  );
};