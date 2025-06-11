package com.example.springboot.dto.response;

import java.time.LocalDate;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransactionResponseDetailDto {
    private Boolean status;
    private String message;
    private Long idTransaction;
    private Long idCustomer;
    private Double totalPrice;
    private String paymentStatus;
    private LocalDate date;
    private List<CartItemTempResponseDto> transactionItems;
}
