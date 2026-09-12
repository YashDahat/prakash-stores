package com.prakashstores.controller;

import com.prakashstores.dto.StoreEventDto;
import com.prakashstores.service.StoreEventService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/events")
public class StoreEventController {

    private final StoreEventService storeEventService;

    public StoreEventController(StoreEventService storeEventService) {
        this.storeEventService = storeEventService;
    }

    @GetMapping
    public List<StoreEventDto> getAllEvents() {
        return storeEventService.getAllEvents();
    }

    @GetMapping("/upcoming")
    public List<StoreEventDto> getUpcomingEvents() {
        return storeEventService.getUpcomingEvents();
    }

    @GetMapping("/{id}")
    public StoreEventDto getEventById(@PathVariable Long id) {
        return storeEventService.getEventById(id);
    }
}