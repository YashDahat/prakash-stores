package com.prakashstores.controller;

import com.prakashstores.dto.ProductDto;
import com.prakashstores.model.Brand;
import com.prakashstores.model.ProductCategory;
import com.prakashstores.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public Page<ProductDto> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String searchTerm,
            Pageable pageable) {
        return productService.getAllProducts(category, brand, minPrice, maxPrice, searchTerm, pageable);
    }

    @GetMapping("/{id}")
    public ProductDto getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @GetMapping("/categories")
    public List<ProductCategory> getAllCategories() {
        return productService.getAllCategories();
    }

    @GetMapping("/brands")
    public List<Brand> getAllBrands() {
        return productService.getAllBrands();
    }
}