package com.example.springboot.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.springboot.dto.response.ProductWithCustomerResponseDto;
import com.example.springboot.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryIgnoreCase(String category);

    List<Product> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);

    @Query(value = """
                SELECT
                    p.id_product AS idProduct,
                    p.name AS name,
                    p.description AS description,
                    p.price AS price,
                    p.category AS category,
                    s.size AS size,
                    s.stock_quantity AS stockQuantity,
                    CASE WHEN fp.id_favorite_product IS NOT NULL THEN true ELSE false END AS isFavorite
                FROM product p
                JOIN stock s ON s.id_product = p.id_product
                LEFT JOIN favorite_product fp
                    ON fp.id_product = p.id_product
                    AND fp.id_customer = :customerId
                WHERE p.id_product = :productId
                LIMIT 1
            """, nativeQuery = true)
    Optional<ProductWithCustomerResponseDto> findDetailWithFavorite(
            @Param("productId") Long productId,
            @Param("customerId") Long customerId);
}
