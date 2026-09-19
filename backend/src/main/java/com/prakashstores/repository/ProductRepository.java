package com.prakashstores.repository;

import com.prakashstores.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    List<Product> findByNameContainingIgnoreCase(String name);
    List<Product> findByProductCategory_Name(String categoryName);
    List<Product> findByBrand_Name(String brandName);
    Page<Product> findAll(Specification<Product> spec, Pageable pageable);
}