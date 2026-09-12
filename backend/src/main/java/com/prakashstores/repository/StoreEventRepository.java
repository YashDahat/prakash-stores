package com.prakashstores.repository;

import com.prakashstores.model.StoreEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface StoreEventRepository extends JpaRepository<StoreEvent, Long> {
    List<StoreEvent> findByEventDateAfterOrderByEventDateAsc(LocalDate eventDate);
}