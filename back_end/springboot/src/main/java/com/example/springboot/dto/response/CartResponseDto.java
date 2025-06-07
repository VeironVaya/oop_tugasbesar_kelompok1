package com.example.springboot.dto.response;

import java.util.List;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class CartResponseDto {
    private Long idCart;
    private double totalPrice;

    /**
     * All items in this cart. Each CartItemResponseDto carries:
     *   • idCartItem
     *   • itemQuantity
     *   • a nested StockResponseDto for size + stockQuantity
     */
    private List<CartItemResponseDto> items;
}
