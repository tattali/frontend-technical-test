import { InfiniteQueryObserverBaseResult } from "@tanstack/react-query";
import { useCallback, useRef } from "react";

export function useLastRef(isFetching: InfiniteQueryObserverBaseResult['isFetching'], hasNextPage: InfiniteQueryObserverBaseResult['hasNextPage'], fetchNextPage: InfiniteQueryObserverBaseResult['fetchNextPage']) {
  const observer = useRef<{[key: string]: IntersectionObserver | null}>({});
  return useCallback(
    (node: HTMLDivElement, key: string) => {
      if (isFetching) return;
      if (observer.current[key]) observer.current[key].disconnect();

      observer.current[key] = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current[key].observe(node);
    },
    [isFetching, fetchNextPage, hasNextPage]
  );
}
