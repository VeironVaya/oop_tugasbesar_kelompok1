package com.example.springboot.dto.response;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class CartItemTempResponseDto {
    private Long idCartItemTemp;
    private double totalPrice;
    private int quantity;

    /** We embed one StockResponseDto (size + stockQuantity). */
    private StockResponseDto stock;
}
