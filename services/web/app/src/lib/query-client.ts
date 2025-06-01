// src/lib/query-client.ts
// This file is no longer strictly necessary if QueryClient is instantiated
// and managed solely within QueryClientProvider.tsx.
// However, if other parts of your application need to import the QueryClient instance
// directly (e.g., for manual cache invalidation outside of components),
// you might keep it or ensure the instance from QueryClientProvider is accessible.

// For now, to avoid confusion with the new QueryClientProvider component,
// I will comment out its contents. If you find you need to import
// queryClient directly elsewhere, you can restore this or adjust your architecture.

/*
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false, // Optional: adjust as needed
      retry: 1, // Optional: adjust as needed
    },
  },
});

export default queryClient;
*/

// You can leave this file empty or delete it if QueryClientProvider.tsx
// is the sole manager of the QueryClient instance.
// For now, let's leave it with contents commented to indicate its change in role.
export {}; // Add an empty export to make it a module if all content is removed
