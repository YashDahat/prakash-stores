package com.prakashstores.controller;

import com.prakashstores.dto.EventDto;
import com.prakashstores.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping
    public List<EventDto> getAllEvents() {
        return eventService.getAllEvents();
    }

    @GetMapping("/{eventId}")
    public EventDto getEventById(@PathVariable Long eventId) {
        return eventService.getEventById(eventId);
    }
}