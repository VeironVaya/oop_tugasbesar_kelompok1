package com.example.springboot.dto.response;

import lombok.Getter;
import lombok.Setter;

/**
 * Used inside ProductResponseDto, CartItemResponseDto, etc.
 * Contains exactly the fields we want to show for each stock row:
 *  • idStock    (optional if you need to show the PK)
 *  • size
 *  • stockQuantity
 */
@Getter
@Setter
public class StockResponseDto {
    private Long idStock;
    private String size;
    private int stockQuantity;
}
