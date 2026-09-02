// GENERATED from the backend API contract — do not edit by hand.
// One function per endpoint; paths and types are ground truth.

import apiClient from '@/api/client';
import type { EventDto } from '@/types/event';

export const getAllEvents = async (): Promise<EventDto[]> => {
  const response = await apiClient.get<EventDto[]>('/api/v1/events');
  return response.data;
};

export const getEventById = async (eventId: number): Promise<EventDto> => {
  const response = await apiClient.get<EventDto>(`/api/v1/events/${eventId}`);
  return response.data;
};

export const createEvent = async (request: EventDto): Promise<EventDto> => {
  const response = await apiClient.post<EventDto>('/api/v1/admin/events', request);
  return response.data;
};

export const updateEvent = async (eventId: number, request: EventDto): Promise<EventDto> => {
  const response = await apiClient.put<EventDto>(`/api/v1/admin/events/${eventId}`, request);
  return response.data;
};

export const deleteEvent = async (eventId: number): Promise<void> => {
  await apiClient.delete<void>(`/api/v1/admin/events/${eventId}`);
};

