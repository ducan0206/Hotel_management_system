import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, type ReactNode } from 'react';
import { getAllServices, addNewService, updatingService, deletingService } from '../apis/APIFunction';
import { toast } from 'sonner'

export interface AdditionalService {
    service_id: number;
    service_name: string;
    price: number;
    description: string;
    status: 'Available' | 'Unavailable';
    created_at: string;
    updated_at: string;
}

interface AdditionalServiceContextType {
    services: AdditionalService[];
    addService: (serviceData: any) => void;
    updateService: (id: number, serviceData: any) => void;
    deleteService: (id: number) => void;
    toggleServiceStatus: (id: number, serviceData: any) => void;
}

const AdditionalServiceContext = createContext<AdditionalServiceContextType | undefined>(undefined);

export function AdditionalServiceProvider({ children }: { children: ReactNode }) {
    const {data: services = [], refetch: refetchServices} = useQuery<AdditionalService[]>({
        queryKey: ['services'],
        queryFn: getAllServices
    })

    const addService = async (serviceData: any) => {
        try {
            const res = await addNewService(serviceData);
            if(res.status !== 200) {
                toast.error(<span className='mess'>{res.message}</span>);
                return;
            }
            toast.success(<span className='mess'>Add a new service successfully!</span>);
            refetchServices();
        } catch (error) {
            console.log("Error: add new service", error);
        }
    };

    const updateService = async (id: number, serviceData: any) => {
        try {
            const res = await updatingService(id, serviceData);
            if(res.status !== 200) {
                toast.error(<span className='mess'>{res.message}</span>)
                return;
            }
            toast.success(<span className='mess'>Update service successfully!</span>);
            refetchServices();
        } catch (error) {
            console.log("Error: update service", error);
        }
    };

    const deleteService = async (id: number) => {
        try {
            const res = await deletingService(id);
            console.log(res);
            if(res.status !== 200) {
                toast.error(<span className='mess'>{res.message}</span>)
                return;
            }
            toast.success(<span className='mess'>Delete service successfully!</span>);
            refetchServices();
        } catch (error) {
            console.log("Error: delete service", error);
        }
    };

    const toggleServiceStatus = async (id: number, serviceData: any) => {
        try {
            console.log(id);
            console.log(serviceData);
            const res = await updatingService(id, serviceData);
            if(res.status !== 200) {
                toast.error(<span className='mess'>{res.message}</span>)
                return;
            }
            toast.success(<span className='mess'>Toggle service status successfully!</span>);
            refetchServices();
        } catch (error) {
            console.log("Error: toggle service status", error);
        }
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
