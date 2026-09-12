// GENERATED from the backend API contract — do not edit by hand.
// One function per endpoint; paths and types are ground truth.

import apiClient from '@/api/client';
import type { StoreEventDto } from '@/types/storeEvent';

export const getAllEvents = async (): Promise<StoreEventDto[]> => {
  const response = await apiClient.get<StoreEventDto[]>('/api/v1/events');
  return response.data;
};

export const getUpcomingEvents = async (): Promise<StoreEventDto[]> => {
  const response = await apiClient.get<StoreEventDto[]>('/api/v1/events/upcoming');
  return response.data;
};

export const getEventById = async (id: number): Promise<StoreEventDto> => {
  const response = await apiClient.get<StoreEventDto>(`/api/v1/events/${id}`);
  return response.data;
};

export const adminGetAllEvents = async (): Promise<StoreEventDto[]> => {
  const response = await apiClient.get<StoreEventDto[]>('/api/v1/admin/events');
  return response.data;
};

export const adminGetEventById = async (id: number): Promise<StoreEventDto> => {
  const response = await apiClient.get<StoreEventDto>(`/api/v1/admin/events/${id}`);
  return response.data;
};

export const createEvent = async (request: StoreEventDto): Promise<StoreEventDto> => {
  const response = await apiClient.post<StoreEventDto>('/api/v1/admin/events', request);
  return response.data;
};

export const updateEvent = async (id: number, request: StoreEventDto): Promise<StoreEventDto> => {
  const response = await apiClient.put<StoreEventDto>(`/api/v1/admin/events/${id}`, request);
  return response.data;
};

export const deleteEvent = async (id: number): Promise<void> => {
  await apiClient.delete<void>(`/api/v1/admin/events/${id}`);
};

