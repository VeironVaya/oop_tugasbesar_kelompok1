package com.example.springboot.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.springboot.entity.Cart;
import com.example.springboot.entity.CartItem;
import com.example.springboot.entity.Stock;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartAndStock(Cart cart, Stock stock);

    List<CartItem> findByCart(Cart cart);
}
