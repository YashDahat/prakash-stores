package com.prakashstores.controller.admin;

import com.prakashstores.dto.ProductDto;
import com.prakashstores.model.Brand;
import com.prakashstores.model.Product;
import com.prakashstores.model.ProductCategory;
import com.prakashstores.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/products")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProductController {

    private final ProductService productService;

    @Autowired
    public AdminProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public ProductDto createProduct(@RequestBody ProductDto productDto) {
        Product product = convertToEntity(productDto);
        Product createdProduct = productService.createProduct(product);
        return convertToDto(createdProduct);
    }

    @PutMapping("/{productId}")
    public ProductDto updateProduct(@PathVariable Long productId, @RequestBody ProductDto productDto) {
        Product product = convertToEntity(productDto);
        Product updatedProduct = productService.updateProduct(productId, product);
        return convertToDto(updatedProduct);
    }

    @DeleteMapping("/{productId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable Long productId) {
        productService.deleteProduct(productId);
    }

    @PutMapping("/{productId}/stock")
    public ProductDto updateProductStock(@PathVariable Long productId, @RequestBody Map<String, Integer> payload) {
        Integer quantityChange = payload.get("quantityChange");
        if (quantityChange == null) {
            throw new IllegalArgumentException("Quantity change must be provided.");
        }
        Product updatedProduct = productService.updateProductStock(productId, quantityChange);
        return convertToDto(updatedProduct);
    }

    private Product convertToEntity(ProductDto productDto) {
        Product product = new Product();
        product.setId(productDto.getId());
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setImageUrl(productDto.getImageUrl());
        product.setStockQuantity(productDto.getStockQuantity());
        product.setSize(productDto.getSize());
        product.setColor(productDto.getColor());
        product.setMaterial(productDto.getMaterial());
        product.setGender(productDto.getGender());
        product.setActive(productDto.getActive());

        if (productDto.getCategory() != null && !productDto.getCategory().isEmpty()) {
            ProductCategory category = new ProductCategory();
            category.setName(productDto.getCategory());
            product.setCategory(category);
        }

        if (productDto.getBrand() != null && !productDto.getBrand().isEmpty()) {
            Brand brand = new Brand();
            brand.setName(productDto.getBrand());
            product.setBrand(brand);
        }
        return product;
    }

    private ProductDto convertToDto(Product product) {
        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .imageUrl(product.getImageUrl())
                .stockQuantity(product.getStockQuantity())
                .size(product.getSize())
                .color(product.getColor())
                .material(product.getMaterial())
                .gender(product.getGender())
                .active(product.getActive())
                .category(product.getCategory() != null ? product.getCategory().getName() : null)
                .brand(product.getBrand() != null ? product.getBrand().getName() : null)
                .build();
    }
}