package com.prakashstores.repository;

import com.prakashstores.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long> {
    // "Upcoming" includes events happening today, so match date >= today (not strictly after).
    List<Event> findByDateGreaterThanEqualOrderByDateAsc(LocalDate date);
    Optional<Event> findFirstByNameIgnoreCaseAndDate(String name, LocalDate date);
}