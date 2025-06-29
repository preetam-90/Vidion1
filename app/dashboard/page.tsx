import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-6">
            Welcome to your Dashboard, {user?.firstName || 'User'}!
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-700/50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-2">Watch History</h2>
              <p className="text-gray-400">Track your viewing progress and recently watched content.</p>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-2">Favorites</h2>
              <p className="text-gray-400">Your saved movies, shows, and videos in one place.</p>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-2">Watch Later</h2>
              <p className="text-gray-400">Content you've saved to watch when you have time.</p>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-2">Recommendations</h2>
              <p className="text-gray-400">Personalized content suggestions based on your interests.</p>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-2">Settings</h2>
              <p className="text-gray-400">Customize your viewing experience and account preferences.</p>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-2">Account Info</h2>
              <p className="text-gray-400">
                Email: {user?.emailAddresses[0]?.emailAddress || 'Not available'}
              </p>
              <p className="text-gray-400">
                Member since: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
