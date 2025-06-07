package com.example.springboot.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.springboot.entity.Stock;

public interface StockRepository extends JpaRepository<Stock, Long> {
    // No extra methods needed for now
}
