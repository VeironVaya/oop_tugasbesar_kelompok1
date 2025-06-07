package com.example.springboot.dto.response;

import java.time.LocalDate;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

/**
 * When a client GETs a TransactionHistory, we send back:
 *  • idTransactionHistory
 *  • totalPrice
 *  • paymentStatus
 *  • date
 *  • a list of CartItemTempResponseDto (the “temp” items in this transaction)
 */
@Getter
@Setter
public class TransactionHistoryResponseDto {
    private Long idTransactionHistory;
    private double totalPrice;
    private String paymentStatus;
    private LocalDate date;

    /**
     * All temporary cart items associated with this transaction.
     * Each temp item has:
     *   • idCartItemTemp
     *   • totalPrice
     *   • quantity
     *   • nested StockResponseDto
     */
    private List<CartItemTempResponseDto> tempItems;
}
