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
public class ProductFilterRequest {
    private String categoryName;
    private String brandName;
    private String gender;
    private String size;
    private String color;
    private java.math.BigDecimal minPrice;
    private java.math.BigDecimal maxPrice;
    private String searchTerm;
    private Integer page;
    private String sortBy;
    private String sortDir;
}
