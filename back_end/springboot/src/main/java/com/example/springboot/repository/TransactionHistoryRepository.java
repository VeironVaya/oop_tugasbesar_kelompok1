package com.example.springboot.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.springboot.entity.Customer;
import com.example.springboot.entity.TransactionHistory;

public interface TransactionHistoryRepository extends JpaRepository<TransactionHistory, Long> {
    List<TransactionHistory> findByCustomer(Customer customer);

    List<TransactionHistory> findByCustomer_IdCustomer(Long customerId);
}
