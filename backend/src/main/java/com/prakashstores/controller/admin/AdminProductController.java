package com.prakashstores.controller.admin;

import com.prakashstores.dto.BulkUploadResult;
import com.prakashstores.dto.ProductDto;
import com.prakashstores.exception.ResourceNotFoundException;
import com.prakashstores.model.Brand;
import com.prakashstores.model.ProductCategory;
import com.prakashstores.repository.BrandRepository;
import com.prakashstores.repository.ProductCategoryRepository;
import com.prakashstores.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import com.prakashstores.model.Product;

@RestController
@RequestMapping("/api/v1/admin/products")
public class AdminProductController {

    private final ProductService productService;
    private final ProductCategoryRepository productCategoryRepository;
    private final BrandRepository brandRepository;

    public AdminProductController(ProductService productService, ProductCategoryRepository productCategoryRepository, BrandRepository brandRepository) {
        this.productService = productService;
        this.productCategoryRepository = productCategoryRepository;
        this.brandRepository = brandRepository;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductDto createProduct(@RequestBody ProductDto productDto) {
        return productService.createProduct(productDto);
    }

    @PostMapping("/bulk-upload")
    public BulkUploadResult bulkUploadProducts(@RequestParam("file") MultipartFile file) {
        return productService.bulkImportProducts(file);
    }

    @PostMapping("/categories/bulk-upload")
    public BulkUploadResult bulkUploadCategories(@RequestParam("file") MultipartFile file) {
        return productService.bulkImportCategories(file);
    }

    @PostMapping("/brands/bulk-upload")
    public BulkUploadResult bulkUploadBrands(@RequestParam("file") MultipartFile file) {
        return productService.bulkImportBrands(file);
    }

    @PutMapping("/{id}")
    public ProductDto updateProduct(@PathVariable Long id, @RequestBody ProductDto productDto) {
        return productService.updateProduct(id, productDto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }

    @PutMapping("/{id}/stock")
    public ProductDto updateProductStock(@PathVariable Long id, @RequestBody Map<String, Integer> requestBody) {
        Integer quantityChange = requestBody.get("quantityChange");
        if (quantityChange == null) {
            throw new IllegalArgumentException("Request body must contain 'quantityChange'");
        }
        return productService.updateProductStock(id, quantityChange);
    }

    @GetMapping
    public Page<ProductDto> getAllProducts(Pageable pageable) {
        return productService.getAllProducts(null, null, null, null, null, pageable);
    }

    @GetMapping("/{id}")
    public ProductDto getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @GetMapping("/categories")
    public List<ProductCategory> getAllCategories() {
        return productService.getAllCategories();
    }

    @PostMapping("/categories")
    @ResponseStatus(HttpStatus.CREATED)
    public ProductCategory createCategory(@RequestBody ProductCategory category) {
        return productCategoryRepository.save(category);
    }

    @PutMapping("/categories/{id}")
    public ProductCategory updateCategory(@PathVariable Long id, @RequestBody ProductCategory category) {
        return productCategoryRepository.findById(id)
                .map(existingCategory -> {
                    existingCategory.setName(category.getName());
                    return productCategoryRepository.save(existingCategory);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Product category not found with id: " + id));
    }

    @DeleteMapping("/categories/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategory(@PathVariable Long id) {
        if (!productCategoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product category not found with id: " + id);
        }
        productCategoryRepository.deleteById(id);
    }

    @GetMapping("/brands")
    public List<Brand> getAllBrands() {
        return productService.getAllBrands();
    }

    @PostMapping("/brands")
    @ResponseStatus(HttpStatus.CREATED)
    public Brand createBrand(@RequestBody Brand brand) {
        return brandRepository.save(brand);
    }

    @PutMapping("/brands/{id}")
    public Brand updateBrand(@PathVariable Long id, @RequestBody Brand brand) {
        return brandRepository.findById(id)
                .map(existingBrand -> {
                    existingBrand.setName(brand.getName());
                    return brandRepository.save(existingBrand);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + id));
    }

    @DeleteMapping("/brands/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBrand(@PathVariable Long id) {
        if (!brandRepository.existsById(id)) {
            throw new ResourceNotFoundException("Brand not found with id: " + id);
        }
        brandRepository.deleteById(id);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<String> handleResourceNotFoundException(ResourceNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
}