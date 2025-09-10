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
