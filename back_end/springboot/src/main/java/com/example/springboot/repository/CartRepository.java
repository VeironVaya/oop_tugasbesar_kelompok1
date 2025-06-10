package com.example.springboot.repository;

import com.example.springboot.entity.Cart;
import com.example.springboot.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    /**
     * Because you have a one-to-one relationship (Customer ↔ Cart),
     * we can look up a Cart by its Customer.
     */
    Optional<Cart> findByCustomer(Customer customer);
}
