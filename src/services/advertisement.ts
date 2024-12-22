import client from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api-config';
import { AdCreateInput, AdListResponse, AdQuery, AdUpdateInput, Advertisement } from '@/types/advertisement';

class AdvertisementService {
  async getAll(query?: AdQuery): Promise<AdListResponse> {
    const response = await client.get(API_ENDPOINTS.ADVERTISEMENTS, { params: query });
    return response.data;
  }

  async getById(id: number): Promise<Advertisement> {
    const response = await client.get(API_ENDPOINTS.ADVERTISEMENT_DETAIL(id));
    return response.data;
  }

  async create(input: AdCreateInput): Promise<Advertisement> {
    const response = await client.post(API_ENDPOINTS.ADVERTISEMENTS, input);
    return response.data;
  }

  async update(input: AdUpdateInput): Promise<Advertisement> {
    const response = await client.put(API_ENDPOINTS.ADVERTISEMENT_DETAIL(input.id), input);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await client.delete(API_ENDPOINTS.ADVERTISEMENT_DETAIL(id));
  }

  async updateStatus(id: number, isVisible: boolean): Promise<void> {
    await client.patch(API_ENDPOINTS.ADVERTISEMENT_STATUS(id), { isVisible });
  }

  async updateOrder(id: number, sort: number): Promise<void> {
    await client.patch(API_ENDPOINTS.ADVERTISEMENT_ORDER(id), { sort });
  }
}

export const advertisementService = new AdvertisementService(); 