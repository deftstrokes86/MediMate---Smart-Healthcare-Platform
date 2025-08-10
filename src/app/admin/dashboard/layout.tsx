import ProtectedRoute from '@/components/auth/protected-route';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
      {children}
    </ProtectedRoute>
  );
}
