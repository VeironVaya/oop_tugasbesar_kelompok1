package com.example.springboot.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.springboot.dto.request.CartItemDto;
import com.example.springboot.dto.response.CartWithCartItemDto;
import com.example.springboot.exception.InvalidDataException;
import com.example.springboot.service.CartService;

import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/api/v1/customers")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/{idCustomer}/carts/stocks/{idStock}")
    @PreAuthorize("authentication.principal.idCustomer == #idCustomer")
    public ResponseEntity<CartWithCartItemDto> postProductToCart(
            @PathVariable Long idCustomer,
            @PathVariable Long idStock) {

        try {
            // Delegate to service; it returns a fully populated CartWithCartItemDto.
            CartWithCartItemDto dto = cartService.postProductToCart(idCustomer, idStock);

            // We assume service already set status=true and a “success” message.
            // But if you want to override:
            dto.setStatus(true);
            dto.setMessage("Product added to cart successfully");

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(dto);

        } catch (EntityNotFoundException ex) {
            // Thrown if Customer or Stock wasn’t found
            CartWithCartItemDto error = new CartWithCartItemDto();
            error.setStatus(false);
            error.setMessage("Not found: " + ex.getMessage());
            error.setIdCart(null);
            error.setCartTotalPrice("0.0");
            error.setItems(java.util.List.of());
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(error);

        } catch (InvalidDataException ex) {
            // If your service throws a custom InvalidDataException
            CartWithCartItemDto error = new CartWithCartItemDto();
            error.setStatus(false);
            error.setMessage("Invalid data: " + ex.getMessage());
            error.setIdCart(null);
            error.setCartTotalPrice("0.0");
            error.setItems(java.util.List.of());
            return ResponseEntity
                    .badRequest()
                    .body(error);

        } catch (IllegalStateException ex) {
            // If stock is out of quantity
            CartWithCartItemDto error = new CartWithCartItemDto();
            error.setStatus(false);
            error.setMessage("Cannot add to cart: " + ex.getMessage());
            error.setIdCart(null);
            error.setCartTotalPrice("0.0");
            error.setItems(java.util.List.of());
            return ResponseEntity
                    .badRequest()
                    .body(error);

        } catch (Exception ex) {
            // Fallback for any other errors
            CartWithCartItemDto error = new CartWithCartItemDto();
            ex.printStackTrace();
            error.setStatus(false);
            error.setMessage(
                    "Unexpected error [" + ex.getClass().getSimpleName() + "]: " + ex.getMessage());
            error.setIdCart(null);
            error.setCartTotalPrice("0.0");
            error.setItems(java.util.List.of());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(error);
        }
    }

    @GetMapping("/{idCustomer}/carts")
    @PreAuthorize("authentication.principal.idCustomer == #idCustomer")
    public ResponseEntity<CartWithCartItemDto> getCartWithItems(@PathVariable Long idCustomer) {
        try {
            CartWithCartItemDto dto = cartService.getCartWithItems(idCustomer); // Only one cart per customer
            dto.setStatus(true);
            dto.setMessage("Cart retrieved successfully");
            return ResponseEntity.ok(dto);

        } catch (EntityNotFoundException ex) {
            CartWithCartItemDto error = new CartWithCartItemDto();
            error.setStatus(false);
            error.setMessage("Not found: " + ex.getMessage());
            error.setIdCart(null);
            error.setCartTotalPrice("0.0");
            error.setItems(java.util.List.of());
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(error);

        } catch (Exception ex) {
            ex.printStackTrace();
            CartWithCartItemDto error = new CartWithCartItemDto();
            error.setStatus(false);
            error.setMessage("Unexpected error [" + ex.getClass().getSimpleName() + "]: " + ex.getMessage());
            error.setIdCart(null);
            error.setCartTotalPrice("0.0");
            error.setItems(java.util.List.of());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(error);
        }
    }

    // when user tap the '+' or '-' icon in cart on spesific cart item it will
    // update the cart item quantity (stock)
    @PatchMapping("/{idCustomer}/carts/stocks/{idStock}")
    @PreAuthorize("authentication.principal.idCustomer == #idCustomer")
    public ResponseEntity<CartWithCartItemDto> patchCartItem(
            @PathVariable Long idCustomer,
            @PathVariable Long idStock,
            @RequestBody CartItemDto updateDto // carry the new quantity
    ) {
        try {
            CartWithCartItemDto dto = cartService.patchCartItem(
                    idCustomer,
                    idStock,
                    updateDto.getItemQuantity());
            dto.setStatus(true);
            dto.setMessage("Cart item updated successfully");
            return ResponseEntity.ok(dto);

        } catch (EntityNotFoundException ex) {
            CartWithCartItemDto error = new CartWithCartItemDto();
            error.setStatus(false);
            error.setMessage("Not found: " + ex.getMessage());
            error.setIdCart(null);
            error.setCartTotalPrice("0.0");
            error.setItems(List.of());
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(error);

        } catch (InvalidDataException | IllegalStateException ex) {
            CartWithCartItemDto error = new CartWithCartItemDto();
            error.setStatus(false);
            error.setMessage("Cannot update item: " + ex.getMessage());
            error.setIdCart(null);
            error.setCartTotalPrice("0.0");
            error.setItems(List.of());
            return ResponseEntity
                    .badRequest()
                    .body(error);

        } catch (Exception ex) {
            CartWithCartItemDto error = new CartWithCartItemDto();
            error.setStatus(false);
            error.setMessage("Unexpected error: " + ex.getMessage());
            error.setIdCart(null);
            error.setCartTotalPrice("0.0");
            error.setItems(List.of());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(error);
        }
    }

    // when the item quantity (stock) is 0 the item cart will be deleted
    @DeleteMapping("/{idCustomer}/carts/stocks/{idStock}")
    @PreAuthorize("authentication.principal.idCustomer == #idCustomer")
    public ResponseEntity<CartWithCartItemDto> deleteCartItem(
            @PathVariable Long idCustomer,
            @PathVariable Long idStock) {
        try {
            CartWithCartItemDto dto = cartService.deleteCartItem(
                    idCustomer,
                    idStock);
            dto.setStatus(true);
            dto.setMessage("Cart item removed successfully");
            return ResponseEntity.ok(dto);

        } catch (EntityNotFoundException ex) {
            CartWithCartItemDto error = new CartWithCartItemDto();
            error.setStatus(false);
            error.setMessage("Not found: " + ex.getMessage());
            error.setIdCart(null);
            error.setCartTotalPrice("0.0");
            error.setItems(List.of());
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(error);

        } catch (Exception ex) {
            CartWithCartItemDto error = new CartWithCartItemDto();
            error.setStatus(false);
            error.setMessage("Unexpected error: " + ex.getMessage());
            error.setIdCart(null);
            error.setCartTotalPrice("0.0");
            error.setItems(List.of());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(error);
        }
    }

}
