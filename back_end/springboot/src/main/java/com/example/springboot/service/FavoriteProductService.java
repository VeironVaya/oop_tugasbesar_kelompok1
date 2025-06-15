package com.example.springboot.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.springboot.dto.response.AddRemoveFavoriteResponseDto;
import com.example.springboot.dto.response.CustomerFavoritesResponseDto;
import com.example.springboot.dto.response.FavoriteProductResponseDto;
import com.example.springboot.dto.response.ProductResponseDto;
import com.example.springboot.entity.Customer;
import com.example.springboot.entity.FavoriteProduct;
import com.example.springboot.entity.Product;
import com.example.springboot.exception.DuplicateFavoriteException;
import com.example.springboot.exception.ResourceNotFoundException;
import com.example.springboot.repository.CustomerRepository;
import com.example.springboot.repository.FavoriteProductRepository;
import com.example.springboot.repository.ProductRepository;

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

    public CustomerFavoritesResponseDto getAllFavoritesByCustomer(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer with ID " + customerId + " not found"));

        List<FavoriteProduct> favorites = favoriteProductRepository.findByCustomer(customer);

        List<FavoriteProductResponseDto> favItems = favorites.stream().map(fav -> {
            Product product = fav.getProduct();

            ProductResponseDto dto = new ProductResponseDto();
            dto.setIdProduct(product.getIdProduct());
            dto.setName(product.getName());
            dto.setDescription(product.getDescription());
            dto.setPrice(product.getPrice());
            dto.setCategory(product.getCategory());
            dto.setUrlimage(product.getUrlimage());

            FavoriteProductResponseDto itemDto = new FavoriteProductResponseDto();
            itemDto.setIdFavoriteProduct(fav.getId_favorite_product());
            itemDto.setProduct(dto);
            return itemDto;
        }).collect(Collectors.toList());
        CustomerFavoritesResponseDto res = new CustomerFavoritesResponseDto();
        res.setIdCustomer(customer.getIdCustomer());
        res.setFavorites(favItems);
        return res;
    }
}
