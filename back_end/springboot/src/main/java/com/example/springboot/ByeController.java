package com.example.springboot;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ByeController {

    @GetMapping("/bye")
    public String bye() {
        return "BYE IPAN BAIK";
    }
}
