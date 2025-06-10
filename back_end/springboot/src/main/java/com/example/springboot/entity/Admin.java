package com.example.springboot.entity;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import lombok.Getter;
import lombok.Setter;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "admin")
@Getter
@Setter
public class Admin implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_admin;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_ADMIN"));
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
