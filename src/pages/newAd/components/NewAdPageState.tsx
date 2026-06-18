import { Component, useEffect, useState, type ErrorInfo, type ReactNode } from "react";

import { NoConnectionState, ServerErrorState } from "../../../components/ErrorState";

type NewAdPageStateProps = {
  children: ReactNode;
};

export function NewAdConnectionGuard({ children }: NewAdPageStateProps) {
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator === "undefined" ? true : navigator.onLine,
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <NoConnectionState
        className="flex-1"
        onRetry={() => setIsOnline(navigator.onLine)}
      />
    );
  }

  return children;
}

type NewAdErrorBoundaryState = {
  hasError: boolean;
};

export class NewAdErrorBoundary extends Component<
  NewAdPageStateProps,
  NewAdErrorBoundaryState
> {
  state: NewAdErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("new-ad page error", error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return <ServerErrorState className="flex-1" onRetry={this.retry} />;
    }

    return this.props.children;
  }
}

export function NewAdPageState({ children }: NewAdPageStateProps) {
  return (
    <NewAdErrorBoundary>
      <NewAdConnectionGuard>{children}</NewAdConnectionGuard>
    </NewAdErrorBoundary>
  );
}
