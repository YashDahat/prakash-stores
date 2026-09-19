import React from 'react';
import { useAuth } from '@/context/AuthContext';
import AccountLayout from '@/components/layout/AccountLayout';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <AccountLayout>
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-semibold text-[#212121] mb-8">My Profile</h1>
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            {user ? (
              <div>
                <p className="text-lg mb-2">
                  <span className="font-semibold">Username:</span> {user.username}
                </p>
                <p className="text-lg mb-2">
                  <span className="font-semibold">Role:</span> {user.role}
                </p>
                {/* Future: Add form for updating profile information */}
                <p className="text-gray-600 mt-4">
                  Profile editing functionality will be available soon.
                </p>
              </div>
            ) : (
              <p className="text-lg text-gray-600">Please log in to view your profile.</p>
            )}
          </div>
        </div>
      </section>
    </AccountLayout>
  );
};

export default ProfilePage;