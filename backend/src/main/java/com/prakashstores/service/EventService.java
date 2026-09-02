package com.prakashstores.service;

import com.prakashstores.dto.EventDto;
import com.prakashstores.model.Event;
import com.prakashstores.repository.EventRepository;
import com.prakashstores.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public EventDto createEvent(EventDto eventDto) {
        Event event = new Event();
        event.setName(eventDto.getName());
        event.setDescription(eventDto.getDescription());
        event.setEventDate(eventDto.getEventDate());
        event.setEventTime(eventDto.getEventTime());
        event.setImageUrl(eventDto.getImageUrl());
        Event savedEvent = eventRepository.save(event);
        return convertToDto(savedEvent);
    }

    public EventDto getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        return convertToDto(event);
    }

    public List<EventDto> getAllEvents() {
        return eventRepository.findAllByEventDateAfterOrderByEventDateAsc(LocalDate.now()).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public EventDto updateEvent(Long id, EventDto eventDto) {
        Event existingEvent = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        existingEvent.setName(eventDto.getName());
        existingEvent.setDescription(eventDto.getDescription());
        existingEvent.setEventDate(eventDto.getEventDate());
        existingEvent.setEventTime(eventDto.getEventTime());
        existingEvent.setImageUrl(eventDto.getImageUrl());

        Event updatedEvent = eventRepository.save(existingEvent);
        return convertToDto(updatedEvent);
    }

    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Event not found with id: " + id);
        }
        eventRepository.deleteById(id);
    }

    private EventDto convertToDto(Event event) {
        return EventDto.builder()
                .id(event.getId())
                .name(event.getName())
                .description(event.getDescription())
                .eventDate(event.getEventDate())
                .eventTime(event.getEventTime())
                .imageUrl(event.getImageUrl())
                .build();
    }
}