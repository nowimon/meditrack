export interface Vehicle {
  id: string;               // E.g. "VAN-01", "TRUCK-02"
  driverName: string;
  capacityKg: number;
  currentLoadKg: number;
  assignedRouteId?: string;
  status: 'IDLE' | 'EN_ROUTE' | 'MAINTENANCE';
}

export interface RouteEdge {
  fromFacilityId: number;
  toFacilityId: number;
  distanceKm: number;
  transitMinutes: number;
  isBiohazardApproved: boolean;
}
