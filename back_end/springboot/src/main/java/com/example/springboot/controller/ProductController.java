package com.example.springboot.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PatchMapping;


import com.example.springboot.dto.ProductDto;
import com.example.springboot.entity.Product;
import com.example.springboot.service.ProductService;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<Product> addProduct(@RequestBody ProductDto dto) {
        Product savedProduct = productService.addProduct(dto);
        return ResponseEntity.ok(savedProduct);
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @DeleteMapping("/{name}")
    public ResponseEntity<Void> deleteProduct(@PathVariable("name") String name) {
    productService.deleteProduct(name);
    return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id_product}")
    public ResponseEntity<Product> patchProduct(@PathVariable("id_product") Long id, @RequestBody ProductDto dto) {
        Product updateProduct = productService.patchProduct(id, dto);
        return ResponseEntity.ok(updateProduct);
    }

    @GetMapping("/{id_product}")
    public ResponseEntity<Product> getProductDetail(@PathVariable("id_product") long id) {
        Product product = productService.getProductDetail(id);
        return ResponseEntity.ok(product);
    }

}





