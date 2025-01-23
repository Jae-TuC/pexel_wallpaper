import PexelsWallpaper from '@/components/pexelswallpaper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StatusBar } from 'react-native';


const queryClient = new QueryClient();

export default function RootLayout() {

  return (
    <QueryClientProvider client={queryClient}>
      <PexelsWallpaper />
      <StatusBar hidden/>
    </QueryClientProvider>
  );
}
