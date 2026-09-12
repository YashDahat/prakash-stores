package com.prakashstores.service;

import com.prakashstores.dto.StoreEventDto;
import com.prakashstores.exception.ResourceNotFoundException;
import com.prakashstores.model.StoreEvent;
import com.prakashstores.repository.StoreEventRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StoreEventService {

    private final StoreEventRepository storeEventRepository;

    public StoreEventService(StoreEventRepository storeEventRepository) {
        this.storeEventRepository = storeEventRepository;
    }

    public List<StoreEventDto> getAllEvents() {
        return storeEventRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<StoreEventDto> getUpcomingEvents() {
        return storeEventRepository.findByEventDateAfterOrderByEventDateAsc(LocalDate.now()).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public StoreEventDto getEventById(Long id) {
        StoreEvent event = storeEventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Store event not found with id: " + id));
        return convertToDto(event);
    }

    public StoreEventDto createEvent(StoreEventDto eventDto) {
        StoreEvent event = convertToEntity(eventDto);
        event.setId(null); // Ensure ID is null for new entity creation
        StoreEvent savedEvent = storeEventRepository.save(event);
        return convertToDto(savedEvent);
    }

    public StoreEventDto updateEvent(Long id, StoreEventDto eventDto) {
        StoreEvent existingEvent = storeEventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Store event not found with id: " + id));

        existingEvent.setTitle(eventDto.getTitle());
        existingEvent.setDescription(eventDto.getDescription());
        existingEvent.setEventDate(eventDto.getEventDate());
        existingEvent.setStartTime(eventDto.getStartTime());
        existingEvent.setEndTime(eventDto.getEndTime());
        existingEvent.setImageUrl(eventDto.getImageUrl());

        StoreEvent updatedEvent = storeEventRepository.save(existingEvent);
        return convertToDto(updatedEvent);
    }

    public void deleteEvent(Long id) {
        if (!storeEventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Store event not found with id: " + id);
        }
        storeEventRepository.deleteById(id);
    }

    private StoreEventDto convertToDto(StoreEvent event) {
        return StoreEventDto.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .eventDate(event.getEventDate())
                .startTime(event.getStartTime())
                .endTime(event.getEndTime())
                .imageUrl(event.getImageUrl())
                .build();
    }

    private StoreEvent convertToEntity(StoreEventDto eventDto) {
        StoreEvent event = new StoreEvent();
        event.setId(eventDto.getId()); // ID might be null for creation, or set for update
        event.setTitle(eventDto.getTitle());
        event.setDescription(eventDto.getDescription());
        event.setEventDate(eventDto.getEventDate());
        event.setStartTime(eventDto.getStartTime());
        event.setEndTime(eventDto.getEndTime());
        event.setImageUrl(eventDto.getImageUrl());
        return event;
    }
}