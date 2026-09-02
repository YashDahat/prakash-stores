package com.prakashstores.repository;

import com.prakashstores.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p WHERE " +
            "(:searchTerm IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
            "(:categoryName IS NULL OR p.category.name = :categoryName) AND " +
            "(:brandName IS NULL OR p.brand.name = :brandName) AND " +
            "(:gender IS NULL OR p.gender = :gender) AND " +
            "(:size IS NULL OR p.size = :size) AND " +
            "(:color IS NULL OR p.color = :color) AND " +
            "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR p.price <= :maxPrice)")
    Page<Product> searchProducts(
            @Param("searchTerm") String searchTerm,
            @Param("categoryName") String categoryName,
            @Param("brandName") String brandName,
            @Param("gender") String gender,
            @Param("size") String size,
            @Param("color") String color,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable);

    List<Product> findAllByIdIn(List<Long> productIds);
}