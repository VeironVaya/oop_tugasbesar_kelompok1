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
import com.example.springboot.dto.response.ProductResponseDto;
import com.example.springboot.dto.response.ProductWithStockResponseDto;
import com.example.springboot.dto.response.SimpleResponseDto;
import com.example.springboot.dto.response.StockResponseDto;
import com.example.springboot.entity.Product;
import com.example.springboot.exception.InvalidDataException;
import com.example.springboot.service.ProductService;
import com.example.springboot.service.StockService;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService productService;
    private final StockService stockService;

    public ProductController(ProductService productService, StockService stockService) {
        this.productService = productService;
        this.stockService = stockService;
    }

    @PostMapping
    public ResponseEntity<?> postProductWithStock(
            @RequestBody ProductWithStockRequestDto dto) {
        try {
            ProductWithStockResponseDto saved = productService.postProductWithStockResponseDto(dto);
            saved.setStatus(true);
            saved.setMessage("Product created successfully");
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(saved);

        } catch (InvalidDataException ex) {
            ProductWithStockResponseDto error = new ProductWithStockResponseDto();
            error.setStatus(false);
            error.setMessage("Invalid product data: " + ex.getMessage());
            return ResponseEntity
                    .badRequest()
                    .body(error);

        } catch (Exception ex) {
            ProductWithStockResponseDto error = new ProductWithStockResponseDto();
            error.setStatus(false);
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
            saved.setStatus(true);
            saved.setMessage("Stock created successfully");
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(saved);

        } catch (InvalidDataException ex) {
            ProductWithStockResponseDto error = new ProductWithStockResponseDto();
            error.setStatus(false);
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
            error.setStatus(false);
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
            updated.setStatus(true);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException ex) {
            ProductWithStockResponseDto response = new ProductWithStockResponseDto();
            response.setStatus(false);
            response.setMessage("Patch failed: " + ex.getMessage());
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
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
            response.setStatus(false);
            response.setMessage("Get failed: " + ex.getMessage());
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(response);
        }

    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> getSearchProduct(@RequestParam(required = false) String keyword) {
        List<Product> products = productService.getProductsByKeyword(keyword);
        return ResponseEntity.ok(products);
    }

}
