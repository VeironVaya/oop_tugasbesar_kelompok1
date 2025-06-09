package com.example.springboot.controller;

import com.example.springboot.dto.request.CustomerDto;
import com.example.springboot.dto.response.CustomerResponseDto;
import com.example.springboot.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/customers/registration")
@RequiredArgsConstructor
public class CustomerController {
    private final CustomerService service;

    @PostMapping
    public ResponseEntity<CustomerResponseDto> register(@RequestBody CustomerDto dto) {
        CustomerResponseDto resp = service.register(dto);
        return ResponseEntity.status(201).body(resp);
    }
}
