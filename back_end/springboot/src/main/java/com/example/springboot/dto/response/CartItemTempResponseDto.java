package com.example.springboot.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartItemTempResponseDto {
    private Long idCartItemTemp;
    private String urlimage;
    private String name;
    private String description;
    private String category;
    private String size;
    private double totalPrice;
    private int quantity;
}
