package com.example.springboot.dto.request;

import lombok.Getter;
import lombok.Setter;

/**
 * Used for creating/updating a CartItem (permanent cart entry).
 * idCart refers to an existing Cart.
 * idStock refers to an existing Stock row.
 */
@Getter
@Setter
public class CartItemDto {
    private Long idCart;
    private Long idStock;
    private int itemQuantity;
}
