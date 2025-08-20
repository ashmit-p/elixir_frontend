import { Suspense } from 'react';
import CommunityContent from '@/components/CommunityContent';

function CommunityLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-950 dark:to-slate-900">
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 pt-16">
        <div className="text-center mb-16">
          <div className="animate-pulse">
            <div className="w-16 h-16 mx-auto mb-6 bg-slate-200 dark:bg-slate-700 rounded-3xl"></div>
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-lg w-96 mx-auto mb-4"></div>
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-64 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RoomListPage() {
  return (
    <Suspense fallback={<CommunityLoading />}>
      <CommunityContent />
    </Suspense>
  );
}
