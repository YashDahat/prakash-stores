import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function ProfileDetails(): React.JSX.Element {
  const { user } = useAuth();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Profile Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" value={user?.firstName ?? ''} readOnly className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#E87A00] focus:border-transparent" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" value={user?.lastName ?? ''} readOnly className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#E87A00] focus:border-transparent" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={user?.email ?? ''} readOnly className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#E87A00] focus:border-transparent" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" value={user?.phone ?? ''} readOnly className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#E87A00] focus:border-transparent" />
        </div>
      </CardContent>
    </Card>
  );
}