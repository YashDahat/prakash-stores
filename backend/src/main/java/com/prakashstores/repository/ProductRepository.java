package com.prakashstores.repository;

import com.prakashstores.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findAll();
    Optional<Product> findById(Long id);
    Product save(Product product);
    void deleteById(Long id);
    List<Product> findByCategoryIdAndBrandIdAndPriceBetween(Long categoryId, Long brandId, BigDecimal minPrice, BigDecimal maxPrice);
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findByBrandId(Long brandId);
    List<Product> findByNameContainingIgnoreCase(String name);
}