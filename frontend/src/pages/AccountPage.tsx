import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ProfileDetails from '@/components/account/ProfileDetails';
import OrderHistory from '@/components/account/OrderHistory';

export default function AccountPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('profile');

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-[#212121] mb-8">
          Welcome, {user?.username ?? 'Customer'}!
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-sm mb-8">
            <TabsTrigger value="profile" data-testid="account-profile-tab">Profile Details</TabsTrigger>
            <TabsTrigger value="orders" data-testid="account-orders-tab">Order History</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <ProfileDetails />
          </TabsContent>
          <TabsContent value="orders">
            <OrderHistory />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}