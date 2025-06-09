package com.example.springboot.entity;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "transaction_history")
@Getter
@Setter
public class TransactionHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_transaction_history;

    // Many TransactionHistory entries belong to one Customer
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_customer", nullable = false)
    private Customer customer;

    private double total_price;

    // e.g. "PAID", "PENDING", etc.
    private String payment_status;

    // Date of transaction
    private LocalDate date;

    // One TransactionHistory can have multiple CartItemTemp entries
    @OneToMany(mappedBy = "transactionHistory", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItemTemp> tempItems;
}
