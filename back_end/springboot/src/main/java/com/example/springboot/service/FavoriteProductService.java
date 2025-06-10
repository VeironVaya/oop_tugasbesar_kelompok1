package com.example.springboot.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.springboot.repository.ProductRepository;
import com.example.springboot.dto.response.AddRemoveFavoriteResponseDto;
import com.example.springboot.entity.Product;
import com.example.springboot.exception.DuplicateFavoriteException;
import com.example.springboot.exception.ResourceNotFoundException;
import com.example.springboot.entity.Customer;
import com.example.springboot.entity.FavoriteProduct;
import com.example.springboot.repository.CustomerRepository;
import com.example.springboot.repository.FavoriteProductRepository;


@Service
@Transactional
public class FavoriteProductService {
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final FavoriteProductRepository favoriteProductRepository;

    public FavoriteProductService(ProductRepository productRepository,
                                CustomerRepository customerRepository,
                                FavoriteProductRepository favoriteProductRepository) {
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
        this.favoriteProductRepository = favoriteProductRepository;
    }

    public AddRemoveFavoriteResponseDto addFavorite(Long productId, Long customerId) {
        if (favoriteProductRepository
            .existsByProduct_IdProductAndCustomer_IdCustomer(productId, customerId)) {
        throw new DuplicateFavoriteException(productId, customerId);
    }
        
        Product prodRef = productRepository.getReferenceById(productId);
        Customer custRef = customerRepository.getReferenceById(customerId);

        FavoriteProduct fp = new FavoriteProduct();
        fp.setProduct(prodRef);
        fp.setCustomer(custRef);

        favoriteProductRepository.save(fp);
        AddRemoveFavoriteResponseDto respon = new AddRemoveFavoriteResponseDto();
        respon.setStatus(true);
        respon.setMessage("add to favorite success");
        respon.setFavorite(true);
        return respon;
    }

    public AddRemoveFavoriteResponseDto removeFavorite(Long productId, Long customerId) {
        if (!favoriteProductRepository
        .existsByProduct_IdProductAndCustomer_IdCustomer(productId, customerId)) {
        throw new ResourceNotFoundException(
        "Favorite for productId: " + productId +
        " and customerId: " + customerId +
        " is not available, nothing to remove");
        }

        favoriteProductRepository.deleteByProduct_IdProductAndCustomer_IdCustomer(productId, customerId);
        AddRemoveFavoriteResponseDto respon = new AddRemoveFavoriteResponseDto();
        respon.setStatus(true);
        respon.setMessage("remove from favorite success");
        respon.setFavorite(false);
        return respon;
    }
}
