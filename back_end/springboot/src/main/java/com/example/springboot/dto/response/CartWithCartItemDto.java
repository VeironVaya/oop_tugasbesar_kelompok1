package com.example.springboot.dto.response;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartWithCartItemDto {
    private Boolean status;
    private String message;
    private Long idCart;
    private String cartTotalPrice;
    private List<CartItemResponseDto> items;
}
