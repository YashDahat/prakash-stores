package com.prakashstores.service;

import com.prakashstores.dto.BulkUploadResult;
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
import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductCategoryRepository productCategoryRepository;
    private final BrandRepository brandRepository;
    private final SpreadsheetParser spreadsheetParser;

    public ProductService(ProductRepository productRepository, ProductCategoryRepository productCategoryRepository, BrandRepository brandRepository, SpreadsheetParser spreadsheetParser) {
        this.productRepository = productRepository;
        this.productCategoryRepository = productCategoryRepository;
        this.brandRepository = brandRepository;
        this.spreadsheetParser = spreadsheetParser;
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

    // ── Bulk import (Excel/CSV) ─────────────────────────────────────────────

    /** Import products. Columns: name*, price*, description, stock, imageUrl, brand, category.
     *  Brand/category are matched by name and auto-created if missing; rows whose name already
     *  exists are skipped. */
    public BulkUploadResult bulkImportProducts(MultipartFile file) {
        List<Map<String, String>> rows = spreadsheetParser.parse(file);
        BulkUploadResult result = BulkUploadResult.builder().build();
        int rowNum = 1; // header is row 1
        for (Map<String, String> row : rows) {
            rowNum++;
            try {
                String name = value(row, "name");
                if (name.isEmpty()) { result.addError(rowNum, "Missing required column 'name'"); continue; }
                if (productRepository.findFirstByNameIgnoreCase(name).isPresent()) { result.setSkipped(result.getSkipped() + 1); continue; }

                String priceStr = value(row, "price");
                if (priceStr.isEmpty()) { result.addError(rowNum, "Missing required column 'price'"); continue; }
                BigDecimal price;
                try { price = new BigDecimal(priceStr); } catch (NumberFormatException e) { result.addError(rowNum, "Invalid price: '" + priceStr + "'"); continue; }

                int stock = 0;
                String stockStr = value(row, "stock");
                if (!stockStr.isEmpty()) {
                    try { stock = Integer.parseInt(stockStr.replaceAll("\\.0+$", "")); } catch (NumberFormatException e) { result.addError(rowNum, "Invalid stock: '" + stockStr + "'"); continue; }
                }

                Product product = new Product();
                product.setName(name);
                product.setDescription(value(row, "description"));
                product.setPrice(price);
                product.setImageUrl(value(row, "imageurl"));
                product.setStock(stock);

                String brandName = value(row, "brand");
                if (!brandName.isEmpty()) {
                    Brand brand = brandRepository.findByNameIgnoreCase(brandName)
                            .orElseGet(() -> { Brand b = new Brand(); b.setName(brandName); return brandRepository.save(b); });
                    product.setBrand(brand);
                }
                String categoryName = value(row, "category");
                if (!categoryName.isEmpty()) {
                    ProductCategory category = productCategoryRepository.findByNameIgnoreCase(categoryName)
                            .orElseGet(() -> { ProductCategory c = new ProductCategory(); c.setName(categoryName); return productCategoryRepository.save(c); });
                    product.setProductCategory(category);
                }

                productRepository.save(product);
                result.setCreated(result.getCreated() + 1);
            } catch (Exception e) {
                result.addError(rowNum, e.getMessage() == null ? "Unexpected error" : e.getMessage());
            }
        }
        return result;
    }

    /** Import categories. Column: name*. Existing names are skipped. */
    public BulkUploadResult bulkImportCategories(MultipartFile file) {
        List<Map<String, String>> rows = spreadsheetParser.parse(file);
        BulkUploadResult result = BulkUploadResult.builder().build();
        int rowNum = 1;
        for (Map<String, String> row : rows) {
            rowNum++;
            String name = value(row, "name");
            if (name.isEmpty()) { result.addError(rowNum, "Missing required column 'name'"); continue; }
            if (productCategoryRepository.findByNameIgnoreCase(name).isPresent()) { result.setSkipped(result.getSkipped() + 1); continue; }
            ProductCategory category = new ProductCategory();
            category.setName(name);
            productCategoryRepository.save(category);
            result.setCreated(result.getCreated() + 1);
        }
        return result;
    }

    /** Import brands. Column: name*. Existing names are skipped. */
    public BulkUploadResult bulkImportBrands(MultipartFile file) {
        List<Map<String, String>> rows = spreadsheetParser.parse(file);
        BulkUploadResult result = BulkUploadResult.builder().build();
        int rowNum = 1;
        for (Map<String, String> row : rows) {
            rowNum++;
            String name = value(row, "name");
            if (name.isEmpty()) { result.addError(rowNum, "Missing required column 'name'"); continue; }
            if (brandRepository.findByNameIgnoreCase(name).isPresent()) { result.setSkipped(result.getSkipped() + 1); continue; }
            Brand brand = new Brand();
            brand.setName(name);
            brandRepository.save(brand);
            result.setCreated(result.getCreated() + 1);
        }
        return result;
    }

    private static String value(Map<String, String> row, String key) {
        String v = row.get(key);
        return v == null ? "" : v.trim();
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