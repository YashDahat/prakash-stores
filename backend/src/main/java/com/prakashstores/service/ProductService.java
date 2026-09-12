package com.prakashstores.service;

import com.prakashstores.dto.BrandDto;
import com.prakashstores.dto.ProductCategoryDto;
import com.prakashstores.dto.ProductDto;
import com.prakashstores.dto.ProductFilterRequest;
import com.prakashstores.exception.ResourceNotFoundException;
import com.prakashstores.model.Brand;
import com.prakashstores.model.Product;
import com.prakashstores.model.ProductCategory;
import com.prakashstores.repository.BrandRepository;
import com.prakashstores.repository.ProductCategoryRepository;
import com.prakashstores.repository.ProductRepository;
import org.springframework.stereotype.Service;

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

    public ProductService(ProductRepository productRepository,
                          ProductCategoryRepository productCategoryRepository,
                          BrandRepository brandRepository) {
        this.productRepository = productRepository;
        this.productCategoryRepository = productCategoryRepository;
        this.brandRepository = brandRepository;
    }

    // Product methods
    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToProductDto)
                .collect(Collectors.toList());
    }

    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return mapToProductDto(product);
    }

    public List<ProductDto> searchProducts(ProductFilterRequest filterRequest) {
        List<Product> products = new ArrayList<>();

        if (filterRequest.getSearchTerm() != null && !filterRequest.getSearchTerm().isEmpty()) {
            products = productRepository.findByNameContainingIgnoreCase(filterRequest.getSearchTerm());
        } else {
            products = productRepository.findAll();
        }

        if (filterRequest.getCategoryId() != null) {
            products = products.stream()
                    .filter(p -> p.getCategory() != null && p.getCategory().getId().equals(filterRequest.getCategoryId()))
                    .collect(Collectors.toList());
        }

        if (filterRequest.getBrandId() != null) {
            products = products.stream()
                    .filter(p -> p.getBrand() != null && p.getBrand().getId().equals(filterRequest.getBrandId()))
                    .collect(Collectors.toList());
        }

        if (filterRequest.getMinPrice() != null && filterRequest.getMaxPrice() != null) {
            products = products.stream()
                    .filter(p -> p.getPrice().compareTo(filterRequest.getMinPrice()) >= 0 &&
                            p.getPrice().compareTo(filterRequest.getMaxPrice()) <= 0)
                    .collect(Collectors.toList());
        } else if (filterRequest.getMinPrice() != null) {
            products = products.stream()
                    .filter(p -> p.getPrice().compareTo(filterRequest.getMinPrice()) >= 0)
                    .collect(Collectors.toList());
        } else if (filterRequest.getMaxPrice() != null) {
            products = products.stream()
                    .filter(p -> p.getPrice().compareTo(filterRequest.getMaxPrice()) <= 0)
                    .collect(Collectors.toList());
        }

        return products.stream()
                .map(this::mapToProductDto)
                .collect(Collectors.toList());
    }

    public ProductDto createProduct(ProductDto productDto) {
        Product product = new Product();
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setStock(productDto.getStock());
        product.setImageUrl(productDto.getImageUrl());

        if (productDto.getCategoryId() != null) {
            ProductCategory category = productCategoryRepository.findById(productDto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + productDto.getCategoryId()));
            product.setCategory(category);
        }

        if (productDto.getBrandId() != null) {
            Brand brand = brandRepository.findById(productDto.getBrandId())
                    .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + productDto.getBrandId()));
            product.setBrand(brand);
        }

        Product savedProduct = productRepository.save(product);
        return mapToProductDto(savedProduct);
    }

    public ProductDto updateProduct(Long id, ProductDto productDto) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        existingProduct.setName(productDto.getName());
        existingProduct.setDescription(productDto.getDescription());
        existingProduct.setPrice(productDto.getPrice());
        existingProduct.setStock(productDto.getStock());
        existingProduct.setImageUrl(productDto.getImageUrl());

        if (productDto.getCategoryId() != null) {
            ProductCategory category = productCategoryRepository.findById(productDto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + productDto.getCategoryId()));
            existingProduct.setCategory(category);
        } else {
            existingProduct.setCategory(null);
        }

        if (productDto.getBrandId() != null) {
            Brand brand = brandRepository.findById(productDto.getBrandId())
                    .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + productDto.getBrandId()));
            existingProduct.setBrand(brand);
        } else {
            existingProduct.setBrand(null);
        }

        Product updatedProduct = productRepository.save(existingProduct);
        return mapToProductDto(updatedProduct);
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    // Category methods
    public List<ProductCategoryDto> getAllCategories() {
        return productCategoryRepository.findAll().stream()
                .map(this::mapToProductCategoryDto)
                .collect(Collectors.toList());
    }

    public ProductCategoryDto getCategoryById(Long id) {
        ProductCategory category = productCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return mapToProductCategoryDto(category);
    }

    public ProductCategoryDto createCategory(ProductCategoryDto categoryDto) {
        ProductCategory category = new ProductCategory();
        category.setName(categoryDto.getName());
        category.setDescription(categoryDto.getDescription());
        ProductCategory savedCategory = productCategoryRepository.save(category);
        return mapToProductCategoryDto(savedCategory);
    }

    public ProductCategoryDto updateCategory(Long id, ProductCategoryDto categoryDto) {
        ProductCategory existingCategory = productCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        existingCategory.setName(categoryDto.getName());
        existingCategory.setDescription(categoryDto.getDescription());
        ProductCategory updatedCategory = productCategoryRepository.save(existingCategory);
        return mapToProductCategoryDto(updatedCategory);
    }

    public void deleteCategory(Long id) {
        if (!productCategoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
        productCategoryRepository.deleteById(id);
    }

    // Brand methods
    public List<BrandDto> getAllBrands() {
        return brandRepository.findAll().stream()
                .map(this::mapToBrandDto)
                .collect(Collectors.toList());
    }

    public BrandDto getBrandById(Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + id));
        return mapToBrandDto(brand);
    }

    public BrandDto createBrand(BrandDto brandDto) {
        Brand brand = new Brand();
        brand.setName(brandDto.getName());
        brand.setDescription(brandDto.getDescription());
        Brand savedBrand = brandRepository.save(brand);
        return mapToBrandDto(savedBrand);
    }

    public BrandDto updateBrand(Long id, BrandDto brandDto) {
        Brand existingBrand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + id));

        existingBrand.setName(brandDto.getName());
        existingBrand.setDescription(brandDto.getDescription());
        Brand updatedBrand = brandRepository.save(existingBrand);
        return mapToBrandDto(updatedBrand);
    }

    public void deleteBrand(Long id) {
        if (!brandRepository.existsById(id)) {
            throw new ResourceNotFoundException("Brand not found with id: " + id);
        }
        brandRepository.deleteById(id);
    }

    // Mappers
    private ProductDto mapToProductDto(Product product) {
        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .imageUrl(product.getImageUrl())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .brandId(product.getBrand() != null ? product.getBrand().getId() : null)
                .build();
    }

    private ProductCategoryDto mapToProductCategoryDto(ProductCategory category) {
        return ProductCategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .build();
    }

    private BrandDto mapToBrandDto(Brand brand) {
        return BrandDto.builder()
                .id(brand.getId())
                .name(brand.getName())
                .description(brand.getDescription())
                .build();
    }
}