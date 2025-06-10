package com.example.springboot.service;

import com.example.springboot.dto.request.CustomerDto;
import com.example.springboot.dto.response.CustomerResponseDto;
import com.example.springboot.entity.Customer;
import com.example.springboot.exception.InvalidDataException;
import com.example.springboot.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class CustomerService {
    private final CustomerRepository repo;
    private final PasswordEncoder encoder;

    public CustomerResponseDto register(CustomerDto dto) {
        if (repo.findByUsername(dto.getUsername()).isPresent()) {
            throw new InvalidDataException("Username " + dto.getUsername() + " already exist");
        }
        ;

        String hashed = encoder.encode(dto.getPassword());

        Customer customer = new Customer(dto.getUsername(), hashed);
        Customer saved = repo.save(customer);

        return new CustomerResponseDto(true, saved.getIdCustomer(), saved.getUsername(),
                "Registration Success on " + Instant.now().toString());
    }
}
