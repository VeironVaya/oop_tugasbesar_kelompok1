package com.example.springboot.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.springboot.dto.response.CartItemTempResponseDto;
import com.example.springboot.dto.response.StockResponseDto;
import com.example.springboot.dto.response.TransactionResponseDetailDto;
import com.example.springboot.entity.Cart;
import com.example.springboot.entity.CartItem;
import com.example.springboot.entity.CartItemTemp;
import com.example.springboot.entity.Customer;
import com.example.springboot.entity.Stock;
import com.example.springboot.entity.TransactionHistory;
import com.example.springboot.repository.CartItemRepository;
import com.example.springboot.repository.CartItemTempRepository;
import com.example.springboot.repository.CartRepository;
import com.example.springboot.repository.CustomerRepository;
import com.example.springboot.repository.StockRepository;
import com.example.springboot.repository.TransactionHistoryRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
@Transactional
public class TransactionService {

    private final CustomerRepository customerRepo;
    private final CartRepository cartRepo;
    private final CartItemRepository cartItemRepo;
    private final StockRepository stockRepo;
    private final TransactionHistoryRepository txnRepo;
    private final CartItemTempRepository tempRepo;

    public TransactionService(
            CustomerRepository customerRepo,
            CartRepository cartRepo,
            CartItemRepository cartItemRepo,
            StockRepository stockRepo,
            TransactionHistoryRepository txnRepo,
            CartItemTempRepository tempRepo) {
        this.customerRepo = customerRepo;
        this.cartRepo = cartRepo;
        this.cartItemRepo = cartItemRepo;
        this.stockRepo = stockRepo;
        this.txnRepo = txnRepo;
        this.tempRepo = tempRepo;
    }

    public TransactionResponseDetailDto checkout(Long customerId) {
        // 1) Fetch & validate customer + cart
        Customer cust = customerRepo.findById(customerId)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found"));

        Cart cart = cartRepo.findByCustomer(cust)
                .orElseThrow(() -> new IllegalStateException("Cart is empty"));
        List<CartItem> items = cartItemRepo.findByCart(cart);
        if (items.isEmpty()) {
            throw new IllegalStateException("Cart has no items to checkout");
        }

        // 2) Create TransactionHistory
        TransactionHistory txn;
        txn = new TransactionHistory();
        txn.setCustomer(cust);
        txn.setDate(LocalDate.now());
        txn.setPaymentStatus("Unpayed");
        txn.setTotalPrice(0d);
        txn = txnRepo.save(txn);

        double grandTotal = 0;

        // 3) For each CartItem, create a CartItemTemp
        List<CartItemTemp> temps = new ArrayList<>();
        for (var ci : items) {
            Stock stock = stockRepo.findById(ci.getStock().getIdStock())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Stock not found with ID: " + ci.getStock().getIdStock()));

            // Deduct stock
            if (stock.getStock_quantity() < ci.getItem_quantity()) {
                throw new IllegalStateException("Insufficient stock for size " + stock.getSize());
            }
            stock.setStock_quantity(stock.getStock_quantity() - ci.getItem_quantity());

            // Snapshot line‐total
            double lineTotal = ci.getItem_quantity() * stock.getProduct().getPrice();
            grandTotal += lineTotal;

            CartItemTemp temp = new CartItemTemp();
            temp.setTransactionHistory(txn);
            temp.setStock(stock);
            temp.setQuantity(ci.getItem_quantity());
            temp.setTotalPrice(lineTotal);
            temps.add(temp);
        }
        // Persist all temps and update stocks in one go
        stockRepo.saveAll(
                temps.stream().map(CartItemTemp::getStock).collect(Collectors.toList()));
        tempRepo.saveAll(temps);

        // 4) Update txn total
        txn.setTotalPrice(grandTotal);
        txnRepo.save(txn);

        // 5) Clear the cart
        cartItemRepo.deleteAll(items);

        // 6) Build & return DTO
        List<CartItemTempResponseDto> lineDtos = temps.stream()
                .map(temp -> {
                    CartItemTempResponseDto d = new CartItemTempResponseDto();
                    d.setIdCartItemTemp(temp.getIdCartItemTemp());
                    d.setQuantity(temp.getQuantity());
                    d.setTotalPrice(temp.getTotalPrice());

                    StockResponseDto sd = new StockResponseDto();
                    sd.setStatus(true);
                    sd.setMessage("OK");
                    sd.setIdStock(temp.getStock().getIdStock());
                    sd.setSize(temp.getStock().getSize());
                    sd.setStockQuantity(temp.getStock().getStock_quantity());
                    d.setStock(sd);

                    return d;
                })
                .collect(Collectors.toList());

        TransactionResponseDetailDto out = new TransactionResponseDetailDto();
        out.setStatus(true);
        out.setMessage("Checked out successfully");
        out.setIdTransaction(txn.getIdTransactionHistory());
        out.setIdCustomer(customerId);
        out.setTotalPrice(grandTotal);
        out.setPaymentStatus(txn.getPaymentStatus());
        out.setDate(txn.getDate());
        out.setTransactionItems(lineDtos);

        return out;
    }

