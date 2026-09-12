package com.prakashstores.controller;

import com.prakashstores.dto.BrandDto;
import com.prakashstores.dto.ProductCategoryDto;
import com.prakashstores.dto.ProductDto;
import com.prakashstores.dto.ProductFilterRequest;
import com.prakashstores.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/products")
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        List<ProductDto> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/products/{productId}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Long productId) {
        ProductDto product = productService.getProductById(productId);
        return ResponseEntity.ok(product);
    }

    @GetMapping("/products/search")
    public ResponseEntity<List<ProductDto>> searchProducts(@ModelAttribute ProductFilterRequest filterRequest) {
        List<ProductDto> products = productService.searchProducts(filterRequest);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<ProductCategoryDto>> getAllCategories() {
        List<ProductCategoryDto> categories = productService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/categories/{categoryId}")
    public ResponseEntity<ProductCategoryDto> getCategoryById(@PathVariable Long categoryId) {
        ProductCategoryDto category = productService.getCategoryById(categoryId);
        return ResponseEntity.ok(category);
    }

    @GetMapping("/brands")
    public ResponseEntity<List<BrandDto>> getAllBrands() {
        List<BrandDto> brands = productService.getAllBrands();
        return ResponseEntity.ok(brands);
    }

    @GetMapping("/brands/{brandId}")
    public ResponseEntity<BrandDto> getBrandById(@PathVariable Long brandId) {
        BrandDto brand = productService.getBrandById(brandId);
        return ResponseEntity.ok(brand);
    }
}