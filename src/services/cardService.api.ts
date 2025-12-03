import { apiClient } from './apiClient';
import { endpoints } from '@/constants/api-url';
import type { Service } from '@/types/service.interface';

export const fetchServiceCatalog = async () => {
    try {
        const res = await apiClient<Service[]>(endpoints.serviceCatalogUrl);

        return res;

    } catch (err) {
        console.error('Failed to load service catalog:', err);
        throw err;
    }
};
