'use client';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/store/auth';
export default function ProfilePage() {
  const user = useAuthStore(s => s.user);
  return <div className="p-6"><h1 className="text-3xl font-bold">Profile</h1><Card className="p-6 mt-4"><p>Name: {user?.firstName} {user?.lastName}</p><p>Email: {user?.email}</p></Card></div>;
}
