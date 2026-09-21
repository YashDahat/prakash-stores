package com.prakashstores.service;

import com.prakashstores.dto.BulkUploadResult;
import com.prakashstores.dto.EventDto;
import com.prakashstores.model.Event;
import com.prakashstores.repository.EventRepository;
import com.prakashstores.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final SpreadsheetParser spreadsheetParser;

    public EventService(EventRepository eventRepository, SpreadsheetParser spreadsheetParser) {
        this.eventRepository = eventRepository;
        this.spreadsheetParser = spreadsheetParser;
    }

    public EventDto createEvent(EventDto eventDto) {
        Event event = convertToEntity(eventDto);
        Event savedEvent = eventRepository.save(event);
        return convertToDto(savedEvent);
    }

    public EventDto getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        return convertToDto(event);
    }

    public List<EventDto> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<EventDto> getUpcomingEvents() {
        return eventRepository.findByDateGreaterThanEqualOrderByDateAsc(LocalDate.now()).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public EventDto updateEvent(Long id, EventDto eventDto) {
        Event existingEvent = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        existingEvent.setName(eventDto.getName());
        existingEvent.setDescription(eventDto.getDescription());
        existingEvent.setDate(eventDto.getDate());
        existingEvent.setTime(eventDto.getTime());
        existingEvent.setLocation(eventDto.getLocation());
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

    /** Import events. Columns: name*, date* (yyyy-MM-dd), time (HH:mm), description, location, imageUrl.
     *  Rows with the same name + date as an existing event are skipped. */
    public BulkUploadResult bulkImportEvents(MultipartFile file) {
        List<Map<String, String>> rows = spreadsheetParser.parse(file);
        BulkUploadResult result = BulkUploadResult.builder().build();
        int rowNum = 1; // header is row 1
        for (Map<String, String> row : rows) {
            rowNum++;
            try {
                String name = value(row, "name");
                if (name.isEmpty()) { result.addError(rowNum, "Missing required column 'name'"); continue; }

                String dateStr = value(row, "date");
                if (dateStr.isEmpty()) { result.addError(rowNum, "Missing required column 'date' (yyyy-MM-dd)"); continue; }
                LocalDate date;
                try { date = LocalDate.parse(dateStr); } catch (DateTimeParseException e) { result.addError(rowNum, "Invalid date '" + dateStr + "' (expected yyyy-MM-dd)"); continue; }

                LocalTime time = null;
                String timeStr = value(row, "time");
                if (!timeStr.isEmpty()) {
                    try { time = LocalTime.parse(timeStr); } catch (DateTimeParseException e) { result.addError(rowNum, "Invalid time '" + timeStr + "' (expected HH:mm)"); continue; }
                }

                if (eventRepository.findFirstByNameIgnoreCaseAndDate(name, date).isPresent()) { result.setSkipped(result.getSkipped() + 1); continue; }

                Event event = new Event();
                event.setName(name);
                event.setDescription(value(row, "description"));
                event.setDate(date);
                event.setTime(time);
                event.setLocation(value(row, "location"));
                event.setImageUrl(value(row, "imageurl"));
                eventRepository.save(event);
                result.setCreated(result.getCreated() + 1);
            } catch (Exception e) {
                result.addError(rowNum, e.getMessage() == null ? "Unexpected error" : e.getMessage());
            }
        }
        return result;
    }

    private static String value(Map<String, String> row, String key) {
        String v = row.get(key);
        return v == null ? "" : v.trim();
    }

    private EventDto convertToDto(Event event) {
        return EventDto.builder()
                .id(event.getId())
                .name(event.getName())
                .description(event.getDescription())
                .date(event.getDate())
                .time(event.getTime())
                .location(event.getLocation())
                .imageUrl(event.getImageUrl())
                .build();
    }

    private Event convertToEntity(EventDto eventDto) {
        Event event = new Event();
        event.setId(eventDto.getId()); // ID might be null for new events, will be generated by DB
        event.setName(eventDto.getName());
        event.setDescription(eventDto.getDescription());
        event.setDate(eventDto.getDate());
        event.setTime(eventDto.getTime());
        event.setLocation(eventDto.getLocation());
        event.setImageUrl(eventDto.getImageUrl());
        return event;
    }
}