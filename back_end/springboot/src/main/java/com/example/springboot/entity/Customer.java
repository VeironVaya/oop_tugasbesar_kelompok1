package com.example.springboot.entity;

import java.util.Collection;
import java.util.List;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "customer")
@Getter
@Setter
@NoArgsConstructor
public class Customer implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCustomer;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    // One Customer can have many Carts
    @OneToOne(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private Cart cart;

    // One Customer can have many TransactionHistories
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TransactionHistory> transactionHistories;

    // One Customer can favorite many Products
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FavoriteProduct> favorites;

    // ini constructor khusus buat regis doang
    public Customer(String username, String password) {
        this.username = username;
        this.password = password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("Role_Customer"));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;     // akun tidak pernah expire secara otomatis
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;     // akun tidak pernah dikunci
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;     // kredensial (password) tidak pernah expire
    }

    @Override
    public boolean isEnabled() {
        return true;     // akun selalu diizinkan (tidak disable)
    }
}
