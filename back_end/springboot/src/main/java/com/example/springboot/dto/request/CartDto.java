package com.example.springboot.dto.request;

import lombok.Getter;
import lombok.Setter;

/**
 * Used for creating/updating a Cart.
 * idCustomer refers to an existing Customer.
 */
@Getter
@Setter
public class CartDto {
    private Long idCustomer;
    private double totalPrice;
}
