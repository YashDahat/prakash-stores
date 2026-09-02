package com.prakashstores.service;

import com.prakashstores.model.Brand;
import com.prakashstores.model.Product;
import com.prakashstores.model.ProductCategory;
import com.prakashstores.repository.BrandRepository;
import com.prakashstores.repository.ProductCategoryRepository;
import com.prakashstores.repository.ProductRepository;
import com.prakashstores.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductCategoryRepository productCategoryRepository;
    private final BrandRepository brandRepository;

    @Autowired
    public ProductService(ProductRepository productRepository,
                          ProductCategoryRepository productCategoryRepository,
                          BrandRepository brandRepository) {
        this.productRepository = productRepository;
        this.productCategoryRepository = productCategoryRepository;
        this.brandRepository = brandRepository;
    }

    public Product createProduct(Product product) {
        if (product.getCategory() != null && product.getCategory().getName() != null) {
            ProductCategory category = productCategoryRepository.findByName(product.getCategory().getName())
                    .orElseThrow(() -> new ResourceNotFoundException("ProductCategory not found with name: " + product.getCategory().getName()));
            product.setCategory(category);
        }

        if (product.getBrand() != null && product.getBrand().getName() != null) {
            Brand brand = brandRepository.findByName(product.getBrand().getName())
                    .orElseThrow(() -> new ResourceNotFoundException("Brand not found with name: " + product.getBrand().getName()));
            product.setBrand(brand);
        }

        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product product) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setImageUrl(product.getImageUrl());
        existingProduct.setStockQuantity(product.getStockQuantity());
        existingProduct.setSize(product.getSize());
        existingProduct.setColor(product.getColor());
        existingProduct.setMaterial(product.getMaterial());
        existingProduct.setGender(product.getGender());
        existingProduct.setActive(product.getActive());

        if (product.getCategory() != null && product.getCategory().getName() != null) {
            ProductCategory category = productCategoryRepository.findByName(product.getCategory().getName())
                    .orElseThrow(() -> new ResourceNotFoundException("ProductCategory not found with name: " + product.getCategory().getName()));
            existingProduct.setCategory(category);
        } else {
            existingProduct.setCategory(null);
        }

        if (product.getBrand() != null && product.getBrand().getName() != null) {
            Brand brand = brandRepository.findByName(product.getBrand().getName())
                    .orElseThrow(() -> new ResourceNotFoundException("Brand not found with name: " + product.getBrand().getName()));
            existingProduct.setBrand(brand);
        } else {
            existingProduct.setBrand(null);
        }

        return productRepository.save(existingProduct);
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    public Page<Product> getAllProducts(String categoryName, String brandName, String gender, String size, String color,
                                        BigDecimal minPrice, BigDecimal maxPrice, String searchTerm, Pageable pageable) {
        return productRepository.searchProducts(searchTerm, categoryName, brandName, gender, size, color, minPrice, maxPrice, pageable);
    }

    public Product updateProductStock(Long productId, int quantityChange) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        int newStock = product.getStockQuantity() + quantityChange;
        if (newStock < 0) {
            throw new IllegalArgumentException("Stock quantity cannot be negative for product id: " + productId);
        }
        product.setStockQuantity(newStock);
        return productRepository.save(product);
    }

    public List<Product> getProductsByIds(List<Long> productIds) {
        return productRepository.findAllByIdIn(productIds);
    }

    public List<ProductCategory> getAllProductCategories() {
        return productCategoryRepository.findAll();
    }

    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }
}