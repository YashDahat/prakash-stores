package com.prakashstores.repository;

import com.prakashstores.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findAllByEventDateAfterOrderByEventDateAsc(LocalDate date);
}