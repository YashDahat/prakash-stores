package com.prakashstores.service;

import com.prakashstores.dto.ProductDto;
import com.prakashstores.exception.ResourceNotFoundException;
import com.prakashstores.model.Brand;
import com.prakashstores.model.Product;
import com.prakashstores.model.ProductCategory;
import com.prakashstores.repository.BrandRepository;
import com.prakashstores.repository.ProductCategoryRepository;
import com.prakashstores.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductCategoryRepository productCategoryRepository;
    private final BrandRepository brandRepository;

    public ProductService(ProductRepository productRepository, ProductCategoryRepository productCategoryRepository, BrandRepository brandRepository) {
        this.productRepository = productRepository;
        this.productCategoryRepository = productCategoryRepository;
        this.brandRepository = brandRepository;
    }

    public Page<ProductDto> getAllProducts(String category, String brand, BigDecimal minPrice, BigDecimal maxPrice, String searchTerm, Pageable pageable) {
        Specification<Product> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (category != null && !category.isEmpty()) {
                ProductCategory productCategory = productCategoryRepository.findByName(category)
                        .orElseThrow(() -> new ResourceNotFoundException("Product category not found: " + category));
                predicates.add(cb.equal(root.get("productCategory").get("id"), productCategory.getId()));
            }
            if (brand != null && !brand.isEmpty()) {
                Brand productBrand = brandRepository.findByName(brand)
                        .orElseThrow(() -> new ResourceNotFoundException("Brand not found: " + brand));
                predicates.add(cb.equal(root.get("brand").get("id"), productBrand.getId()));
            }
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }
            if (searchTerm != null && !searchTerm.isEmpty()) {
                String likePattern = "%" + searchTerm.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), likePattern),
                        cb.like(cb.lower(root.get("description")), likePattern)
                ));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return productRepository.findAll(spec, pageable).map(this::convertToDto);
    }

    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return convertToDto(product);
    }

    public ProductDto createProduct(ProductDto productDto) {
        Product product = new Product();
        mapDtoToEntity(productDto, product);
        Product savedProduct = productRepository.save(product);
        return convertToDto(savedProduct);
    }

    public ProductDto updateProduct(Long id, ProductDto productDto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        mapDtoToEntity(productDto, product);
        product.setId(id); // Ensure the ID is set for update
        Product updatedProduct = productRepository.save(product);
        return convertToDto(updatedProduct);
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    public ProductDto updateProductStock(Long productId, Integer quantityChange) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        int newStock = product.getStock() + quantityChange;
        if (newStock < 0) {
            throw new IllegalArgumentException("Stock cannot be negative for product id: " + productId);
        }
        product.setStock(newStock);
        Product updatedProduct = productRepository.save(product);
        return convertToDto(updatedProduct);
    }

    public List<ProductCategory> getAllCategories() {
        return productCategoryRepository.findAll();
    }

    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }

    private ProductDto convertToDto(Product product) {
        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .imageUrl(product.getImageUrl())
                .stock(product.getStock())
                .brandId(product.getBrand() != null ? product.getBrand().getId() : null)
                .brandName(product.getBrand() != null ? product.getBrand().getName() : null)
                .categoryId(product.getProductCategory() != null ? product.getProductCategory().getId() : null)
                .categoryName(product.getProductCategory() != null ? product.getProductCategory().getName() : null)
                .build();
    }

    private void mapDtoToEntity(ProductDto productDto, Product product) {
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setImageUrl(productDto.getImageUrl());
        product.setStock(productDto.getStock());

        if (productDto.getBrandId() != null) {
            Brand brand = brandRepository.findById(productDto.getBrandId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid Brand ID: " + productDto.getBrandId()));
            product.setBrand(brand);
        } else {
            product.setBrand(null);
        }

        if (productDto.getCategoryId() != null) {
            ProductCategory category = productCategoryRepository.findById(productDto.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid Category ID: " + productDto.getCategoryId()));
            product.setProductCategory(category);
        } else {
            product.setProductCategory(null);
        }
    }
}