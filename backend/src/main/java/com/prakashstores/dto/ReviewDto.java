package com.prakashstores.dto;

import jakarta.validation.constraints.*;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;
import com.prakashstores.model.ReviewStatus;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDto {
    private Long id;
    private Long productId;
    private Integer userId;
    private Integer rating;
    private String comment;
    private java.time.LocalDateTime reviewDate;
    private ReviewStatus status;
}
