// src/utils/storage.js
export const saveInspection = (inspectionData) => {
  try {
    const inspections = JSON.parse(localStorage.getItem('inspections') || '[]');
    const newInspection = {
      ...inspectionData,
      id: Date.now(),
      synced: false,
      timestamp: new Date().toISOString()
    };
    inspections.push(newInspection);
    localStorage.setItem('inspections', JSON.stringify(inspections));
    return newInspection;
  } catch (error) {
    console.error('Error saving inspection:', error);
    throw new Error('Failed to save inspection');
  }
};

export const getInspections = () => {
  try {
    return JSON.parse(localStorage.getItem('inspections') || '[]');
  } catch (error) {
    console.error('Error getting inspections:', error);
    return [];
  }
};

export const getPendingSyncCount = () => {
  const inspections = getInspections();
  return inspections.filter(inspection => !inspection.synced).length;
};
