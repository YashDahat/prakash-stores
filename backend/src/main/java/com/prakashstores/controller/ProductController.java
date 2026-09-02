package com.prakashstores.controller;

import com.prakashstores.dto.ProductDto;
import com.prakashstores.dto.ProductFilterRequest;
import com.prakashstores.model.Product;
import com.prakashstores.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public Page<ProductDto> getAllProducts(ProductFilterRequest filterRequest) {
        int page = filterRequest.getPage() != null ? filterRequest.getPage() : 0;
        int size = 10; // Default size, can be made configurable
        String sortBy = filterRequest.getSortBy() != null ? filterRequest.getSortBy() : "id";
        Sort.Direction sortDir = filterRequest.getSortDir() != null && filterRequest.getSortDir().equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDir, sortBy));

        Page<Product> products = productService.getAllProducts(
                filterRequest.getCategoryName(),
                filterRequest.getBrandName(),
                filterRequest.getGender(),
                filterRequest.getSize(),
                filterRequest.getColor(),
                filterRequest.getMinPrice(),
                filterRequest.getMaxPrice(),
                filterRequest.getSearchTerm(),
                pageable
        );

        return products.map(this::convertToDto);
    }

    @GetMapping("/{productId}")
    public ProductDto getProductById(@PathVariable Long productId) {
        Product product = productService.getProductById(productId);
        return convertToDto(product);
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