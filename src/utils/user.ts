import { User } from '../types/User';

const ROLE_LABELS: Record<User['role'], string> = {
  landlord: 'Landlord',
  renter: 'Renter',
  admin: 'Administrator',
};

const ROLE_COLORS: Record<User['role'], string> = {
  landlord: '2563eb',
  renter: '16a34a',
  admin: 'f97316',
};

export const getUserRoleLabel = (role?: User['role']): string => {
  if (!role) {
    return 'Property Owner';
  }
  return ROLE_LABELS[role] ?? 'Property Owner';
};

export const getUserAvatarFallback = (role?: User['role'], name?: string): string => {
  const effectiveRole: User['role'] = role ?? 'landlord';
  const color = ROLE_COLORS[effectiveRole];
  const label = name || getUserRoleLabel(role);
  const encodedName = encodeURIComponent(label);
  return `https://ui-avatars.com/api/?name=${encodedName}&background=${color}&color=fff`;
};
