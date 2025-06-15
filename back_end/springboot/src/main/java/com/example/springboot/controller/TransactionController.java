package com.example.springboot.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.springboot.dto.response.TransactionResponseDetailDto;
import com.example.springboot.exception.InvalidDataException;
import com.example.springboot.service.TransactionService;

import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/api/v1")
public class TransactionController {
    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/customers/{idCustomer}/checkout")
    @PreAuthorize("authentication.principal.idCustomer == #idCustomer")
    public ResponseEntity<TransactionResponseDetailDto> checkout(
            @PathVariable Long idCustomer) {
        try {
            // Delegate to service; it returns a fully populated DTO.
            TransactionResponseDetailDto dto = transactionService.checkout(idCustomer);
            dto.setStatus(true);
            dto.setMessage("Checkout successful");
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(dto);

        } catch (EntityNotFoundException ex) {
            // Customer or Stock not found
            TransactionResponseDetailDto error = new TransactionResponseDetailDto();
            error.setStatus(false);
            error.setMessage("Not found: " + ex.getMessage());
            error.setIdTransaction(null);
            error.setIdCustomer(idCustomer);
            error.setTotalPrice(0.0);
            error.setPaymentStatus("unPayed");
            error.setDate(null);
            error.setTransactionItems(java.util.List.of());
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(error);

        } catch (IllegalStateException ex) {
            // Empty cart or insufficient stock
            TransactionResponseDetailDto error = new TransactionResponseDetailDto();
            error.setStatus(false);
            error.setMessage("Cannot checkout: " + ex.getMessage());
            error.setIdTransaction(null);
            error.setIdCustomer(idCustomer);
            error.setTotalPrice(0.0);
            error.setPaymentStatus("unPayed");
            error.setDate(null);
            error.setTransactionItems(java.util.List.of());
            return ResponseEntity
                    .badRequest()
                    .body(error);

        } catch (InvalidDataException ex) {
            // If you choose to throw a custom exception for validation
            TransactionResponseDetailDto error = new TransactionResponseDetailDto();
            error.setStatus(false);
            error.setMessage("Invalid data: " + ex.getMessage());
            error.setIdTransaction(null);
            error.setIdCustomer(idCustomer);
            error.setTotalPrice(0.0);
            error.setPaymentStatus("unPayed");
            error.setDate(null);
            error.setTransactionItems(java.util.List.of());
            return ResponseEntity
                    .badRequest()
                    .body(error);

        } catch (Exception ex) {
            ex.printStackTrace();
            TransactionResponseDetailDto error = new TransactionResponseDetailDto();
            error.setStatus(false);
            error.setMessage("Unexpected error [" + ex.getClass().getSimpleName() + "]: " + ex.getMessage());
            error.setIdTransaction(null);
            error.setIdCustomer(idCustomer);
            error.setTotalPrice(0.0);
            error.setPaymentStatus("unPayed");
            error.setDate(null);
            error.setTransactionItems(java.util.List.of());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(error);
        }
    }

    @GetMapping("/customers/{idCustomer}/transactions")
    @PreAuthorize("authentication.principal.idCustomer == #idCustomer")
    public ResponseEntity<List<TransactionResponseDetailDto>> getCustomerTransactions(
            @PathVariable Long idCustomer) {
        List<TransactionResponseDetailDto> list = transactionService.getTransactionsByCustomer(idCustomer);
        return ResponseEntity.ok(list);
    }

    // 2) Get one transaction detail for a given customer
    @GetMapping("/customers/{idCustomer}/transactions/{idTransaction}")
    @PreAuthorize("authentication.principal.idCustomer == #idCustomer")
    public ResponseEntity<TransactionResponseDetailDto> getCustomerTransactionDetail(
            @PathVariable Long idCustomer,
            @PathVariable Long idTransaction) {
        TransactionResponseDetailDto dto = transactionService.getCustomerTransactionDetail(idCustomer, idTransaction);
        return ResponseEntity.ok(dto);
    }

    // 3) Admin: list all transactions, or filter by id if provided
    @GetMapping("transactions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TransactionResponseDetailDto>> getAllTransactionOptionalSearchById(
            @RequestParam(required = false) Long id) {
        List<TransactionResponseDetailDto> list = transactionService.getAllTransactions(id);
        return ResponseEntity.ok(list);
    }

    // 4) Admin: get one transaction by its id
    @GetMapping("transactions/{idTransaction}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TransactionResponseDetailDto> getTransactionDetail(
            @PathVariable Long idTransaction) {
        TransactionResponseDetailDto dto = transactionService.getTransactionDetail(idTransaction);
        return ResponseEntity.ok(dto);
    }

    // 5) Admin: patch just the paymentStatus field
    @PatchMapping("transactions/{idTransaction}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TransactionResponseDetailDto> patchTransactionPaymentStatus(
            @PathVariable Long idTransaction,
            @RequestParam String paymentStatus) {
        TransactionResponseDetailDto dto = transactionService.updatePaymentStatus(idTransaction, paymentStatus);
        return ResponseEntity.ok(dto);
    }

}
