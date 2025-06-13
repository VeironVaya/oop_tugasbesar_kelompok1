package com.example.springboot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.springboot.entity.FavoriteProduct;

@Repository
public interface FavoriteProductRepository extends JpaRepository<FavoriteProduct, Long> {
    boolean existsByProduct_IdProductAndCustomer_IdCustomer(Long productId, Long customerId);

    void deleteByProduct_IdProductAndCustomer_IdCustomer(Long productId, Long customerId);

}
