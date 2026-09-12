package com.prakashstores.controller.admin;

import com.prakashstores.dto.ProductCategoryDto;
import com.prakashstores.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/categories")
public class AdminCategoryController {

    private final ProductService productService;

    public AdminCategoryController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<ProductCategoryDto> createCategory(@RequestBody ProductCategoryDto categoryDto) {
        ProductCategoryDto createdCategory = productService.createCategory(categoryDto);
        return new ResponseEntity<>(createdCategory, HttpStatus.CREATED);
    }

    @PutMapping("/{categoryId}")
    public ResponseEntity<ProductCategoryDto> updateCategory(@PathVariable Long categoryId, @RequestBody ProductCategoryDto categoryDto) {
        ProductCategoryDto updatedCategory = productService.updateCategory(categoryId, categoryDto);
        return ResponseEntity.ok(updatedCategory);
    }

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long categoryId) {
        productService.deleteCategory(categoryId);
        return ResponseEntity.noContent().build();
    }
}