package com.example.springboot.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartItemResponseDto {
    private long idCartItem;
    private long idStock;
    private String name;
    private String description;
    private Double price;
    private String category;
    private int stockQuantity;
    private int itemQuantity;
}
