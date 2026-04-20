export interface User {
  id: number;
  username: string;
  role: 'staff' | 'manager' | 'admin';
  permissions: string[];
}

export interface PersonnelInfo {
  userId: number;
  name: string;
  position: string;
  hireDate: Date;
  schedule: string[];
}

