package com.example.springboot.repository;

import com.example.springboot.entity.Cart;
import com.example.springboot.entity.CartItem;
import com.example.springboot.entity.Stock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartAndStock(Cart cart, Stock stock);
}
