package com.example.springboot.service;

// import com.example.springboot.entity.Admin;
// import com.example.springboot.entity.Customer;
import com.example.springboot.repository.AdminRepository;
import com.example.springboot.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final AdminRepository adminRepository;
    private final CustomerRepository customerRepository;

    @Autowired
    public CustomUserDetailsService(AdminRepository adminRepository, CustomerRepository customerRepository) {
        this.adminRepository = adminRepository;
        this.customerRepository = customerRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 1) coba Admin
        return adminRepository.findByUsername(username)
            .map(admin -> (UserDetails) admin)
            // 2) jika bukan admin, coba Customer
            .orElseGet(() ->
               customerRepository.findByUsername(username)
                  .map(customer -> (UserDetails) customer)
                  .orElseThrow(() ->
                     new UsernameNotFoundException("User not found: " + username)
                  )
            );
    }
}
