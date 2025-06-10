package com.example.springboot.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "cart_item_temp")
@Getter
@Setter
public class CartItemTemp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCartItemTemp;

    // Many temporary cart items belong to one TransactionHistory
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_transaction_history", nullable = false)
    private TransactionHistory transactionHistory;

    // Many temporary cart items refer to one Stock
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_stock", nullable = false)
    private Stock stock;

    private double totalPrice;
    private int quantity;
}
