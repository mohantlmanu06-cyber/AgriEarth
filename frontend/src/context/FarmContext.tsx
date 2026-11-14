import React, { createContext, useContext, useState, useEffect } from 'react';
import { Field, Crop, FieldAlert } from '../types';
import { apiService } from '../services/api';

interface FarmContextType {
  fields: Field[];
  selectedField: Field | null;
  setSelectedField: (field: Field) => void;
  setSelectedFieldId: (id: number) => void;
  crops: Crop[];
  alerts: FieldAlert[];
  loading: boolean;
  refreshFields: () => Promise<void>;
  addNewField: (data: Partial<Field>) => Promise<Field>;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const FarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [alerts, setAlerts] = useState<FieldAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [fieldsData, cropsData, alertsData] = await Promise.all([
        apiService.getFields(),
        apiService.getCrops(),
        apiService.getAlerts()
      ]);
      setFields(fieldsData);
      if (fieldsData.length > 0) {
        setSelectedField(prev => (prev ? fieldsData.find(f => f.id === prev.id) || fieldsData[0] : fieldsData[0]));
      }
      setCrops(cropsData);
      setAlerts(alertsData);
    } catch (e) {
      console.error("Error loading farm data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const setSelectedFieldId = (id: number) => {
    const found = fields.find(f => f.id === id);
    if (found) setSelectedField(found);
  };

  const addNewField = async (data: Partial<Field>): Promise<Field> => {
    const created = await apiService.createField(data);
    setFields(prev => [created, ...prev]);
    setSelectedField(created);
    return created;
  };

  return (
    <FarmContext.Provider
      value={{
        fields,
        selectedField,
        setSelectedField,
        setSelectedFieldId,
        crops,
        alerts,
        loading,
        refreshFields: loadData,
        addNewField
      }}
    >
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => {
  const context = useContext(FarmContext);
  if (!context) throw new Error('useFarm must be used within a FarmProvider');
  return context;
};
