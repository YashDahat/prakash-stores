package com.prakashstores.repository;

import com.prakashstores.model.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {}
