import { createContext, useContext, useState, type ReactNode } from 'react';

export interface AdditionalService {
  service_id: string;
  service_name: string;
  price: number;
  description: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

interface AdditionalServiceContextType {
  services: AdditionalService[];
  addService: (service: Omit<AdditionalService, 'service_id' | 'created_at' | 'updated_at'>) => void;
  updateService: (id: string, service: Partial<AdditionalService>) => void;
  deleteService: (id: string) => void;
  toggleServiceStatus: (id: string) => void;
}

const AdditionalServiceContext = createContext<AdditionalServiceContextType | undefined>(undefined);

export function AdditionalServiceProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<AdditionalService[]>([
    {
      service_id: 's1',
      service_name: 'Airport transfer',
      price: 50,
      description: 'Transfer service from airport to hotel and back by luxury car',
      status: 'active',
      created_at: '2024-01-15T08:00:00Z',
      updated_at: '2024-01-15T08:00:00Z'
    },
    {
      service_id: 's2',
      service_name: 'Spa & Massage',
      price: 80,
      description: 'Premium 90-minute relaxing spa and massage service',
      status: 'active',
      created_at: '2024-01-15T08:00:00Z',
      updated_at: '2024-01-15T08:00:00Z'
    },
    {
      service_id: 's3',
      service_name: 'Breakfast buffet',
      price: 25,
      description: 'International breakfast buffet with over 50 diverse dishes',
      status: 'active',
      created_at: '2024-01-15T08:00:00Z',
      updated_at: '2024-01-15T08:00:00Z'
    },
    {
      service_id: 's4',
      service_name: 'Laundry service',
      price: 15,
      description: 'Express laundry service within 24 hours',
      status: 'active',
      created_at: '2024-01-15T08:00:00Z',
      updated_at: '2024-01-15T08:00:00Z'
    },
    {
      service_id: 's5',
      service_name: 'City tour',
      price: 12,
      description: 'Guided tour of the city?s famous attractions',
      status: 'active',
      created_at: '2024-02-10T08:00:00Z',
      updated_at: '2024-02-10T08:00:00Z'
    },
    {
      service_id: 's6',
      service_name: 'Motorbike rental',
      price: 20,
      description: 'Daily automatic motorbike rental, includes helmet and insurance',
      status: 'active',
      created_at: '2024-02-15T08:00:00Z',
      updated_at: '2024-02-15T08:00:00Z'
    },
    {
      service_id: 's7',
      service_name: '24/7 Gym access',
      price: 10,
      description: 'Access to a modern gym with full equipment',
      status: 'active',
      created_at: '2024-03-01T08:00:00Z',
      updated_at: '2024-03-01T08:00:00Z'
    },
    {
      service_id: 's8',
      service_name: 'Infinity pool',
      price: 15,
      description: 'Access to rooftop infinity pool with panoramic view',
      status: 'active',
      created_at: '2024-03-05T08:00:00Z',
      updated_at: '2024-03-05T08:00:00Z'
    },
    {
      service_id: 's9',
      service_name: 'Special room decoration',
      price: 60,
      description: 'Room decoration for anniversaries, birthdays, or honeymoons with flowers and balloons',
      status: 'active',
      created_at: '2024-03-10T08:00:00Z',
      updated_at: '2024-03-10T08:00:00Z'
    },
    {
      service_id: 's10',
      service_name: 'Baby sitting',
      price: 30,
      description: 'Professional hourly babysitting service',
      status: 'active',
      created_at: '2024-03-15T08:00:00Z',
      updated_at: '2024-03-15T08:00:00Z'
    },
    {
      service_id: 's11',
      service_name: 'Romantic dinner',
      price: 15,
      description: 'Romantic rooftop dinner with candlelight and live music',
      status: 'inactive',
      created_at: '2024-04-01T08:00:00Z',
      updated_at: '2024-04-01T08:00:00Z'
    },
    {
      service_id: 's12',
      service_name: 'Premium minibar',
      price: 40,
      description: 'Minibar stocked with wine and premium snacks',
      status: 'active',
      created_at: '2024-04-05T08:00:00Z',
      updated_at: '2024-04-05T08:00:00Z'
    }
  ]);

  const addService = (service: Omit<AdditionalService, 'service_id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString();
    const newService: AdditionalService = {
      ...service,
      service_id: `s${Date.now()}`,
      created_at: now,
      updated_at: now
    };
    setServices([...services, newService]);
  };

  const updateService = (id: string, service: Partial<AdditionalService>) => {
    setServices(services.map(s => 
      s.service_id === id 
        ? { ...s, ...service, updated_at: new Date().toISOString() } 
        : s
    ));
  };

  const deleteService = (id: string) => {
    setServices(services.filter(s => s.service_id !== id));
  };

  const toggleServiceStatus = (id: string) => {
    setServices(services.map(s => 
      s.service_id === id 
        ? { 
            ...s, 
            status: s.status === 'active' ? 'inactive' : 'active',
            updated_at: new Date().toISOString()
          } 
        : s
    ));
  };

  return (
    <AdditionalServiceContext.Provider value={{
      services,
      addService,
      updateService,
      deleteService,
      toggleServiceStatus
    }}>
      {children}
    </AdditionalServiceContext.Provider>
  );
}

export function useAdditionalServices() {
  const context = useContext(AdditionalServiceContext);
  if (context === undefined) {
    throw new Error('useAdditionalServices must be used within an AdditionalServiceProvider');
  }
  return context;
}
