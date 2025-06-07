package com.example.springboot.dto.response;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class CartItemResponseDto {
    private Long idCartItem;
    private int itemQuantity;

    /** We embed one StockResponseDto (size + stockQuantity). */
    private StockResponseDto stock;
}
