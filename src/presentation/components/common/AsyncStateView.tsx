import type { ReactNode } from "react";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import { EmptyState } from "./EmptyState";

type AsyncState<T> =
  | { status: "loading" }
  | { status: "error"; error: string; retry?: () => void }
  | { status: "empty" }
  | { status: "success"; data: T };

type AsyncStateViewProps<T> = {
  state: AsyncState<T>;
  render: (data: T) => ReactNode;
};

export function AsyncStateView<T>({ state, render }: AsyncStateViewProps<T>) {
  if (state.status === "loading") return <LoadingState />;

  if (state.status === "error") {
    return <ErrorState message={state.error} retry={state.retry} />;
  }

  if (state.status === "empty") {
    return <EmptyState />;
  }

  return <>{render(state.data)}</>;
}
