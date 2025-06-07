package com.example.springboot.dto.request;

import lombok.Getter;
import lombok.Setter;

/**
 * Used for creating/updating a CartItemTemp (temporary cart item).
 * idTransactionHistory refers to an existing TransactionHistory.
 * idStock refers to an existing Stock row.
 */
@Getter
@Setter
public class CartItemTempDto {
    private Long idTransactionHistory;
    private Long idStock;
    private double totalPrice;
    private int quantity;
}
