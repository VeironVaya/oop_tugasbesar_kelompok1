package com.example.springboot.dto.request;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

/**
 * Used for creating/updating a TransactionHistory entry.
 * idCustomer refers to an existing Customer.
 */
@Getter
@Setter
public class TransactionHistoryDto {
    private Long idCustomer;
    private double totalPrice;
    private String paymentStatus;
    private LocalDate date;
}
