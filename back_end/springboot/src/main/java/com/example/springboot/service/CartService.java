package com.example.springboot.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.springboot.dto.response.CartItemResponseDto;
import com.example.springboot.dto.response.CartWithCartItemDto;
import com.example.springboot.entity.Cart;
import com.example.springboot.entity.CartItem;
import com.example.springboot.entity.Customer;
import com.example.springboot.entity.Stock;
import com.example.springboot.exception.InvalidDataException;
import com.example.springboot.repository.CartItemRepository;
import com.example.springboot.repository.CartRepository;
import com.example.springboot.repository.CustomerRepository;
import com.example.springboot.repository.StockRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
@Transactional
public class CartService {
    private final CustomerRepository customerRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final StockRepository stockRepository;

    public CartService(CustomerRepository customerRepository,
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            StockRepository stockRepository) {
        this.customerRepository = customerRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.stockRepository = stockRepository;
    }

    public CartWithCartItemDto postProductToCart(Long idCustomer, Long idStock) {
        Customer customer = customerRepository.findById(idCustomer)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found: " + idCustomer));

        Cart cart = cartRepository.findByCustomer(customer)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setCustomer(customer);
                    newCart.setTotal_price(0.0);
                    return cartRepository.save(newCart);
                });

        Stock stock = stockRepository.findById(idStock)
                .orElseThrow(() -> new EntityNotFoundException("Stock not found: " + idStock));

        if (stock.getStock_quantity() <= 0) {
            throw new IllegalStateException("Item is out of stock: " + idStock);
        }

        Optional<CartItem> maybeItem = cartItemRepository.findByCartAndStock(cart, stock);
        if (maybeItem.isPresent()) {
            CartItem existing = maybeItem.get();
            existing.setItem_quantity(existing.getItem_quantity() + 1);
            if (stock.getStock_quantity() < existing.getItem_quantity()) {
                throw new IllegalStateException("Item quantity cannot be larger than stock quantity " + idStock);
            }
            cartItemRepository.save(existing);
        } else {
            CartItem newItem = new CartItem();

            newItem.setItem_quantity(1);

            if (stock.getStock_quantity() < newItem.getItem_quantity()) {
                throw new IllegalStateException("Item quantity cannot be larger than stock quantity " + idStock);
            }
            newItem.setCart(cart);
            newItem.setStock(stock);
            cart.getItems().add(newItem);
            cartItemRepository.save(newItem);
        }

        double sum = 0.0;
        for (CartItem ci : cart.getItems()) {
            double unitPrice = ci.getStock().getProduct().getPrice();
            sum += unitPrice * ci.getItem_quantity();
        }
        cart.setTotal_price(sum);
        cart = cartRepository.save(cart);

        return mapCartToDto(cart);
    }

    private CartWithCartItemDto mapCartToDto(Cart cart) {
        CartWithCartItemDto dto = new CartWithCartItemDto();

        dto.setStatus(true);
        dto.setMessage("item successfully added to cart"); // or “retrieved cart” if using getCartForCustomer
        dto.setIdCart(cart.getIdCart());
        dto.setCartTotalPrice(String.valueOf(cart.getTotal_price()));

        List<CartItemResponseDto> itemDtos = cart.getItems().stream()
                .map(this::mapCartItemToDto)
                .collect(Collectors.toList());
        dto.setItems(itemDtos);

        return dto;
    }

    private CartItemResponseDto mapCartItemToDto(CartItem ci) {
        CartItemResponseDto ciDto = new CartItemResponseDto();
        ciDto.setIdCartItem(ci.getId_cart_item());
        ciDto.setIdStock(ci.getStock().getIdStock());

        // Pull Product fields from ci.getStock().getProduct()
        String name = ci.getStock().getProduct().getName();
        String description = ci.getStock().getProduct().getDescription();
        Double price = ci.getStock().getProduct().getPrice();
        String category = ci.getStock().getProduct().getCategory();
        String urlimage = ci.getStock().getProduct().getUrlimage();

        ciDto.setName(name);
        ciDto.setDescription(description);
        ciDto.setPrice(price);
        ciDto.setCategory(category);
        ciDto.setUrlimage(urlimage);

        // Stock-level fields
        ciDto.setStockQuantity(ci.getStock().getStock_quantity());

        // CartItem-level quantity
        ciDto.setItemQuantity(ci.getItem_quantity());

        return ciDto;
    }

    public CartWithCartItemDto getCartWithItems(Long idCustomer) {
        Customer customer = customerRepository.findById(idCustomer)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found: " + idCustomer));

        Cart cart = cartRepository.findByCustomer(customer)
                .orElseThrow(() -> new EntityNotFoundException("Cart not found for customer ID: " + idCustomer));

        CartWithCartItemDto dto = mapCartToDto(cart);
        dto.setMessage("Cart retrieved successfully");

        return dto;
    }

    public CartWithCartItemDto patchCartItem(Long idCustomer, Long idStock, int newQuantity) {
        // 1) fetch customer
        Customer customer = customerRepository.findById(idCustomer)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found: " + idCustomer));
        // 2) fetch cart
        Cart cart = cartRepository.findByCustomer(customer)
                .orElseThrow(() -> new EntityNotFoundException("Cart not found for customer: " + idCustomer));
        // 3) fetch stock
        Stock stock = stockRepository.findById(idStock)
                .orElseThrow(() -> new EntityNotFoundException("Stock not found: " + idStock));
        // 4) fetch cartItem
        CartItem cartItem = cartItemRepository
                .findByCartAndStock(cart, stock)
                .orElseThrow(() -> new EntityNotFoundException(
                        "CartItem not found for customer " + idCustomer + " and stock " + idStock));

        // 5) validate new quantity
        if (newQuantity <= 0) {
            throw new InvalidDataException("Quantity must be at least 1");
        }
        if (newQuantity > stock.getStock_quantity()) {
            throw new IllegalStateException(
                    "Requested quantity " + newQuantity + " exceeds available stock " + stock.getStock_quantity());
        }

        // 6) update & save
        cartItem.setItem_quantity(newQuantity);
        cartItemRepository.save(cartItem);

        // 7) recalc cart total
        recalcCartTotal(cart);

        // 8) return DTO
        return mapCartToDto(cart);
    }

    /**
     * Remove a specific stock item from the customer's cart entirely.
     */
    public CartWithCartItemDto deleteCartItem(Long idCustomer, Long idStock) {
        // 1) fetch customer
        Customer customer = customerRepository.findById(idCustomer)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found: " + idCustomer));
        // 2) fetch cart
        Cart cart = cartRepository.findByCustomer(customer)
                .orElseThrow(() -> new EntityNotFoundException("Cart not found for customer: " + idCustomer));
        // 3) fetch stock
        Stock stock = stockRepository.findById(idStock)
                .orElseThrow(() -> new EntityNotFoundException("Stock not found: " + idStock));
        // 4) fetch cartItem
        CartItem cartItem = cartItemRepository
                .findByCartAndStock(cart, stock)
                .orElseThrow(() -> new EntityNotFoundException(
                        "CartItem not found for customer " + idCustomer + " and stock " + idStock));

        // 5) remove from cart and delete
        cart.getItems().remove(cartItem);
        cartItemRepository.delete(cartItem);

        // 6) recalc cart total
        recalcCartTotal(cart);

        // 7) return DTO
        return mapCartToDto(cart);
    }

    /**
     * Helper to recalculate and persist the cart's total price.
     */
    private void recalcCartTotal(Cart cart) {
        double sum = cart.getItems().stream()
                .mapToDouble(ci -> ci.getStock().getProduct().getPrice() * ci.getItem_quantity())
                .sum();
        cart.setTotal_price(sum);
        cartRepository.save(cart);
    }

}