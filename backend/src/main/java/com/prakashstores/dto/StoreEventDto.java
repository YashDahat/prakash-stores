package com.prakashstores.dto;

import jakarta.validation.constraints.*;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoreEventDto {
    private Long id;
    private String title;
    private String description;
    private java.time.LocalDate eventDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String imageUrl;
}
