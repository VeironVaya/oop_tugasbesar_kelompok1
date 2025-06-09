package com.example.springboot.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.springboot.entity.Stock;

public interface StockRepository extends JpaRepository<Stock, Long> {
     Optional<Stock> findByProduct_IdProductAndSize(Long productId, String size);

     List<Stock> findAllByProduct_IdProduct(Long productId);
}
