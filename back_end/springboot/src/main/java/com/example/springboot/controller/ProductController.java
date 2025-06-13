package com.example.springboot.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.springboot.dto.request.ProductRequestDto;
import com.example.springboot.dto.request.ProductWithStockRequestDto;
import com.example.springboot.dto.request.StockRequestDto;
import com.example.springboot.dto.response.AddRemoveFavoriteResponseDto;
import com.example.springboot.dto.response.ProductResponseDto;
import com.example.springboot.dto.response.ProductWithCustomerResponseDto;
import com.example.springboot.dto.response.ProductWithStockResponseDto;
import com.example.springboot.dto.response.SimpleResponseDto;
import com.example.springboot.dto.response.StockResponseDto;
import com.example.springboot.exception.DuplicateFavoriteException;
import com.example.springboot.exception.InvalidDataException;
import com.example.springboot.exception.ResourceNotFoundException;
import com.example.springboot.service.FavoriteProductService;
import com.example.springboot.service.ProductService;
import com.example.springboot.service.StockService;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService productService;
    private final StockService stockService;
    private final FavoriteProductService favoriteProductService;

    public ProductController(ProductService productService, StockService stockService,
            FavoriteProductService favoriteProductService) {
        this.productService = productService;
        this.stockService = stockService;
        this.favoriteProductService = favoriteProductService;
    }

    @PostMapping
    public ResponseEntity<?> postProductWithStock(
            @RequestBody ProductWithStockRequestDto dto) {
        try {
            ProductWithStockResponseDto saved = productService.postProductWithStockResponseDto(dto);
            saved.setStatus("true");
            saved.setMessage("Product created successfully");
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(saved);

        } catch (InvalidDataException ex) {
            ProductWithStockResponseDto error = new ProductWithStockResponseDto();
            error.setStatus("false");
            error.setMessage("Invalid product data: " + ex.getMessage());
            return ResponseEntity
                    .badRequest()
                    .body(error);

        } catch (Exception ex) {
            ProductWithStockResponseDto error = new ProductWithStockResponseDto();
            error.setStatus("false");
            error.setMessage("An unexpected error occurred");
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(error);
        }
    }

    @PostMapping("/{productId}/stocks")
    public ResponseEntity<?> postStockToProduct(
            @PathVariable Long productId,
            @RequestBody StockRequestDto dto) {

        try {
            StockResponseDto saved = stockService.postStockToProduct(productId, dto);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(saved);

        } catch (InvalidDataException ex) {
            ProductWithStockResponseDto error = new ProductWithStockResponseDto();
            error.setStatus("false");
            error.setMessage("Invalid stock data: " + ex.getMessage());
            return ResponseEntity
                    .badRequest()
                    .body(error);

        }

    }

    @GetMapping
    public ResponseEntity<List<ProductResponseDto>> getAllProducts(
            @RequestParam(required = false) String category) {

        List<ProductResponseDto> products;
        if (category != null && !category.isEmpty()) {
            products = productService.getProductsByCategory(category);
        } else {
            products = productService.getAllProducts();
        }
        return ResponseEntity.ok(products);
    }

    @DeleteMapping("/{idProduct}")
    public ResponseEntity<?> deleteProduct(@PathVariable("idProduct") Long idProduct) {
        try {
            productService.deleteProduct(idProduct);
            SimpleResponseDto response = new SimpleResponseDto();
            response.setStatus(true);
            response.setMessage("Product deleted successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            SimpleResponseDto response = new SimpleResponseDto();
            response.setStatus(false);
            response.setMessage("Deletion failed: " + ex.getMessage());

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(response);
        } catch (Exception ex) {
            ProductWithStockResponseDto error = new ProductWithStockResponseDto();
            error.setStatus("false");
            error.setMessage("An unexpected error occurred");
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(error);
        }
    }

    @PatchMapping("/{idProduct}")
    public ResponseEntity<?> patchProduct(
            @PathVariable("idProduct") Long id,
            @RequestBody ProductRequestDto dto) {
        try {
            ProductWithStockResponseDto updated = productService.patchProductWithStock(id, dto);
            updated.setIdProduct(id);
            updated.setMessage("Product updated successfully");
            updated.setStatus("true");
            return ResponseEntity.ok(updated);
        } catch (InvalidDataException ex) {
            ProductWithStockResponseDto response = new ProductWithStockResponseDto();
            response.setStatus("false");
            response.setMessage("Invalid product data: " + ex.getMessage());
            return ResponseEntity
                    .badRequest()
                    .body(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal Server Error: " + e.getMessage());
        }
    }

    // another
    @GetMapping("/{id_product}")
    public ResponseEntity<?> getProductDetail(@PathVariable("id_product") long id) {

        try {
            ProductWithStockResponseDto product = productService.getProductWithStockResponseDto(id);
            return ResponseEntity.ok(product);
        } catch (IllegalArgumentException ex) {
            ProductWithStockResponseDto response = new ProductWithStockResponseDto();
            response.setStatus("false");
            response.setMessage("Get failed: " + ex.getMessage());
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(response);
        }

    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductResponseDto>> getSearchProduct(@RequestParam(required = false) String keyword) {
        List<ProductResponseDto> products = productService.getProductsByKeyword(keyword);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id_product}/customer/{id_customer}")
    public ResponseEntity<ProductWithCustomerResponseDto> getProductDetailWstatus(
            @PathVariable("id_product") Long productId,
            @PathVariable("id_customer") Long customerId) {

        try {
            // 1) fetch your full DTO (without status/message yet)
            ProductWithCustomerResponseDto dto = productService.getProductDetailWstatus(productId, customerId);

            // 2) annotate it with a success status/message
            dto.setStatus("true");
            dto.setMessage("Product loaded successfully");
            return ResponseEntity.ok(dto);

        } catch (ResourceNotFoundException ex) {
            // 404: either product or customer not found
            ProductWithCustomerResponseDto err = new ProductWithCustomerResponseDto();
            err.setStatus("false");
            err.setMessage(ex.getMessage());
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(err);

        } catch (Exception ex) {
            // 500: anything else
            ProductWithCustomerResponseDto err = new ProductWithCustomerResponseDto();
            err.setStatus("false");
            err.setMessage("Unexpected error: " + ex.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(err);
        }
    }

    @PostMapping("/{productId}/customer/{customerId}/favorites")
    public ResponseEntity<AddRemoveFavoriteResponseDto> postFavorite(
            @PathVariable Long productId,
            @PathVariable Long customerId) {
        try {
            AddRemoveFavoriteResponseDto response = favoriteProductService.addFavorite(productId, customerId);
            return ResponseEntity.ok(response);
        } catch (DuplicateFavoriteException ex) {
            AddRemoveFavoriteResponseDto dto = new AddRemoveFavoriteResponseDto();
            dto.setStatus(false);
            dto.setMessage(ex.getMessage());
            dto.setFavorite(true);
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(dto);
        }
    }

    @DeleteMapping("/{productId}/customer/{customerId}/favorites")
    public ResponseEntity<AddRemoveFavoriteResponseDto> deleteFavorite(
            @PathVariable Long productId,
            @PathVariable Long customerId) {

        try {
            AddRemoveFavoriteResponseDto response = favoriteProductService.removeFavorite(productId, customerId);
            return ResponseEntity.ok(response);

        } catch (ResourceNotFoundException ex) {
            AddRemoveFavoriteResponseDto dto = new AddRemoveFavoriteResponseDto();
            dto.setStatus(false);
            dto.setMessage(ex.getMessage());
            dto.setFavorite(false);
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(dto);
        }
    }

}
