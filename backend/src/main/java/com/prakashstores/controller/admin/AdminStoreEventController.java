package com.prakashstores.controller.admin;

import com.prakashstores.dto.StoreEventDto;
import com.prakashstores.service.StoreEventService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/events")
public class AdminStoreEventController {

    private final StoreEventService storeEventService;

    public AdminStoreEventController(StoreEventService storeEventService) {
        this.storeEventService = storeEventService;
    }

    @GetMapping
    public List<StoreEventDto> getAllEvents() {
        return storeEventService.getAllEvents();
    }

    @GetMapping("/{id}")
    public StoreEventDto getEventById(@PathVariable Long id) {
        return storeEventService.getEventById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public StoreEventDto createEvent(@RequestBody StoreEventDto eventDto) {
        return storeEventService.createEvent(eventDto);
    }

    @PutMapping("/{id}")
    public StoreEventDto updateEvent(@PathVariable Long id, @RequestBody StoreEventDto eventDto) {
        return storeEventService.updateEvent(id, eventDto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEvent(@PathVariable Long id) {
        storeEventService.deleteEvent(id);
    }
}