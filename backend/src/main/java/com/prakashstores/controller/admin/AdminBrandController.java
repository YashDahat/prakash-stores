package com.prakashstores.controller.admin;

import com.prakashstores.dto.BrandDto;
import com.prakashstores.exception.ResourceNotFoundException;
import com.prakashstores.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/brands")
public class AdminBrandController {

    private final ProductService productService;

    public AdminBrandController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<BrandDto> createBrand(@RequestBody BrandDto brandDto) {
        BrandDto createdBrand = productService.createBrand(brandDto);
        return new ResponseEntity<>(createdBrand, HttpStatus.CREATED);
    }

    @PutMapping("/{brandId}")
    public ResponseEntity<BrandDto> updateBrand(@PathVariable Long brandId, @RequestBody BrandDto brandDto) {
        try {
            BrandDto updatedBrand = productService.updateBrand(brandId, brandDto);
            return new ResponseEntity<>(updatedBrand, HttpStatus.OK);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{brandId}")
    public ResponseEntity<Void> deleteBrand(@PathVariable Long brandId) {
        try {
            productService.deleteBrand(brandId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}