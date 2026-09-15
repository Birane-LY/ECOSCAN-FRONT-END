export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN_ORGANISATION: 'ADMIN_ORGANISATION',
  UTILISATEUR_ORGANISATION: 'UTILISATEUR_ORGANISATION',
  CONSULTANT: 'CONSULTANT',
  // Incompatibilités ou équivalents UI Front
  ADMIN: 'admin',
  OPS: 'ops',
  VIEWER: 'viewer',
}

// Convertit un rôle Django en rôle UI Front-End
export function mapRoleToFront(backendRole) {
  switch (backendRole) {
    case 'SUPER_ADMIN':
    case 'ADMIN_ORGANISATION':
      return 'admin'
    case 'UTILISATEUR_ORGANISATION':
      return 'ops'
    case 'CONSULTANT':
    default:
      return 'viewer'
  }
}

export const ROLE_PROFILES = {
  admin: {
    name: 'Camille Martin',
    initials: 'CM',
    label: 'Administratrice',
    email: 'camille@nova-industries.fr',
  },
  ops: {
    name: 'Ousmane Diop',
    initials: 'OD',
    label: 'Opérations',
    email: 'ousmane@nova-industries.fr',
  },
  viewer: {
    name: 'Fatou Ndiaye',
    initials: 'FN',
    label: 'Lecture seule',
    email: 'fatou@nova-industries.fr',
  },
}