    private TransactionResponseDetailDto mapToDto(TransactionHistory txn) {
        var temps = tempRepo.findByTransactionHistory(txn);

        List<CartItemTempResponseDto> items = temps.stream().map(temp -> {
            CartItemTempResponseDto d = new CartItemTempResponseDto();
            d.setIdCartItemTemp(temp.getIdCartItemTemp());
            d.setQuantity(temp.getQuantity());
            d.setTotalPrice(temp.getTotalPrice());

            StockResponseDto sd = new StockResponseDto();
            sd.setStatus(true);
            sd.setMessage("OK");
            sd.setIdStock(temp.getStock().getIdStock());
            sd.setSize(temp.getStock().getSize());
            sd.setStockQuantity(temp.getStock().getStock_quantity());
            d.setStock(sd);
            return d;
        }).toList();

        var out = new TransactionResponseDetailDto();
        out.setStatus(true);
        out.setMessage("OK");
        out.setIdTransaction(txn.getIdTransactionHistory());
        out.setIdCustomer(txn.getCustomer().getIdCustomer());
        out.setTotalPrice(txn.getTotalPrice());
        out.setPaymentStatus(txn.getPaymentStatus());
        out.setDate(txn.getDate());
        out.setTransactionItems(items);
        return out;
    }

    // 1) List all for customer
    public List<TransactionResponseDetailDto> getTransactionsByCustomer(Long customerId) {
        Customer cust = customerRepo.findById(customerId)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found"));
        List<TransactionHistory> txns = txnRepo.findByCustomer(cust);
        return txns.stream()
                .map(this::mapToDto)
                .toList();
    }

    // 2) One detail for customer
    public TransactionResponseDetailDto getCustomerTransactionDetail(Long customerId, Long idTransaction) {
        // optional: verify that this txn belongs to this customer
        TransactionHistory txn = txnRepo.findById(idTransaction)
                .orElseThrow(() -> new EntityNotFoundException("Transaction not found"));
        if (!txn.getCustomer().getIdCustomer().equals(customerId)) {
            throw new EntityNotFoundException("Transaction does not belong to customer");
        }
        return mapToDto(txn);
    }

    // 3) Admin: all or by single id
    public List<TransactionResponseDetailDto> getAllTransactions(Long idFilter) {
        List<TransactionHistory> txns = (idFilter != null)
                ? List.of(txnRepo.findById(idFilter)
                        .orElseThrow(() -> new EntityNotFoundException("Transaction not found")))
                : txnRepo.findAll();
        return txns.stream()
                .map(this::mapToDto)
                .toList();
    }

    // 4) Admin: get one
    public TransactionResponseDetailDto getTransactionDetail(Long idTransaction) {
        TransactionHistory txn = txnRepo.findById(idTransaction)
                .orElseThrow(() -> new EntityNotFoundException("Transaction not found"));
        return mapToDto(txn);
    }

    // 5) Admin: patch payment status
    public TransactionResponseDetailDto updatePaymentStatus(Long idTransaction, String paymentStatus) {
        TransactionHistory txn = txnRepo.findById(idTransaction)
                .orElseThrow(() -> new EntityNotFoundException("Transaction not found"));
        txn.setPaymentStatus(paymentStatus);
        txnRepo.save(txn);
        return mapToDto(txn);
    }
}
