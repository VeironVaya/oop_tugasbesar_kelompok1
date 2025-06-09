package com.example.springboot.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.springboot.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

}
