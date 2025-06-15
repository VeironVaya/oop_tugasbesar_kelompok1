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
    private String urlimage;
    private Double price;
    private String category;
    private String size;
    private int stockQuantity;
    private int itemQuantity;
}
