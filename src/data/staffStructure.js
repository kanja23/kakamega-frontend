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
  ]
};

// Helper function to get all staff members by role
export const getAllStaffByRole = (role) => {
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
  return staffMembers;
};

// Get all IIU Inspectors (for meter inspection)
export const getAllInspectors = () => {
  return getAllStaffByRole('iiuInspectors');
};

// Get all Meter Readers
export const getAllMeterReaders = () => {
  return getAllStaffByRole('meterReaders');
};

// Get all Revenue Collectors
export const getAllRevenueCollectors = () => {
  return getAllStaffByRole('revenueCollectors');
};

// Get all Supervisors
export const getAllSupervisors = () => {
  return getAllStaffByRole('supervisors');
};

// Get ALL staff members (including supervisors)
export const getAllStaff = () => {
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
  
  return allStaff;
};
