export const GHANA_REGIONS = [
  'Greater Accra',
  'Ashanti',
  'Eastern',
  'Western',
  'Western North',
  'Central',
  'Volta',
  'Oti',
  'Northern',
  'Savannah',
  'North East',
  'Upper East',
  'Upper West',
  'Bono',
  'Bono East',
  'Ahafo'
];

export const formatRegionLabel = (input?: string | null): string => {
  if (!input) {
    return 'Unspecified';
  }
  const trimmed = input.trim();
  if (!trimmed) {
    return 'Unspecified';
  }
  return GHANA_REGIONS.find(region => region.toLowerCase() === trimmed.toLowerCase()) ?? trimmed;
};
