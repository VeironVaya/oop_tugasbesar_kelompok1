package com.example.springboot.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.springboot.entity.CartItemTemp;
import com.example.springboot.entity.TransactionHistory;

public interface CartItemTempRepository extends JpaRepository<CartItemTemp, Long> {
    List<CartItemTemp> findByTransactionHistory(TransactionHistory transactionHistory);
}
