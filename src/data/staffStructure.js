export const staffStructure = {
  sectors: [
    {
      name: "Kakamega West",
      supervisor: "Paul Odhiambo",
      zones: [
        {
          name: "Shimanyiro",
          staff: {
            meterReaders: ["Martin Mackenzie", "Samwel Nyamori"],
            revenueCollectors: ["Linda Njambi"],
            iiuInspectors: ["Elijah Toroitich"]
          }
        },
        {
          name: "Shinyalu",
          staff: {
            meterReaders: ["Jeremiah Kiprop", "Ronald Muhavi"],
            revenueCollectors: ["Kevin Barasa"],
            iiuInspectors: ["Erick Kiplagat"]
          }
        },
        {
          name: "Musoli",
          staff: {
            meterReaders: ["Arnold Chogo", "Obed Muchache"],
            revenueCollectors: ["Joseph Ongeri"],
            iiuInspectors: ["John Migeni"]
          }
        }
      ]
    },
    {
      name: "Kakamega East",
      supervisor: "To be assigned",
      zones: []
    },
    {
      name: "Mumias",
      supervisor: "To be assigned",
      zones: []
    }
  ],
  // Add admin and quality roles at the top level
  admin: {
    systemAdmin: ["Martin Karanja"]
  },
  processImprovement: {
    piQuality: ["Martin Karanja"]
  }
};

// Helper function to get all staff members by role
const getAllStaffByRole = (role) => {
  const staffMembers = [];
  staffStructure.sectors.forEach(sector => {
    // Add supervisor for each sector
    if (role === 'supervisors' && sector.supervisor) {
      staffMembers.push({
        name: sector.supervisor,
        role: 'Supervisor',
        zone: 'All Zones',
        sector: sector.name
      });
    }
    
    sector.zones.forEach(zone => {
      if (zone.staff[role] && zone.staff[role].length > 0) {
        zone.staff[role].forEach(name => {
          staffMembers.push({
            name,
            role,
            zone: zone.name,
            sector: sector.name
          });
        });
      }
    });
  });
  
  // Add admin staff
  if (role === 'systemAdmin' && staffStructure.admin[role]) {
    staffStructure.admin[role].forEach(name => {
      staffMembers.push({
        name,
        role: 'System Administrator',
        zone: 'All Zones',
        sector: 'Administration'
      });
    });
  }
  
  // Add quality assurance staff
  if (role === 'piQuality' && staffStructure.qualityAssurance[role]) {
    staffStructure.qualityAssurance[role].forEach(name => {
      staffMembers.push({
        name,
        role: 'PI (Quality)',
        zone: 'All Zones',
        sector: 'Quality Assurance'
      });
    });
  }
  
  return staffMembers;
};

// Get all IIU Inspectors (for meter inspection)
const getAllInspectors = () => {
  return getAllStaffByRole('iiuInspectors');
};

// Get all Meter Readers
const getAllMeterReaders = () => {
  return getAllStaffByRole('meterReaders');
};

// Get all Revenue Collectors
const getAllRevenueCollectors = () => {
  return getAllStaffByRole('revenueCollectors');
};

// Get all Supervisors
const getAllSupervisors = () => {
  return getAllStaffByRole('supervisors');
};

// Get all System Administrators
const getAllAdmins = () => {
  return getAllStaffByRole('systemAdmin');
};

// Get all Quality Assurance staff
const getAllQualityAssurance = () => {
  return getAllStaffByRole('piQuality');
};

// Get ALL staff members (including supervisors, admins, and quality assurance)
const getAllStaff = () => {
  const allStaff = [];
  
  // Add supervisors
  staffStructure.sectors.forEach(sector => {
    if (sector.supervisor) {
      allStaff.push({
        name: sector.supervisor,
        role: 'Supervisor',
        zone: 'All Zones',
        sector: sector.name
      });
    }
    
    // Add zone staff
    sector.zones.forEach(zone => {
      // Meter Readers
      if (zone.staff.meterReaders && zone.staff.meterReaders.length > 0) {
        zone.staff.meterReaders.forEach(name => {
          allStaff.push({
            name,
            role: 'Meter Reader',
            zone: zone.name,
            sector: sector.name
          });
        });
      }
      
      // Revenue Collectors
      if (zone.staff.revenueCollectors && zone.staff.revenueCollectors.length > 0) {
        zone.staff.revenueCollectors.forEach(name => {
          allStaff.push({
            name,
            role: 'Revenue Collector',
            zone: zone.name,
            sector: sector.name
          });
        });
      }
      
      // IIU Inspectors
      if (zone.staff.iiuInspectors && zone.staff.iiuInspectors.length > 0) {
        zone.staff.iiuInspectors.forEach(name => {
          allStaff.push({
            name,
            role: 'IIU Inspector',
            zone: zone.name,
            sector: sector.name
          });
        });
      }
    });
  });
  
  // Add admin staff
  if (staffStructure.admin.systemAdmin && staffStructure.admin.systemAdmin.length > 0) {
    staffStructure.admin.systemAdmin.forEach(name => {
      allStaff.push({
        name,
        role: 'System Administrator',
        zone: 'All Zones',
        sector: 'Administration'
      });
    });
  }
  
  // Add quality assurance staff
  if (staffStructure.qualityAssurance.piQuality && staffStructure.qualityAssurance.piQuality.length > 0) {
    staffStructure.qualityAssurance.piQuality.forEach(name => {
      allStaff.push({
        name,
        role: 'PI (Quality)',
        zone: 'All Zones',
        sector: 'Quality Assurance'
      });
    });
  }
  
  return allStaff;
};

// Export all functions
export {
  getAllStaffByRole,
  getAllInspectors,
  getAllMeterReaders,
  getAllRevenueCollectors,
  getAllSupervisors,
  getAllAdmins,
  getAllQualityAssurance,
  getAllStaff
};
