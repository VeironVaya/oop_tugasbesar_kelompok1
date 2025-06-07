package com.example.springboot.dto.request;

import lombok.Getter;
import lombok.Setter;

/**
 * Used for creating/updating a Stock row.
 * idProduct refers to the existing Product’s ID.
 */
@Getter
@Setter
public class StockDto {
    private String size;
    private int stockQuantity;
}
